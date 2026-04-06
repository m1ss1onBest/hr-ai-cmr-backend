import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { DeleteCommentUseCase } from './delete-comment.use-case';

export type DeleteCommentRequest = {
  candidateId: string;
  commentId: string;
  authorId: string;
};

export abstract class IDeleteCommentUseCase extends IBaseUseCase<
  DeleteCommentRequest,
  void
> {}

export const DELETE_COMMENT_USE_CASE_PROVIDER: Provider = {
  provide: IDeleteCommentUseCase,
  useClass: DeleteCommentUseCase,
};
