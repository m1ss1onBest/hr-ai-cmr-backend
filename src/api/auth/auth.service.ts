import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserRole } from 'prisma/generated/enums';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ token: string }> {
    const existing = await this.usersRepo.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepo.create({
      email: dto.email,
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
}
