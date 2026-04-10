import { Injectable } from '@nestjs/common';
import { IUploadFileUsesCase } from './upload-file.interface';
import { MinioService } from 'src/shared/infrastructure/storage/services/minio.service';
import { UploadFileResponse } from '../../dto/upload-filel.dto';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class UploadFileUseCase implements IUploadFileUsesCase {
  constructor(
    private readonly storageService: MinioService,
    private readonly event: EventHandlerLogger,
  ) {}

  async run(file: Express.Multer.File): Promise<UploadFileResponse> {
    if (!file) {
      this.event.badRequest('No file to upload');
    }

    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectName = `${timestamp}-${originalName}`;

    await this.storageService.uploadFile(objectName, file.buffer);
    const msg = `File ${objectName} uploaded successfully`;

    this.event.log(msg);
    return {
      message: msg,
    };
  }
}
