import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CandidateCommentResponse } from '../../../dto/comments.dto';
import { UpdateCommentUseCase } from './update-comment.use-case';

export type UpdateCommentRequest = {
  candidateId: string;
  commentId: string;
  authorId: string;
  text: string;
};

export abstract class IUpdateCommentUseCase extends IBaseUseCase<
  UpdateCommentRequest,
  CandidateCommentResponse
> {}

export const UPDATE_COMMENT_USE_CASE_PROVIDER: Provider = {
  provide: IUpdateCommentUseCase,
  useClass: UpdateCommentUseCase,
};
