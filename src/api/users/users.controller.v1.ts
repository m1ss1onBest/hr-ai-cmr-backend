import { Controller, Get, Param } from '@nestjs/common';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';

@Controller('/v1/users')
export class UsersControllerV1 {
  constructor(private readonly usersRepo: UsersRepository) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    // WIP implement DTO
    return (await this.usersRepo.findOneById(id)) ?? {};
  }

  async test() {

  }
}
