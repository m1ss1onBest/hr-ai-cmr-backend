import { Module, type Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { VacanciesRepository } from './repositories/vacancies.repository';
import { CandidatesRepository } from './repositories/candidates.repository';
import { ResumeAnalysisRepository } from './repositories/resume-analysis.repository';
import { CommentsRepository } from './repositories/comments.repository';
import { MatchCandidateVacancyRepository } from './repositories/match-candidate-vacancy.repository';

export const REPOSITORIES: Provider[] = [
  UsersRepository,
  VacanciesRepository,
  CandidatesRepository,
  ResumeAnalysisRepository,
  CommentsRepository,
  MatchCandidateVacancyRepository,
];

@Module({
  providers: [...REPOSITORIES, PrismaService],
  exports: [...REPOSITORIES, PrismaService],
})
export class DatabaseModule {}
