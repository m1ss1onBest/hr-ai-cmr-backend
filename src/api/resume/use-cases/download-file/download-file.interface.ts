import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { DownloadFileUseCase } from './download-file.use-case';
import { Readable } from 'stream';

export abstract class IDownloadFileUseCase extends IBaseUseCase<
  string,
  Readable
> {}

export const DOWNLOAD_FILE_USE_CASE_PROVIDER: Provider = {
  provide: IDownloadFileUseCase,
  useClass: DownloadFileUseCase,
};
