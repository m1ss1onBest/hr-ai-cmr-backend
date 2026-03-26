import { Module } from '@nestjs/common';
import { VacanciesControllerV1 } from './vacancies.controller.v1';
import { VacanciesService } from './vacancies.service';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [VacanciesControllerV1],
  providers: [VacanciesService],
})
export class VacanciesModule {}
