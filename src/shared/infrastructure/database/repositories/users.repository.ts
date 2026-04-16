import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from '../../../contracts/use-cases/base.repository';
import { Prisma, User } from 'prisma/generated/client';
import { CreateUserRequest } from 'src/api/users/dto/create.user.dto';
import { SearchUsersQuery } from 'src/api/users/dto/search.users.dto';
import { UserModel } from 'prisma/generated/models';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';

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

  async searchMany(
    searchQuery: SearchUsersQuery,
  ): Promise<PaginatedResponse<UserModel>> {
    const page = searchQuery.page ?? 1;
    const limit = searchQuery.limit ?? 20;

    const sortBy = searchQuery.sortBy ?? 'createdAt';
    const order = searchQuery.order ?? 'desc';

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (searchQuery.search) {
      where.OR = [
        { name: { contains: searchQuery.search, mode: 'insensitive' } },
        { email: { contains: searchQuery.search, mode: 'insensitive' } },
      ];
    }

    if (searchQuery.name) {
      where.name = searchQuery.name;
    }

    if (searchQuery.email) {
      where.email = searchQuery.email;
    }

    if (searchQuery.createdAfter || searchQuery.createdBefore) {
      where.createdAt = {
        gte: searchQuery.createdAfter,
        lte: searchQuery.createdBefore,
      };
    }

    const queryBuilder: Prisma.UserFindManyArgs = {
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany(queryBuilder),
      this.prisma.user.count({ where: queryBuilder.where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages,
      },
    };
  }

  async updatePassword(id: string, newPass: string): Promise<UserModel> {
    return await this.prisma.user.update({
      where: { id },
      data: { password: newPass },
    });
  }

  async transaction<T>(
    fn: (
      tx: import('../../../../../prisma/generated/client').PrismaClient,
    ) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction<T>(fn);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.prisma.user.delete({
      where: { email },
    });
  }
}
