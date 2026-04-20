import { Injectable, NotFoundException } from '@nestjs/common';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CommentsRepository } from 'src/shared/infrastructure/database/repositories/comments.repository';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { CandidateCommentResponse } from '../../../dto/comments.dto';

@Injectable()
export class GetCommentsUseCase {
  private readonly logger = new EventHandlerLogger(GetCommentsUseCase.name);

  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly candidatesRepo: CandidatesRepository,
  ) {}

  async run(request: {
    candidateId: string;
  }): Promise<CandidateCommentResponse[]> {
    try {
      const candidate = await this.candidatesRepo.findOneById(
        request.candidateId,
      );
      if (!candidate) throw new NotFoundException('Candidate');

      const comments = await this.commentsRepo.findManyByCandidateId(
        request.candidateId,
      );
      return comments as unknown as CandidateCommentResponse[];
    } catch (err) {
      throw this.logger.badRequest('Failed to get candidate comments', err);
    }
  }
}
