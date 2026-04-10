import { Injectable } from '@nestjs/common';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { CandidateStatus } from 'prisma/generated/enums';
import { IUpdateCandidateStatusUseCase } from './update-candidate-status.interface';

const STATUS_INPUT_TO_ENUM: Record<string, CandidateStatus> = {
  NEW: CandidateStatus.NEW,
  SCREENING: CandidateStatus.SCREENING,
  INTERVIEW: CandidateStatus.INTERVIEW,
  TEST_TASK: CandidateStatus.TEST_TALK, // API canonical name -> current DB enum
  TEST_TALK: CandidateStatus.TEST_TALK,
  OFFER: CandidateStatus.OFFER,
  HIRED: CandidateStatus.HIRED,
  REJECTED: CandidateStatus.REJECTED,
};

@Injectable()
export class UpdateCandidateStatusUseCase implements IUpdateCandidateStatusUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly candidatesRepo: CandidatesRepository,
  ) {
    logger.setContext(UpdateCandidateStatusUseCase.name);
  }

  async run(request: {
    id: string;
    status: string;
    changedById: string;
  }): Promise<Candidate> {
    try {
      const normalized = String(request.status).toUpperCase();
      const statusEnum = STATUS_INPUT_TO_ENUM[normalized];

      if (!statusEnum) {
        this.logger.badRequest(
          `Invalid status. Allowed: ${Object.keys(STATUS_INPUT_TO_ENUM).join(', ')}`,
        );
      }

      const updated = await this.candidatesRepo.updateStatusWithHistory({
        candidateId: request.id,
        status: statusEnum,
        changedById: request.changedById,
      });

      this.logger.log(
        `Candidate status updated | id=${updated.id} | status=${statusEnum}`,
      );

      // currentStatus isn't present in generated prisma types yet; attach it to response.
      return new Candidate({ ...updated, currentStatus: statusEnum });
    } catch (err) {
      this.logger.badRequest('Failed to update candidate status', err);
    }
  }
}
