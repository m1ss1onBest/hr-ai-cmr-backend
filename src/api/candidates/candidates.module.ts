import { Module, type Provider } from '@nestjs/common';
import {
  CandidatesControllerV1,
  CandidatesController,
} from './candidates.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { GET_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/get-candidate/get-candidate.interface';
import { CREATE_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/create/create-candidate.interface';
import { SEARCH_CANDIDATES_USE_CASE_PROVIDER } from './use-cases/search-candidates/search-candiadtes.interface';
import { UPDATE_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/update-candidate/update-candidate.interface';
import { DELETE_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/delete-candidate/delete-candidate.interface';
import { ANALYZE_RESUME_USE_CASE_PROVIDER } from './use-cases/analyze-resume/analyze-resume.interface';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from 'src/shared/infrastructure/ai/ai.module';

export const CANDIDATE_MODULE_PROVIDERS: Provider[] = [
  GET_CANDIDATE_USE_CASE_PROVIDER,
  CREATE_CANDIDATE_USE_CASE_PROVIDER,
  SEARCH_CANDIDATES_USE_CASE_PROVIDER,
  UPDATE_CANDIDATE_USE_CASE_PROVIDER,
  DELETE_CANDIDATE_USE_CASE_PROVIDER,
  ANALYZE_RESUME_USE_CASE_PROVIDER,
];

@Module({
  imports: [DatabaseModule, LoggerModule, AuthModule, AiModule],
  controllers: [CandidatesControllerV1, CandidatesController],
  providers: CANDIDATE_MODULE_PROVIDERS,
})
export class CandidatesModule {}
