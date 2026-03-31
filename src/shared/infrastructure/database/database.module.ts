import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { VacanciesRepository } from './repositories/vacancies.repository';
import { CandidatesRepository } from './repositories/candidates.repository';

export const REPOSITORIES = [
  UsersRepository,
  VacanciesRepository,
  CandidatesRepository,
];

@Module({
  providers: [...REPOSITORIES, PrismaService],
  exports: [...REPOSITORIES, PrismaService],
})
export class DatabaseModule {}
