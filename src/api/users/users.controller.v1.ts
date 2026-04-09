import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { SearchUsersQuery, SearchUsersResponse } from './dto/search.users.dto';
import { ISearchUsersUseCase } from './use-cases/search-users/search-users.interface';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/modules/guards/roles.guard';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersControllerV1 {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly searchUsers: ISearchUsersUseCase,
  ) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    // WIP implement DTO
    return (await this.usersRepo.findOneById(id)) ?? {};
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getUsers(
    @Query() query: SearchUsersQuery,
  ): Promise<SearchUsersResponse> {
    return await this.searchUsers.run(query);
  }
}
