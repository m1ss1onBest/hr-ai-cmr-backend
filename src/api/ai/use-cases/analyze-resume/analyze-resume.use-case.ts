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
    if (!candidate?.cvUrl) {
      return this.logger.notFound(
        `Resume not found for candidate ${candidateId}`,
      );
    }

    const fileBuffer = await this.storageService.getFileBuffer(candidate.cvUrl);

    const fileType = await this.storageService.checkFileType(fileBuffer);
    if (fileType === 'UNSUPPORTED') {
      this.logger.warn(`Unsupported file format attempted: ${candidate.cvUrl}`);
      throw new Error('We support only PDF and DOCX formats');
    }

    let analysisResult: ResumeAnalysisResponse;

    try {
      if (fileType === 'PDF') {
        analysisResult = await this.aiService.analyzeResumeFromFile(
          fileBuffer,
          'application/pdf',
        );
      } else {
        const text = await this.storageService.convertDocxToText(fileBuffer);
        analysisResult = await this.aiService.analyzeResumeFromText(text);
      }
    } catch (error) {
      this.logger.error('AI Analysis failed', error);
      throw error;
    }
    await this.resumeAnalysisRepo.create({
      candidateId,
      ...analysisResult,
    });

    return analysisResult;
  }
}
