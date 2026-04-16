import { Injectable } from '@nestjs/common';
import { IGetVacancyUseCase } from './get-vacancy.interface';
import { VacancyBaseResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class GetVacancyUseCase implements IGetVacancyUseCase {
  private readonly logger = new EventHandlerLogger(GetVacancyUseCase.name);

  constructor(private readonly vacanciesRepo: VacanciesRepository) {}

  async run(id: string): Promise<VacancyBaseResponse> {
    const vacancy = await this.vacanciesRepo.findOneById(id);

    if (!vacancy) {
      throw this.logger.notFound(`Vacancy not found | id=${id}`);
    }

    return new Vacancy(vacancy) as VacancyBaseResponse;
  }
}
