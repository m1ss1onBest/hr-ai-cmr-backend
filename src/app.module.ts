import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VacanciesModule } from './api/vacancies/vacancies.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigurationModule } from './shared/infrastructure/config/config.module';
import { CandidatesModule } from './api/candidates/candidates.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
import { JwtAuthMiddleware } from './api/auth/modules/guards/jwt-auth.middleware';
import { MailModule } from './shared/infrastructure/mail/mail.module';

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
    CandidatesModule,
    LoggerModule,
    MailModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
