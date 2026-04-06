import { Injectable } from '@nestjs/common';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CommentsRepository } from 'src/shared/infrastructure/database/repositories/comments.repository';
import { CandidateCommentResponse } from '../../../dto/comments.dto';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly commentsRepo: CommentsRepository,
  ) {
    logger.setContext(UpdateCommentUseCase.name);
  }

  async run(request: {
    candidateId: string;
    commentId: string;
    authorId: string;
    text: string;
  }): Promise<CandidateCommentResponse> {
    try {
      const updated = await this.commentsRepo.updateOwnComment({
        candidateId: request.candidateId,
        commentId: request.commentId,
        authorId: request.authorId,
        text: request.text,
      });

      // Return updated with author by refetching list
      const fullList = await this.commentsRepo.findManyByCandidateId(request.candidateId);
      const full = fullList.find((c) => c.id === updated.id) ?? updated;

      this.logger.log(`Comment updated | id=${updated.id}`);
      return full as unknown as CandidateCommentResponse;
    } catch (err) {
      this.logger.badRequest('Failed to update candidate comment', err);
    }
  }
}

