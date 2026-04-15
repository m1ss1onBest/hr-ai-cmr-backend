import { Readable } from 'stream';

export abstract class IStorageService {
  abstract uploadFile(objectName: string, buffer: Buffer);
  abstract downloadFile(objectName: string): Promise<Readable>;
}
