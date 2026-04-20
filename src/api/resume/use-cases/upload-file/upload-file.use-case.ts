import { Injectable } from '@nestjs/common';
import { IUploadFileUsesCase } from './upload-file.interface';
import { MinioService } from 'src/shared/infrastructure/storage/services/minio.service';
import {
  UploadFileResponse,
  UploadResumeData,
} from '../../dto/upload-filel.dto';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';

@Injectable()
export class UploadFileUseCase implements IUploadFileUsesCase {
  constructor(
    private readonly storageService: MinioService,
    private readonly event: EventHandlerLogger,
    private readonly candidates: CandidatesRepository,
  ) {}

  async run(data: UploadResumeData): Promise<UploadFileResponse> {
    if (!data.file) {
      this.event.badRequest('No file to upload');
    }

    const timestamp = Date.now();
    const originalName = data.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectName = `${timestamp}-${originalName}`;

    const candidate = await this.candidates.setCvUrl(data.id, objectName);

    if (!candidate) {
      this.event.notFound(`Candidate ${data.id} does not exist`);
    }

    await this.storageService.uploadFile(objectName, data.file.buffer);
    const msg = `File ${objectName} for candidate ${candidate.id} uploaded successfully`;

    this.event.log(msg);
    return {
      message: msg,
    };
  }
}
