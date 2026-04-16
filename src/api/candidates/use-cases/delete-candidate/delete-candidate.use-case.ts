import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { IDeleteCandidateUseCase } from './delete-candidate.interface';

@Injectable()
export class DeleteCandidateUseCase implements IDeleteCandidateUseCase {
  private readonly logger = new EventHandlerLogger(DeleteCandidateUseCase.name);

  constructor(private readonly candidatesRepo: CandidatesRepository) {}

  async run(request: { id: string }): Promise<Candidate> {
    try {
      const deleted = await this.candidatesRepo.softDelete(request.id);
      this.logger.log(`Candidate soft-deleted | id=${deleted.id}`);
      return new Candidate(deleted);
    } catch (err) {
      throw this.logger.badRequest('Failed to delete candidate', err);
    }
  }
}
