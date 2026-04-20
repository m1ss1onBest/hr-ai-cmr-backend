import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  SetPasswordRequest,
  SetPasswordResponse,
} from '../../dto/set-password.dto';
import { SetPasswordUseCase } from './set-password.use-case';

export abstract class ISetPasswordUseCase extends IBaseUseCase<
  SetPasswordRequest,
  SetPasswordResponse
> {}

export const SET_PASSWORD_USE_CASE_PROVIDER: Provider = {
  provide: ISetPasswordUseCase,
  useClass: SetPasswordUseCase,
};
