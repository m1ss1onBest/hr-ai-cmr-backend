import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../../prisma/generated/enums';
import { User } from '../../../prisma/generated/client';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { LoginUserRequest, RegisterUserRequest } from './dto';
import { IJwtTokensService } from './modules/jwt/jwt.interface';
import { JwtRefreshTokenStore } from './modules/jwt/jwt-refresh.store';
import { MailService } from 'src/shared/infrastructure/mail/mail.service';

type AuthUserResponse = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: IJwtTokensService,
    private readonly refreshStore: JwtRefreshTokenStore,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterUserRequest): Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthUserResponse;
  }> {
    try {
      this.logger.log(`Register attempt: ${dto.email}`);
      // 1) Create user or re-send verification token inside a transaction
      const result = await this.usersRepo.transaction(async (tx) => {
        const existing = await tx.user.findUnique({
          where: { email: dto.email },
        });

        const token = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join('');
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 min

        if (existing) {
          // If user exists but isn't verified yet, rotate token and re-send email.
          if (!existing.isEmailVerified) {
            this.logger.log(
              `Register called for unverified email. Re-issuing verification token: ${dto.email}`,
            );

            const updated = await tx.user.update({
              where: { email: dto.email },
              data: {
                // Optionally allow changing name on repeated register
                name: dto.name ?? existing.name,
                emailVerificationToken: token,
                emailVerificationExpiresAt: expiresAt,
              },
            });

            const safeUser = (({ password, ...rest }) => rest)(updated);
            return { accessToken: '', refreshToken: '', user: safeUser };
          }

          // Verified user -> real conflict
          this.logger.warn(`Register failed: email already taken (${dto.email})`);
          throw new ConflictException('Email already taken');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            password: passwordHash,
            role: UserRole.HR,
            isEmailVerified: false,
            emailVerificationToken: token,
            emailVerificationExpiresAt: expiresAt,
          },
        });

        const safeUser = (({ password, ...rest }) => rest)(user);

        return { accessToken: '', refreshToken: '', user: safeUser };
      });

      const fresh = await this.usersRepo.findOneByEmail(result.user.email);
      this.logger.log(`Verification token generated for ${result.user.email}`);

      // 2) Side effects *after* transaction.

      try {
        await this.mailService.sendVerifyEmail(
          result.user.email,
          fresh?.emailVerificationToken ?? '',
        );
      } catch (e: unknown) {
        const isProd = process.env.MAIL_ENABLED === 'production';
        this.logger.error('Verify email send failed', e as any);

        if (isProd) {
          await this.usersRepo.deleteByEmail(result.user.email);
          throw e;
        }
      }

      return result;
    } catch (e: unknown) {
      this.logger.error('Register failed', e as any);
      const err = e as { code?: unknown } | undefined;
      if (err?.code === 'P2002') {
        throw new ConflictException('Email already taken');
      }
      if (e instanceof ConflictException) throw e;
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: LoginUserRequest): Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthUserResponse;
  }> {
    this.logger.log(`Login attempt: ${dto.email}`);
    const user: User | null = await this.usersRepo.findOneByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Login failed: user not found (${dto.email})`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      this.logger.warn(`Login failed: invalid password (${dto.email})`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      this.logger.warn(`Login blocked: email not verified (${user.email})`);
      throw new UnauthorizedException('Email is not verified');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.jwtService.generateAccessToken(payload);
    const { token: refreshToken } =
      await this.jwtService.generateRefreshToken(payload);

    const safeUser = (({ password, ...rest }) => rest)(user);

    return { accessToken, refreshToken, user: safeUser };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (this.refreshStore.isRevoked(payload.jti)) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const user = await this.usersRepo.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'User associated with this token does not exist',
      );
    }

    const accessToken = await this.jwtService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { accessToken };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload) return;

    this.refreshStore.revoke(payload.jti);
  }

  async verifyEmail(
    email: string,
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepo.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification data');
    }

    if (user.isEmailVerified) {
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      const accessToken = await this.jwtService.generateAccessToken(payload);
      const { token: refreshToken } =
        await this.jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
      this.logger.warn(`Email verification failed (invalid token) for ${email}`);
      throw new UnauthorizedException('Invalid verification token');
    }

    if (
      user.emailVerificationExpiresAt &&
      user.emailVerificationExpiresAt.getTime() < Date.now()
    ) {
      this.logger.warn(`Email verification failed (token expired) for ${email}`);
      throw new UnauthorizedException('Verification token expired');
    }

    const updated = await this.usersRepo.transaction(async (tx) => {
      return await tx.user.update({
        where: { email },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        },
      });
    });

    this.logger.log(`Email verified successfully for ${updated.email}`);

    const payload = {
      sub: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
    };

    const accessToken = await this.jwtService.generateAccessToken(payload);
    const { token: refreshToken } =
      await this.jwtService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
