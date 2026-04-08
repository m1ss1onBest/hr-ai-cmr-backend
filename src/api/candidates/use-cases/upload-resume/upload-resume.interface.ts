import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { UploadResumeUseCase } from './upload-resume.use-case';

export type UploadResumeRequest = {
  candidateId: string;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

export abstract class IUploadResumeUseCase extends IBaseUseCase<
  UploadResumeRequest,
  { cvUrl: string }
> {}

export const UPLOAD_RESUME_USE_CASE_PROVIDER: Provider = {
  provide: IUploadResumeUseCase,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  useClass: UploadResumeUseCase,
};
