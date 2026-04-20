import { Module, type Provider } from '@nestjs/common';
import { VacanciesControllerV1 } from './vacancies.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { CREATE_VACANCY_USE_CASE_PROVIDER } from './use-cases/create-vacancy/create-vacancy.interface';
import { GET_VACANCY_USE_CASE_PROVIDER } from './use-cases/get-vacancy/get-vacancy.interface';
import { GET_ALL_VACANCIES_USE_CASE_PROVIDER } from './use-cases/get-all-vacancies/get-all-vacancies.interface';
import { UPDATE_VACANCY_USE_CASE_PROVIDER } from './use-cases/update-vacancy/update-vacancy.interface';
import { DELETE_VACANCY_USE_CASE_PROVIDER } from './use-cases/delete-vacancy/delete-vacancy.interface';

const VACANCY_MODULE_PROVIDERS: Provider[] = [
  CREATE_VACANCY_USE_CASE_PROVIDER,
  GET_VACANCY_USE_CASE_PROVIDER,
  GET_ALL_VACANCIES_USE_CASE_PROVIDER,
  UPDATE_VACANCY_USE_CASE_PROVIDER,
  DELETE_VACANCY_USE_CASE_PROVIDER,
];

@Module({
  imports: [DatabaseModule, LoggerModule, AuthModule],
  controllers: [VacanciesControllerV1],
  providers: VACANCY_MODULE_PROVIDERS,
})
export class VacanciesModule {}
