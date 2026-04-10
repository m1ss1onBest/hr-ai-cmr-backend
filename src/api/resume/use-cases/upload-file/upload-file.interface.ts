import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { UploadFileUseCase } from './upload-file.use-case';
import { UploadFileResponse } from '../../dto/upload-filel.dto';

export abstract class IUploadFileUsesCase extends IBaseUseCase<
  Express.Multer.File,
  UploadFileResponse
> {}

export const UPLOAD_FILE_USE_CASE_PROVIDER: Provider = {
  provide: IUploadFileUsesCase,
  useClass: UploadFileUseCase,
};
