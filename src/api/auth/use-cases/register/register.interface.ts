import { Provider } from '@nestjs/common';
import { RegisterUserRequest, RegisterUserResponse } from '../../dto/';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { RegisterUseCase } from './register.use-case';

export abstract class IRegisterUseCase extends IBaseUseCase<
  RegisterUserRequest,
  RegisterUserResponse
> {}

export const REGISTER_USE_CASE_PROVIDER: Provider = {
  provide: IRegisterUseCase,
  useClass: RegisterUseCase,
};
