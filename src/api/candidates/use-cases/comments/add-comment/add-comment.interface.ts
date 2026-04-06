import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CandidateCommentResponse } from '../../../dto/comments.dto';
import { AddCommentUseCase } from './add-comment.use-case';

export type AddCommentRequest = {
  candidateId: string;
  authorId: string;
  text: string;
};

export abstract class IAddCommentUseCase extends IBaseUseCase<
  AddCommentRequest,
  CandidateCommentResponse
> {}

export const ADD_COMMENT_USE_CASE_PROVIDER: Provider = {
  provide: IAddCommentUseCase,
  useClass: AddCommentUseCase,
};
