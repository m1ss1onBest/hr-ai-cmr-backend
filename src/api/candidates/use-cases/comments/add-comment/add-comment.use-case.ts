import { Injectable, NotFoundException } from '@nestjs/common';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CommentsRepository } from 'src/shared/infrastructure/database/repositories/comments.repository';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { CandidateCommentResponse } from '../../../dto/comments.dto';

@Injectable()
export class AddCommentUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly commentsRepo: CommentsRepository,
    private readonly candidatesRepo: CandidatesRepository,
  ) {
    logger.setContext(AddCommentUseCase.name);
  }

  async run(request: {
    candidateId: string;
    authorId: string;
    text: string;
  }): Promise<CandidateCommentResponse> {
    try {
      const candidate = await this.candidatesRepo.findOneById(request.candidateId);
      if (!candidate) throw new NotFoundException('Candidate');

      const created = await this.commentsRepo.create({
        candidateId: request.candidateId,
        authorId: request.authorId,
        text: request.text,
      });

      // fetch with author to return full object
      const comments = await this.commentsRepo.findManyByCandidateId(request.candidateId);
      const full = comments.find((c) => c.id === created.id);
      if (!full) {
        // fallback minimal
        return created as unknown as CandidateCommentResponse;
      }

      this.logger.log(
        `Comment created | id=${created.id} | candidateId=${request.candidateId}`,
      );

      return full as unknown as CandidateCommentResponse;
    } catch (err) {
      this.logger.badRequest('Failed to add candidate comment', err);
    }
  }
}

