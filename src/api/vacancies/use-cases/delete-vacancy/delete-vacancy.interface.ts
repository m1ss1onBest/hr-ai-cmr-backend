import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { VacancyBaseResponse } from '../../dto';
import { Provider } from '@nestjs/common';
import { DeleteVacancyUseCase } from './delete-vacancy.use-case';

export abstract class IDeleteVacancyUseCase extends IBaseUseCase<
  { id: string },
  VacancyBaseResponse
> {}

export const DELETE_VACANCY_USE_CASE_PROVIDER: Provider = {
  provide: IDeleteVacancyUseCase,
  useClass: DeleteVacancyUseCase,
};
