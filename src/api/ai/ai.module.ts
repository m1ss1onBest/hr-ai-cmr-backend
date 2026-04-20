import { Module } from '@nestjs/common';
import { StorageModule } from 'src/shared/infrastructure/storage/storage.module';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { MATCH_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/match-candidate/match-candidate.interface';
import { AiControllerV1 } from './ai.controller.v1';
import { AiInfrastructureModule } from 'src/shared/infrastructure/ai/ai.module';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ANALYZE_RESUME_USE_CASE_PROVIDER } from './use-cases/analyze-resume/analyze-resume.interface';
import { AuthModule } from '../auth/auth.module';

export const AI_MODULE_PROVIDERS = [
  MATCH_CANDIDATE_USE_CASE_PROVIDER,
  ANALYZE_RESUME_USE_CASE_PROVIDER,
];

@Module({
  imports: [
    StorageModule,
    LoggerModule,
    AiInfrastructureModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AiControllerV1],
  providers: [...AI_MODULE_PROVIDERS],
  exports: [...AI_MODULE_PROVIDERS],
})
export class AiModule {}
