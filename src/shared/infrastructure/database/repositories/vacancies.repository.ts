import { Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUserRepository } from '../../../contracts/use-cases/base.repository';
import { Vacancy, Prisma } from 'prisma/generated/client';

@Injectable()
export class VacanciesRepository extends IBaseUserRepository {
  async findOneById(id: string): Promise<Vacancy | null> {
    return await this.prisma.vacancy.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async create(
    data: Omit<Prisma.VacancyUncheckedCreateInput, 'id'>,
  ): Promise<Vacancy> {
    return await this.prisma.vacancy.create({ data });
  }

  async update(id: string, data: Prisma.VacancyUpdateInput): Promise<Vacancy> {
    const existing = await this.findOneById(id);
    if (!existing) throw new NotFoundException('Vacancy not found');

    return await this.prisma.vacancy.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Vacancy> {
    const existing = await this.findOneById(id);
    if (!existing) throw new NotFoundException('Vacancy not found');
    return await this.prisma.vacancy.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAll(): Promise<Vacancy[]> {
    return await this.prisma.vacancy.findMany({
      where: { deletedAt: null },
    });
  }
}
