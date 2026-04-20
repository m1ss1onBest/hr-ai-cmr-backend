import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CandidateCommentResponse } from '../../../dto/comments.dto';
import { GetCommentsUseCase } from './get-comments.use-case';

export abstract class IGetCandidateCommentsUseCase extends IBaseUseCase<
  { candidateId: string },
  CandidateCommentResponse[]
> {}

export const GET_CANDIDATE_COMMENTS_USE_CASE_PROVIDER: Provider = {
  provide: IGetCandidateCommentsUseCase,
  useClass: GetCommentsUseCase,
};
