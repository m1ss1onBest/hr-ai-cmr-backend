export {};
import { Injectable } from '@nestjs/common';
import { IRegisterUseCase } from './register.interface';
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from '../../dto/register.dto';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(private readonly usersRepo: UsersRepository) {}

  run(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // some code with users repository
    // this.usersRepo.createUser(request);
    throw new Error(
      `Method not implemented. Command: ${JSON.stringify(request)}`,
    );
  }
}
