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

  // common board aliases
  TEST_TASK: CandidateStatus.TEST_TALK,
  TEST_TALK: CandidateStatus.TEST_TALK,
  TEST: CandidateStatus.TEST_TALK,

  OFFER: CandidateStatus.OFFER,
  HIRED: CandidateStatus.HIRED,
  REJECTED: CandidateStatus.REJECTED,

  // extra aliases some UIs use
  DECLINED: CandidateStatus.REJECTED,
  REFUSED: CandidateStatus.REJECTED,
};

@Injectable()
export class UpdateCandidateStatusUseCase implements IUpdateCandidateStatusUseCase {
  private readonly logger = new EventHandlerLogger(
    UpdateCandidateStatusUseCase.name,
  );

  constructor(private readonly candidatesRepo: CandidatesRepository) {}

  async run(request: {
    id: string;
    status: string;
    changedById: string;
  }): Promise<Candidate> {
    try {
      this.logger.log(
        `Update status request | candidateId=${request.id} | statusRaw=${String(request.status)} | userId=${request.changedById}`,
      );

      const normalized = String(request.status).trim().toUpperCase();
      const statusEnum = STATUS_INPUT_TO_ENUM[normalized];

      this.logger.log(
        `Update status normalized | candidateId=${request.id} | statusNormalized=${normalized} | mapped=${statusEnum ?? 'INVALID'}`,
      );

      if (!statusEnum) {
        this.logger.badRequest(
          `Invalid status '${normalized}'. Allowed: ${Object.keys(STATUS_INPUT_TO_ENUM).join(', ')}`,
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

      return new Candidate({ ...updated, currentStatus: statusEnum });
    } catch (err) {
      this.logger.badRequest(
        `Failed to update candidate status | candidateId=${request.id} | statusRaw=${String(request.status)} | userId=${request.changedById}`,
        err,
      );
    }

    return undefined as never;
  }
}
