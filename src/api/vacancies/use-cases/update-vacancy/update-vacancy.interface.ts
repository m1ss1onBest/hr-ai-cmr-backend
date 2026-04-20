import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { UpdateVacancyRequest, UpdateVacancyResponse } from '../../dto';
import { Provider } from '@nestjs/common';
import { UpdateVacancyUseCase } from './update-vacancy.use-case';

export abstract class IUpdateVacancyUseCase extends IBaseUseCase<
  UpdateVacancyRequest & { id: string },
  UpdateVacancyResponse
> {}

export const UPDATE_VACANCY_USE_CASE_PROVIDER: Provider = {
  provide: IUpdateVacancyUseCase,
  useClass: UpdateVacancyUseCase,
};
