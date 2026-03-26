import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from './base.repository';
import { User } from 'prisma/generated/client';

@Injectable()
export class UsersRepository extends IBaseUserRepository {
  async findOneById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Pick<User, 'email' | 'password' | 'role'>): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
