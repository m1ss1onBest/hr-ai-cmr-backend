import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'stream';
import { IStorageService } from '../storage.interface';
import { StorageConfig } from '../storage.config';

@Injectable()
export class MinioService implements OnModuleInit, IStorageService {
  private client: Client;
  private bucket: string;

  constructor(private readonly config: StorageConfig) {}

  onModuleInit() {
    this.client = new Client({
      endPoint: this.config.STORAGE_HOST,
      port: this.config.STORAGE_PORT,
      useSSL: this.config.STORAGE_USE_SSL,
      accessKey: this.config.MINIO_ROOT_USER,
      secretKey: this.config.MINIO_ROOT_PASSWORD,
    });

    this.bucket = this.config.STORAGE_BUCKET;
  }

  async uploadFile(objectName: string, buffer: Buffer): Promise<void> {
    await this.client.putObject(this.bucket, objectName, buffer);
  }

  async downloadFile(objectName: string): Promise<Readable> {
    return await this.client.getObject(this.bucket, objectName);
  }
}
