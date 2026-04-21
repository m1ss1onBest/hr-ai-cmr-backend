import { Injectable, ConflictException } from '@nestjs/common';
import { ICreateCandidateUseCase } from './create-candidate.interface';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from '../../dto/create.candidate.dto';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { CandidateStatus } from 'prisma/generated/enums';

@Injectable()
export class CreateCandidateUseCase implements ICreateCandidateUseCase {
  private readonly logger = new EventHandlerLogger(CreateCandidateUseCase.name);

  constructor(private readonly candidatesRepo: CandidatesRepository) {}

  async run(request: CreateCandidateRequest): Promise<CreateCandidateResponse> {
    try {
      const candidate = await this.candidatesRepo.create(request);
      this.logger.log(
        `Candidate created | id=${candidate.id} | name=${candidate.name}`,
      );

      const status = request.status
        ? (request.status as unknown as CandidateStatus)
        : CandidateStatus.NEW;

      return new Candidate({ ...candidate, currentStatus: status });
    } catch (err) {
      if (err instanceof ConflictException) {
        this.logger.conflict(err.message, err);
      }
      this.logger.badRequest('Failed to create candidate', err);
    }

    return undefined as never;
  }
}
