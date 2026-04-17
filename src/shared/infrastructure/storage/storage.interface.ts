import { Readable } from 'stream';

export abstract class IStorageService {
  abstract uploadFile(objectName: string, buffer: Buffer): Promise<void>;
  abstract downloadFile(objectName: string): Promise<Readable>;
  abstract _checkBucket(bucketName: string);
}
