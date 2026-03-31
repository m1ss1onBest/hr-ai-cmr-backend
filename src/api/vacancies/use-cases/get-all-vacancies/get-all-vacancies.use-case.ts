import { Injectable } from '@nestjs/common';
import { IGetAllVacanciesUseCase } from './get-all-vacancies.interface';
import { VacancyBaseResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class GetAllVacanciesUseCase implements IGetAllVacanciesUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly vacanciesRepo: VacanciesRepository,
  ) {
    logger.setContext(GetAllVacanciesUseCase.name);
  }

  async run(): Promise<VacancyBaseResponse[]> {
    try {
      const vacancies = await this.vacanciesRepo.findAll();
      return vacancies.map((v) => new Vacancy(v) as VacancyBaseResponse);
    } catch (err) {
      this.logger.internal('Failed to fetch vacancies', err);
    }
  }
}
