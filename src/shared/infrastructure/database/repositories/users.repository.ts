import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from '../../../contracts/use-cases/base.repository';
import { User } from 'prisma/generated/client';
import { CreateUserRequest } from 'src/api/users/dto/create.user.dto';

@Injectable()
export class UsersRepository extends IBaseUserRepository {
  async findOneById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserRequest): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async transaction<T>(
    fn: (
      tx: import('../../../../../prisma/generated/client').PrismaClient,
    ) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction<T>(fn);
  }
}
