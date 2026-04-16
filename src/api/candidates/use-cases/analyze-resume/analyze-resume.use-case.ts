import { Injectable } from '@nestjs/common';
import { IAnalyzeResumeUseCase } from './analyze-resume.interface';
import {
  AnalyzeResumeRequest,
  ResumeAnalysisResponse,
} from '../../dto/analyze-resume.dto';
import { AiService } from 'src/shared/infrastructure/ai/ai.service';
import { ResumeAnalysisRepository } from 'src/shared/infrastructure/database/repositories/resume-analysis.repository';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class AnalyzeResumeUseCase implements IAnalyzeResumeUseCase {
  private readonly logger = new EventHandlerLogger(AnalyzeResumeUseCase.name);

  constructor(
    private readonly aiService: AiService,
    private readonly resumeAnalysisRepo: ResumeAnalysisRepository,
    private readonly candidatesRepo: CandidatesRepository,
  ) {}

  async run(
    request: AnalyzeResumeRequest & { candidateId: string },
  ): Promise<ResumeAnalysisResponse> {
    const candidate = await this.candidatesRepo.findOneById(
      request.candidateId,
    );
    if (!candidate) {
      this.logger.notFound(
        `Candidate with id=${request.candidateId} not found`,
      );
    }

    const analysisResult = await this.aiService.analyzeResume(
      request.resumeText,
    );
    await this.resumeAnalysisRepo.create({
      candidateId: request.candidateId,
      skills: analysisResult.skills,
      level: analysisResult.level,
      yearsOfExperience: analysisResult.yearsOfExperience,
      technologies: analysisResult.technologies,
      softSkills: analysisResult.softSkills,
      score: analysisResult.score,
      summary: analysisResult.summary,
    });

    this.logger.log(
      `Resume analysis saved | candidateId=${request.candidateId} | score=${analysisResult.score}`,
    );

    return analysisResult;
  }
}
