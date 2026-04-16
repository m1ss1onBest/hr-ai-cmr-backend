import { Injectable } from '@nestjs/common';
import { IUpdateVacancyUseCase } from './update-vacancy.interface';
import { UpdateVacancyRequest, UpdateVacancyResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
export type UpdateVacancyRequestWithId = UpdateVacancyRequest & { id: string };

@Injectable()
export class UpdateVacancyUseCase implements IUpdateVacancyUseCase {
  private readonly logger = new EventHandlerLogger(UpdateVacancyUseCase.name);

  constructor(private readonly vacanciesRepo: VacanciesRepository) {}
  async run(
    request: UpdateVacancyRequestWithId,
  ): Promise<UpdateVacancyResponse> {
    try {
      const { id, ...data } = request;
      const updated = await this.vacanciesRepo.update(id, data);
      this.logger.log(`Vacancy updated | id=${updated.id}`);
      return new Vacancy(updated) as UpdateVacancyResponse;
    } catch (err) {
      return this.logger.badRequest('Failed to update vacancy', err);
    }
  }
}
