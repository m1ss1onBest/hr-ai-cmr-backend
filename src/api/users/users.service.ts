import { Injectable } from '@nestjs/common';
import { SafeUserData, User } from 'src/shared/domain/users/user.entity';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getOneById(id: string): Promise<SafeUserData | undefined> {
    const user = await this.usersRepo.findOneById(id);
    if (!user) {
      return undefined;
    }
    return new User(user).safe();
  }
}
