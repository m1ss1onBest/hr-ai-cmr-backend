import { Module } from '@nestjs/common';
import { MinioService } from './services/minio.service';
import { StorageConfig } from './storage.config';

export const STORAGE_MODULE_PROVIDERS = [StorageConfig, MinioService];

@Module({
  imports: [],
  providers: [...STORAGE_MODULE_PROVIDERS],
  exports: [...STORAGE_MODULE_PROVIDERS],
})
export class StorageModule {}
