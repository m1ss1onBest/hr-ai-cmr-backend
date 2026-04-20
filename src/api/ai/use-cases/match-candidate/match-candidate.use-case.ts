import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { AiService } from 'src/shared/infrastructure/ai/ai.service';
import { IMatchCandidateUseCase } from './match-candidate.interface';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { ResumeAnalysisRepository } from 'src/shared/infrastructure/database/repositories/resume-analysis.repository';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import {
  MatchCandidateResponse,
  MatchRecommendation,
} from '../../dto/match-candidate.dto';
import { MatchCandidateVacancyRepository } from 'src/shared/infrastructure/database/repositories/match-candidate-vacancy.repository';

@Injectable()
export class MatchCandidateUseCase implements IMatchCandidateUseCase {
  private readonly logger = new EventHandlerLogger(MatchCandidateUseCase.name);
  constructor(
    private readonly aiService: AiService,
    private readonly resumeAnalysis: ResumeAnalysisRepository,
    private readonly vacancyRepository: VacanciesRepository,
    private readonly matchCandidateVacancyRepository: MatchCandidateVacancyRepository,
  ) {}

  async run(req: {
    candidateId: string;
    vacancyId: string;
  }): Promise<MatchCandidateResponse> {
    try {
      this.logger.log(
        `Matching candidate ${req.candidateId} with vacancy ${req.vacancyId}`,
      );

      const resume = await this.resumeAnalysis.findLatestByCandidateId(
        req.candidateId,
      );
      if (!resume) {
        throw new NotFoundException(
          'Аналіз резюме для цього кандидата не знайдено',
        );
      }

      const vacancy = await this.vacancyRepository.findOneById(req.vacancyId);
      if (!vacancy) {
        throw new NotFoundException('Вакансію не знайдено');
      }

      const matchResult = await this.aiService.matchCandidateWithVacancy(
        JSON.stringify(resume),
        JSON.stringify(vacancy),
      );

      const savedMatch = await this.matchCandidateVacancyRepository.upsert({
        candidateId: req.candidateId,
        vacancyId: req.vacancyId,
        recommendation: matchResult.recommendation as any,
        matchPercentage: matchResult.matchPercentage,
        strengths: matchResult.strengths,
        gaps: matchResult.gaps,
      });

      return {
        matchPercentage: savedMatch.matchPercentage,
        strengths: savedMatch.strengths as string[],
        gaps: savedMatch.gaps as string[],
        recommendation:
          savedMatch.recommendation as unknown as MatchRecommendation,
        analyzedAt: savedMatch.analyzedAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to match candidate ${req.candidateId} with vacancy ${req.vacancyId}`,
        error instanceof Error ? error.stack : 'Unknown error',
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Сталася помилка під час аналізу кандидата та вакансії',
      );
    }
  }
}
