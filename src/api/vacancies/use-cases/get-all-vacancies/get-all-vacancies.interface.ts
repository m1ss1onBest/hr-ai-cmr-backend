import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { VacancyBaseResponse } from '../../dto';
import { Provider } from '@nestjs/common';
import { GetAllVacanciesUseCase } from './get-all-vacancies.use-case';

export abstract class IGetAllVacanciesUseCase extends IBaseUseCase<
  void,
  VacancyBaseResponse[]
> {}

export const GET_ALL_VACANCIES_USE_CASE_PROVIDER: Provider = {
  provide: IGetAllVacanciesUseCase,
  useClass: GetAllVacanciesUseCase,
};
