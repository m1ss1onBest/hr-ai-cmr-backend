import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CreateVacancyRequest, CreateVacancyResponse } from '../../dto';
import { Provider } from '@nestjs/common';
import { CreateVacancyUseCase } from './create-vacancy.use-case';

export abstract class ICreateVacancyUseCase extends IBaseUseCase<
  CreateVacancyRequest & { createdById: string },
  CreateVacancyResponse
> {}

export const CREATE_VACANCY_USE_CASE_PROVIDER: Provider = {
  provide: ICreateVacancyUseCase,
  useClass: CreateVacancyUseCase,
};
