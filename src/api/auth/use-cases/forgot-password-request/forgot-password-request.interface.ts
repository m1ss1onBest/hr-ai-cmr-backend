import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { ForgotPasswordRequestResponse } from '../../dto/forgot-password-request.dto';
import { ForgotPasswordRequestUseCase } from './forgot-password-request.use-case';

export abstract class IForgotPasswordRequestUseCase extends IBaseUseCase<
  string,
  ForgotPasswordRequestResponse
> {}

export const FORGOT_PASSWORD_REQUEST_USE_CASE_PROVIDER: Provider = {
  provide: IForgotPasswordRequestUseCase,
  useClass: ForgotPasswordRequestUseCase,
};
