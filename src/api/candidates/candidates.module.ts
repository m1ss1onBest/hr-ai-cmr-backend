import { Module, type Provider } from '@nestjs/common';
import { CandidatesControllerV1 } from './candidates.controller.v1';
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
import { UPDATE_CANDIDATE_STATUS_USE_CASE_PROVIDER } from './use-cases/update-candidate-status/update-candidate-status.interface';
import { ADD_COMMENT_USE_CASE_PROVIDER } from './use-cases/comments/add-comment/add-comment.interface';
import { GET_CANDIDATE_COMMENTS_USE_CASE_PROVIDER } from './use-cases/comments/get-comments/get-comments.interface';
import { UPDATE_COMMENT_USE_CASE_PROVIDER } from './use-cases/comments/update-comment/update-comment.interface';
import { DELETE_COMMENT_USE_CASE_PROVIDER } from './use-cases/comments/delete-comment/delete-comment.interface';
import { UPLOAD_RESUME_USE_CASE_PROVIDER } from './use-cases/upload-resume/upload-resume.interface';
import { FilesModule } from 'src/shared/infrastructure/files/files.module';

export const CANDIDATE_MODULE_PROVIDERS = [
  GET_CANDIDATE_USE_CASE_PROVIDER,
  CREATE_CANDIDATE_USE_CASE_PROVIDER,
  SEARCH_CANDIDATES_USE_CASE_PROVIDER,
  UPDATE_CANDIDATE_USE_CASE_PROVIDER,
  DELETE_CANDIDATE_USE_CASE_PROVIDER,
  ANALYZE_RESUME_USE_CASE_PROVIDER,
  UPDATE_CANDIDATE_STATUS_USE_CASE_PROVIDER,
  ADD_COMMENT_USE_CASE_PROVIDER,
  GET_CANDIDATE_COMMENTS_USE_CASE_PROVIDER,
  UPDATE_COMMENT_USE_CASE_PROVIDER,
  DELETE_COMMENT_USE_CASE_PROVIDER,
  UPLOAD_RESUME_USE_CASE_PROVIDER,
] as Provider[];

@Module({
  imports: [DatabaseModule, LoggerModule, AuthModule, AiModule, FilesModule],
  controllers: [CandidatesControllerV1],
  providers: CANDIDATE_MODULE_PROVIDERS,
})
export class CandidatesModule {}
