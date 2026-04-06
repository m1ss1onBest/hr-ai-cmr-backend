import { Module, type Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { VacanciesRepository } from './repositories/vacancies.repository';
import { CandidatesRepository } from './repositories/candidates.repository';
import { ResumeAnalysisRepository } from './repositories/resume-analysis.repository';
import { CommentsRepository } from './repositories/comments.repository';

export const REPOSITORIES: Provider[] = [
  UsersRepository,
  VacanciesRepository,
  CandidatesRepository,
  ResumeAnalysisRepository,
  CommentsRepository,
];

@Module({
  providers: [...(REPOSITORIES as Provider[]), PrismaService],
  exports: [...(REPOSITORIES as Provider[]), PrismaService],
})
export class DatabaseModule {}
