import { Module } from '@nestjs/common';
import { StorageModule } from 'src/shared/infrastructure/storage/storage.module';
import { ResumeControllerV1 } from './resume.controller.v1';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { UPLOAD_FILE_USE_CASE_PROVIDER } from './use-cases/upload-file/upload-file.interface';
import { DOWNLOAD_FILE_USE_CASE_PROVIDER } from './use-cases/download-file/download-file.interface';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';

export const RESUME_MODULE_PROVIDERS = [
  UPLOAD_FILE_USE_CASE_PROVIDER,
  DOWNLOAD_FILE_USE_CASE_PROVIDER,
];

@Module({
  imports: [StorageModule, LoggerModule, DatabaseModule],
  controllers: [ResumeControllerV1],
  providers: [...RESUME_MODULE_PROVIDERS],
  exports: [...RESUME_MODULE_PROVIDERS],
})
export class ResumeModule {}
