import { Injectable } from '@nestjs/common';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CommentsRepository } from 'src/shared/infrastructure/database/repositories/comments.repository';
import { IDeleteCommentUseCase } from './delete-comment.interface';

@Injectable()
export class DeleteCommentUseCase implements IDeleteCommentUseCase {
  private readonly logger = new EventHandlerLogger(DeleteCommentUseCase.name);

  constructor(private readonly commentsRepo: CommentsRepository) {}

  async run(request: {
    candidateId: string;
    commentId: string;
    authorId: string;
  }): Promise<void> {
    try {
      await this.commentsRepo.softDeleteOwnComment({
        candidateId: request.candidateId,
        commentId: request.commentId,
        authorId: request.authorId,
      });
      this.logger.log(`Comment deleted | id=${request.commentId}`);
    } catch (err) {
      this.logger.badRequest('Failed to delete candidate comment', err);
    }
  }
}
