import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VacanciesModule } from './api/vacancies/vacancies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    VacanciesModule,
  ],
})
export class AppModule {}
