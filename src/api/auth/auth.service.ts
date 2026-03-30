import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../../prisma/generated/enums';
import { User } from '../../../prisma/generated/client';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { LoginUserRequest, RegisterUserRequest } from './dto';

type AuthUserResponse = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserRequest): Promise<{ token: string }> {
    const existing = await this.usersRepo.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepo.create({
      email: dto.email,
      name: dto.name,
      password: passwordHash,
      role: UserRole.HR,
    });

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: dto.name,
    });

    return { token };
  }

  async login(
    dto: LoginUserRequest,
  ): Promise<{ token: string; user: AuthUserResponse }> {
    const user: User | null = await this.usersRepo.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // omit password field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return { token, user: safeUser };
  }
}
