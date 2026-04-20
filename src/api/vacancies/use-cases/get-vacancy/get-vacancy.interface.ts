import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { VacancyBaseResponse } from '../../dto';
import { Provider } from '@nestjs/common';
import { GetVacancyUseCase } from './get-vacancy.use-case';

export abstract class IGetVacancyUseCase extends IBaseUseCase<
  string,
  VacancyBaseResponse
> {}

export const GET_VACANCY_USE_CASE_PROVIDER: Provider = {
  provide: IGetVacancyUseCase,
  useClass: GetVacancyUseCase,
};
