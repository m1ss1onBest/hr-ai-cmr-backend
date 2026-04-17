import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'stream';
import { IStorageService } from '../storage.interface';
import { StorageConfig } from '../storage.config';

@Injectable()
export class MinioService implements OnModuleInit, IStorageService {
  private client: Client;
  private bucket: string;
  private readonly logger: Logger = new Logger(MinioService.name);

  constructor(private readonly config: StorageConfig) {}

  async onModuleInit() {
    this.client = new Client({
      endPoint: this.config.STORAGE_HOST,
      port: this.config.STORAGE_PORT,
      useSSL: this.config.STORAGE_USE_SSL,
      accessKey: this.config.MINIO_ROOT_USER,
      secretKey: this.config.MINIO_ROOT_PASSWORD,
    });

    this.bucket = this.config.STORAGE_BUCKET;

    await this._checkBucket(this.bucket);
    this.logger.log(`Storage connection successfully`);
  }

  async uploadFile(objectName: string, buffer: Buffer): Promise<void> {
    await this.client.putObject(this.bucket, objectName, buffer);
  }

  async downloadFile(objectName: string): Promise<Readable> {
    return await this.client.getObject(this.bucket, objectName);
  }

  async _checkBucket(bucketName: string) {
    const maxRetries = 5;
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < maxRetries; i++) {
      try {
        const exists = await this.client.bucketExists(bucketName);

        if (!exists) {
          await this.client.makeBucket(bucketName);
          this.logger.log(
            `Storage bucket \`${bucketName}\` created successfully`,
          );
        }

        return;
      } catch (err) {
        this.logger.error(
          `MinIO not ready, retry ${i + 1}/${maxRetries}:`,
          err,
        );
        await delay(2000);
      }
    }

    this.logger.error(`MinIO is not available`);
  }
}
