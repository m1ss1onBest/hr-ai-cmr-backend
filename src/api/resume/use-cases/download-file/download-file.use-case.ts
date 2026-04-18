import { MinioService } from 'src/shared/infrastructure/storage/services/minio.service';
import { FileDto, IDownloadFileUseCase } from './download-file.interface';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';

@Injectable()
export class DownloadFileUseCase implements IDownloadFileUseCase {
  constructor(
    private readonly storageService: MinioService,
    private readonly event: EventHandlerLogger,
    private readonly candidates: CandidatesRepository,
  ) {}

  async run(candidateId: string): Promise<FileDto> {
    const candidate = await this.candidates.findOneById(candidateId);
    if (!candidate) {
      return this.event.badRequest(`Candidate ${candidateId} does not exist`);
    }

    const filename = candidate?.cvUrl;

    if (!filename) {
      return this.event.badRequest(
        `Candidste ${candidateId} does not have a resume yet`,
      );
    }

    const fielStream = await this.storageService.downloadFile(filename);
    if (!fielStream) {
      this.event.notFound(`File ${filename} was not found`);
    }

    this.event.log(`File ${filename} downloaded successfully`);
    return { filename, file: fielStream };
  }
}
