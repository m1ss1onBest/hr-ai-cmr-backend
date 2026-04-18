import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from '../../../contracts/use-cases/base.repository';
import {
  MatchCandidateWithVacancy,
  Prisma,
  MatchRecommendation,
} from 'prisma/generated/client';

export type UpsertMatchCandidateVacancyData = {
  candidateId: string;
  vacancyId: string;
  recommendation: MatchRecommendation;
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
};

@Injectable()
export class MatchCandidateVacancyRepository extends IBaseUserRepository {
  async upsert(
    data: UpsertMatchCandidateVacancyData,
  ): Promise<MatchCandidateWithVacancy> {
    return await this.prisma.matchCandidateWithVacancy.upsert({
      where: {
        candidateId_vacancyId: {
          candidateId: data.candidateId,
          vacancyId: data.vacancyId,
        },
      },
      update: {
        recommendation: data.recommendation,
        matchPercentage: data.matchPercentage,
        strengths: data.strengths as Prisma.InputJsonValue,
        gaps: data.gaps as Prisma.InputJsonValue,
        analyzedAt: new Date(),
      },
      create: {
        candidateId: data.candidateId,
        vacancyId: data.vacancyId,
        recommendation: data.recommendation,
        matchPercentage: data.matchPercentage,
        strengths: data.strengths as Prisma.InputJsonValue,
        gaps: data.gaps as Prisma.InputJsonValue,
      },
    });
  }
}
