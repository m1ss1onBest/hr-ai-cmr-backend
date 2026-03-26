import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from './base.repository';
import { Vacancy, Prisma } from 'prisma/generated/client';

@Injectable()
export class VacansiesRepository extends IBaseUserRepository {
  async findOneById(id: string): Promise<Vacancy | null> {
    return await this.prisma.vacancy.findUnique({ where: { id } });
  }

  async create(data: Prisma.VacancyUncheckedCreateInput): Promise<Vacancy> {
    return await this.prisma.vacancy.create({ data });
  }

  async update(id: string, data: Prisma.VacancyUpdateInput): Promise<Vacancy> {
    return await this.prisma.vacancy.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Vacancy> {
    return await this.prisma.vacancy.delete({ where: { id } });
  }

  async findAll(): Promise<Vacancy[]> {
    return await this.prisma.vacancy.findMany();
  }
}
