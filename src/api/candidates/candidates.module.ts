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
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { UPDATE_CANDIDATE_STATUS_USE_CASE_PROVIDER } from './use-cases/update-candidate-status/update-candidate-status.interface';

export const CANDIDATE_MODULE_PROVIDERS: Provider[] = [
  GET_CANDIDATE_USE_CASE_PROVIDER,
  CREATE_CANDIDATE_USE_CASE_PROVIDER,
  SEARCH_CANDIDATES_USE_CASE_PROVIDER,
  UPDATE_CANDIDATE_USE_CASE_PROVIDER,
  DELETE_CANDIDATE_USE_CASE_PROVIDER,
  UPDATE_CANDIDATE_STATUS_USE_CASE_PROVIDER,
];

@Module({
  imports: [DatabaseModule, LoggerModule, AuthModule],
  controllers: [CandidatesControllerV1, CandidatesController],
  providers: CANDIDATE_MODULE_PROVIDERS,
})
export class CandidatesModule {}
