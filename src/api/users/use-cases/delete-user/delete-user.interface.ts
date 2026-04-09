import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { DeleteUserResponse } from '../../dto/delete.user.dto';
import { Provider } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.use-case';

export abstract class IDeleteUserUseCase extends IBaseUseCase<
  { userId: string; adminId?: string },
  DeleteUserResponse
> {}

export const DELETE_USER_USE_CASE_PROVIDER: Provider = {
  provide: IDeleteUserUseCase,
  useClass: DeleteUserUseCase,
};
