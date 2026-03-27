import { Module } from '@nestjs/common';
import { CandidatesControllerV1 } from './candidates.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { GET_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/get-candidate/get-candidate.interface';
import { CREATE_CANDIDATE_USE_CASE_PROVIDER } from './use-cases/create/create-candidate.interface';
import { SEARCH_CANDIDATES_USE_CASE_PROVIDER } from './use-cases/search-candidates/search-candiadtes.interface';
import { ServicesModule } from 'src/shared/infrastructure/logger/logger.module';

export const CANDIDATE_MODULE_PROVIDERS = [
  GET_CANDIDATE_USE_CASE_PROVIDER,
  CREATE_CANDIDATE_USE_CASE_PROVIDER,
  SEARCH_CANDIDATES_USE_CASE_PROVIDER,
];

@Module({
  imports: [DatabaseModule, ServicesModule],
  controllers: [CandidatesControllerV1],
  providers: [...CANDIDATE_MODULE_PROVIDERS],
})
export class CandidatesModule {}
