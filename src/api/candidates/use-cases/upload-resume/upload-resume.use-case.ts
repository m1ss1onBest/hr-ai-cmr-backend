import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { IFileStorage } from 'src/shared/infrastructure/files/storage/storage.interface';
import {
  IUploadResumeUseCase,
  UploadResumeRequest,
} from './upload-resume.interface';

@Injectable()
export class UploadResumeUseCase implements IUploadResumeUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly candidatesRepo: CandidatesRepository,
    private readonly storage: IFileStorage,
  ) {
    logger.setContext(UploadResumeUseCase.name);
  }

  async run(params: UploadResumeRequest): Promise<{ cvUrl: string }> {
    const candidate = await this.candidatesRepo.findOneById(params.candidateId);
    if (!candidate) {
      this.logger.notFound(`Candidate with id=${params.candidateId} not found`);
    }

    const saved = await this.storage.saveResume({
      buffer: params.file.buffer,
      originalName: params.file.originalname,
      mimeType: params.file.mimetype,
      candidateId: params.candidateId,
    });

    const updated = await this.candidatesRepo.update(params.candidateId, {
      cvUrl: saved.url,
    });

    this.logger.log(
      `Resume uploaded | candidateId=${params.candidateId} | url=${updated.cvUrl}`,
    );

    return { cvUrl: updated.cvUrl! };
  }
}
