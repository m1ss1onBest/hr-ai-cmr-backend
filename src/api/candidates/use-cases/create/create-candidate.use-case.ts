import { Injectable, ConflictException } from '@nestjs/common';
import { ICreateCandidateUseCase } from './create-candidate.interface';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from '../../dto/create.candidate.dto';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';

@Injectable()
export class CreateCandidateUseCase implements ICreateCandidateUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly candidatesRepo: CandidatesRepository,
  ) {
    logger.setContext(CreateCandidateUseCase.name);
  }

  async run(request: CreateCandidateRequest): Promise<CreateCandidateResponse> {
    try {
      const candidate = await this.candidatesRepo.create(request);
      this.logger.log(
        `Candidate created | id=${candidate.id} | name=${candidate.name}`,
      );

      return new Candidate(candidate);
    } catch (err) {
      if (err instanceof ConflictException) {
        this.logger.conflict(err.message, err);
      }
      this.logger.badRequest('Failed to create candidate', err);
    }
  }
}
