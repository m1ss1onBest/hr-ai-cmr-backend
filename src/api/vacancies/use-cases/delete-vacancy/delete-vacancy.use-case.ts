import { Injectable } from '@nestjs/common';
import { IDeleteVacancyUseCase } from './delete-vacancy.interface';
import { VacancyBaseResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class DeleteVacancyUseCase implements IDeleteVacancyUseCase {
  private readonly logger = new EventHandlerLogger(DeleteVacancyUseCase.name);

  constructor(private readonly vacanciesRepo: VacanciesRepository) {}

  async run(request: { id: string }): Promise<VacancyBaseResponse> {
    try {
      const deleted = await this.vacanciesRepo.softDelete(request.id);
      if (!deleted) {
        this.logger.notFound('Vacancy not found', { id: request.id });
      }
      this.logger.log(`Vacancy soft-deleted | id=${deleted.id}`);
      return new Vacancy(deleted) as VacancyBaseResponse;
    } catch (err) {
      return this.logger.badRequest('Failed to delete vacancy', err);
    }
  }
}
