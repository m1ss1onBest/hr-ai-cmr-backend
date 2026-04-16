import { Injectable } from '@nestjs/common';
import { ICreateVacancyUseCase } from './create-vacancy.interface';
import { CreateVacancyRequest, CreateVacancyResponse } from '../../dto';
import { VacanciesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
import { Vacancy } from 'src/shared/domain/vacancies/vacancy.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class CreateVacancyUseCase implements ICreateVacancyUseCase {
  private readonly logger = new EventHandlerLogger(CreateVacancyUseCase.name);

  constructor(private readonly vacanciesRepo: VacanciesRepository) {}

  async run(
    request: CreateVacancyRequest & { createdById: string },
  ): Promise<CreateVacancyResponse> {
    try {
      const vacancy = await this.vacanciesRepo.create({
        title: request.title,
        description: request.description,
        salary: request.salary,
        requirements: request.requirements,
        techStack: request.techStack,
        createdById: request.createdById,
      });

      this.logger.log(
        `Vacancy created | id=${vacancy.id} | title=${vacancy.title}`,
      );

      return new Vacancy(vacancy) as CreateVacancyResponse;
    } catch (err) {
      throw this.logger.badRequest('Failed to create vacancy', err);
    }
  }
}
