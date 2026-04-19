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
import { FilesModule } from './shared/infrastructure/files/files.module';
import { ResumeModule } from './api/resume/resume.module';
import { StorageModule } from './shared/infrastructure/storage/storage.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { CryptoModule } from './shared/infrastructure/crypto/crypto.module';
import { AiModule } from './api/ai/ai.module';
import { AiInfrastructureModule } from './shared/infrastructure/ai/ai.module';
import { AnalyticsModule } from './api/analytics/analytics.module';

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
    FilesModule,
    ResumeModule,
    StorageModule,
    RedisModule,
    CryptoModule,
    AiInfrastructureModule,
    AiModule,
    AnalyticsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
