import { MinioService } from 'src/shared/infrastructure/storage/services/minio.service';
import { IDownloadFileUseCase } from './download-file.interface';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DownloadFileUseCase implements IDownloadFileUseCase {
  constructor(
    private readonly storageService: MinioService,
    private readonly event: EventHandlerLogger,
  ) {}

  async run(path: string): Promise<Readable> {
    const fielStream = await this.storageService.downloadFile(path);
    if (!fielStream) {
      this.event.notFound(`File ${path} was not found`);
    }

    this.event.log(`File ${path} downloaded successfully`);
    return fielStream;
  }
}
