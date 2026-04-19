import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { AnalyticsControllerV1 } from './analytics.controller.v1';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DatabaseModule, LoggerModule, AuthModule],
  controllers: [AnalyticsControllerV1],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
