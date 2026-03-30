import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { IUpdateCandidateUseCase } from './update-candidate.interface';

@Injectable()
export class UpdateCandidateUseCase implements IUpdateCandidateUseCase {
  constructor(
    private readonly logger: EventHandlerLogger,
    private readonly candidatesRepo: CandidatesRepository,
  ) {
    logger.setContext(UpdateCandidateUseCase.name);
  }

  async run(request: {
    id: string;
    name?: string;
    position?: string;
    expectedSalary?: string;
    cvUrl?: string;
  }): Promise<Candidate> {
    try {
      const { id, ...data } = request;
      const updated = await this.candidatesRepo.update(id, data);
      this.logger.log(`Candidate updated | id=${updated.id}`);
      return new Candidate(updated);
    } catch (err) {
      this.logger.badRequest('Failed to update candidate', err);
    }
  }
}
