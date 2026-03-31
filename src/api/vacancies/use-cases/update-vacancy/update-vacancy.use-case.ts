import { Injectable } from '@nestjs/common';
import { IUpdateVacancyUseCase } from './update-vacancy.interface';
import { UpdateVacancyRequest, UpdateVacancyResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class UpdateVacancyUseCase implements IUpdateVacancyUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly vacanciesRepo: VacanciesRepository,
  ) {
    logger.setContext(UpdateVacancyUseCase.name);
  }

  async run(
    request: UpdateVacancyRequest & { id: string },
  ): Promise<UpdateVacancyResponse> {
    try {
      const { id, ...data } = request;
      const updated = await this.vacanciesRepo.update(id, data);
      this.logger.log(`Vacancy updated | id=${updated.id}`);
      return new Vacancy(updated) as UpdateVacancyResponse;
    } catch (err) {
      this.logger.badRequest('Failed to update vacancy', err);
    }
  }
}
