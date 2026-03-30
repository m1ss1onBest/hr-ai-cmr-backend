import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { LoginUseCase } from './login.use-case';
import { LoginUserRequest, LoginUserResponse } from '../../dto';

export abstract class ILoginUseCase extends IBaseUseCase<
  LoginUserRequest,
  LoginUserResponse
> {}

export const LOGIN_USE_CASE_PROVIDER: Provider = {
  provide: ILoginUseCase,
  useClass: LoginUseCase,
};
