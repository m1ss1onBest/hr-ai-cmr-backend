import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { IUpdateCandidateUseCase } from './update-candidate.interface';

@Injectable()
export class UpdateCandidateUseCase implements IUpdateCandidateUseCase {
  private readonly logger = new EventHandlerLogger(UpdateCandidateUseCase.name);

  constructor(private readonly candidatesRepo: CandidatesRepository) {}

  async run(request: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    linkedInUrl?: string;
    comment?: string;
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
      throw this.logger.badRequest('Failed to update candidate', err);
    }
  }
}
