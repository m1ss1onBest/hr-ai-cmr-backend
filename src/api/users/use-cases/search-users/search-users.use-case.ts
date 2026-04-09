import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import {
  SearchUsersQuery,
  SearchUsersResponse,
} from '../../dto/search.users.dto';
import { ISearchUsersUseCase } from './search-users.interface';
import { User } from 'src/shared/domain/users/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchUsersUseCase implements ISearchUsersUseCase {
  constructor(private readonly users: UsersRepository) {}

  async run(request: SearchUsersQuery): Promise<SearchUsersResponse> {
    const usersData = await this.users.searchMany(request);

    return {
      data: usersData.data.map((u) => new User(u).safe()),
      meta: usersData.meta,
    };
  }
}
