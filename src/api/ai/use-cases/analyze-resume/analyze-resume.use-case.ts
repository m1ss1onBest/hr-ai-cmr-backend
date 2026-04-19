import { Injectable } from '@nestjs/common';
import { IAnalyzeResumeUseCase } from './analyze-resume.interface';
import { AiService } from 'src/shared/infrastructure/ai/ai.service';
import { ResumeAnalysisRepository } from 'src/shared/infrastructure/database/repositories/resume-analysis.repository';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { ResumeAnalysisResponse } from '../../dto/analyze-resume.dto';
import { MinioService } from 'src/shared/infrastructure/storage/services/minio.service';

@Injectable()
export class AnalyzeResumeUseCase implements IAnalyzeResumeUseCase {
  private readonly logger = new EventHandlerLogger(AnalyzeResumeUseCase.name);

  constructor(
    private readonly aiService: AiService,
    private readonly resumeAnalysisRepo: ResumeAnalysisRepository,
    private readonly candidatesRepo: CandidatesRepository,
    private readonly storageService: MinioService,
  ) {}

  async run(candidateId: string): Promise<ResumeAnalysisResponse> {
    const candidate = await this.candidatesRepo.findOneById(candidateId);
    if (!candidate) {
      return this.logger.notFound(`Candidate with id=${candidateId} not found`);
    }
    const filename = candidate?.cvUrl;
    if (!filename) {
      return this.logger.notFound(
        `Candidate with id=${candidateId} does not have a resume`,
      );
    }

    const file = await this.storageService.downloadFile(filename);
    if (!file) {
      return this.logger.notFound(`File ${filename} was not found`);
    }

    const analysisResult = await this.aiService.analyzeResume(file);

    await this.resumeAnalysisRepo.create({
      candidateId: candidateId,
      skills: analysisResult.skills,
      level: analysisResult.level,
      yearsOfExperience: analysisResult.yearsOfExperience,
      technologies: analysisResult.technologies,
      softSkills: analysisResult.softSkills,
      score: analysisResult.score,
      summary: analysisResult.summary,
    });

    this.logger.log(
      `Resume analysis saved | candidateId=${candidateId} | score=${analysisResult.score}`,
    );

    return analysisResult;
  }
}
