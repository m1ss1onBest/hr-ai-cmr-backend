import { Injectable } from '@nestjs/common';
import { IBaseUserRepository } from '../../../contracts/use-cases/base.repository';
import { Prisma, ResumeAnalysis } from 'prisma/generated/client';

export interface CreateResumeAnalysisData {
  candidateId: string;
  skills: string[];
  level: string | null;
  yearsOfExperience: number | null;
  technologies: string[];
  softSkills: string[] | null;
  score: number;
  summary: string;
}

@Injectable()
export class ResumeAnalysisRepository extends IBaseUserRepository {
  async create(data: CreateResumeAnalysisData): Promise<ResumeAnalysis> {
    return await this.prisma.resumeAnalysis.create({
      data: {
        candidateId: data.candidateId,
        skills: data.skills,
        level: data.level,
        yearsOfExperience: data.yearsOfExperience,
        technologies: data.technologies,
        softSkills:
          data.softSkills === null
            ? Prisma.JsonNull
            : (data.softSkills as Prisma.InputJsonValue),
        score: data.score,
        summary: data.summary,
      },
    });
  }

  async findByCandidateId(candidateId: string): Promise<ResumeAnalysis[]> {
    return await this.prisma.resumeAnalysis.findMany({
      where: { candidateId },
      orderBy: { analyzedAt: 'desc' },
    });
  }

  async findLatestByCandidateId(
    candidateId: string,
  ): Promise<ResumeAnalysis | null> {
    return await this.prisma.resumeAnalysis.findFirst({
      where: { candidateId },
      orderBy: { analyzedAt: 'desc' },
    });
  }
}
