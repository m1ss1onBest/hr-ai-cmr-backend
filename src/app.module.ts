import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VacanciesModule } from './api/vacancies/vacancies.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigurationModule } from './shared/infrastructure/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    VacanciesModule,
    AuthModule,
  ],
})
export class AppModule {}
