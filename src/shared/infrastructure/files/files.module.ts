import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import filesConfig from './files.config';
import { LocalFileStorage } from './storage/local-file.storage';
import { IFileStorage } from './storage/storage.interface';

@Module({
  imports: [ConfigModule.forFeature(filesConfig)],
  providers: [
    {
      provide: IFileStorage,
      useClass: LocalFileStorage,
    },
  ],
  exports: [IFileStorage],
})
export class FilesModule {}

