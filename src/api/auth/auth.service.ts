import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
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
      return await this.usersRepo.transaction(async (tx) => {
        const existing = await tx.user.findUnique({
          where: { email: dto.email },
        });
        if (existing) {
          throw new ConflictException('Email already taken');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            password: passwordHash,
            role: UserRole.HR,
          },
        });

        const payload = {
          sub: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };

        const accessToken = await this.jwtService.generateAccessToken(payload);
        const { token: refreshToken } =
          await this.jwtService.generateRefreshToken(payload);

        await this.mailService.sendVerifyEmail(user.email);

        const { password: _password, ...safeUser } = user;

        return { accessToken, refreshToken, user: safeUser };
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
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
    const user: User | null = await this.usersRepo.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
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

    const { password: _password, ...safeUser } = user;

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
}
