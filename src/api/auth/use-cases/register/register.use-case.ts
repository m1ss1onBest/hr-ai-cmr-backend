import { Injectable } from '@nestjs/common';
import { IRegisterUseCase } from './register.interface';
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from '../../dto/register.dto';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import bcrypt from 'bcryptjs';
import { User } from 'src/shared/domain/users/user.entity';
import { MailService } from 'src/shared/infrastructure/mail/mail.service';

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  private readonly logger = new EventHandlerLogger(RegisterUseCase.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async run(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userRequestRes = await this.usersRepo.findOneByEmail(request.email);
    if (userRequestRes) {
      this.logger.conflict('Email already taken');
    }

    const passwordHash = await bcrypt.hash(request.password, 10);

    const token = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    const user = await this.usersRepo.create({
      email: request.email,
      name: request.name,
      password: passwordHash,
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpiresAt: expiresAt,
    } as any);

    await this.mailService.sendVerifyEmail(user.email, token);

    this.logger.log('User registered successfully');
    return new User(user).safe();
  }
}
