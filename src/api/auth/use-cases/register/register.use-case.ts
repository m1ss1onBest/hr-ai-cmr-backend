export {};
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

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly event: EventHandlerLogger,
  ) {
    this.event.setContext(RegisterUseCase.name);
  }

  async run(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userRequestRes = await this.usersRepo.findOneByEmail(request.email);
    if (userRequestRes) {
      this.event.conflict('Email already taken');
    }

    const passwordHash = await bcrypt.hash(request.password, 10);

    const user = await this.usersRepo.create({
      email: request.email,
      name: request.name,
      password: passwordHash,
    });

    this.event.log('User registered successfully');
    return new User(user).safe();
  }
}
