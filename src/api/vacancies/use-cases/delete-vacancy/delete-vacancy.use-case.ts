import { Injectable } from '@nestjs/common';
import { IDeleteVacancyUseCase } from './delete-vacancy.interface';
import { VacancyBaseResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class DeleteVacancyUseCase implements IDeleteVacancyUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly vacanciesRepo: VacanciesRepository,
  ) {
    logger.setContext(DeleteVacancyUseCase.name);
  }

  async run(request: { id: string }): Promise<VacancyBaseResponse> {
    try {
      const deleted = await this.vacanciesRepo.softDelete(request.id);
      this.logger.log(`Vacancy soft-deleted | id=${deleted.id}`);
      return new Vacancy(deleted) as VacancyBaseResponse;
    } catch (err) {
      this.logger.badRequest('Failed to delete vacancy', err);
    }
  }
}
