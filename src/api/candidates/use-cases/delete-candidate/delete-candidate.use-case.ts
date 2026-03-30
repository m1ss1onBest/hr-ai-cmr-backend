import { Injectable } from '@nestjs/common';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { HandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { IDeleteCandidateUseCase } from './delete-candidate.interface';

@Injectable()
export class DeleteCandidateUseCase implements IDeleteCandidateUseCase {
  constructor(
    private readonly logger: HandlerLogger,
    private readonly candidatesRepo: CandidatesRepository,
  ) {
    logger.setContext(DeleteCandidateUseCase.name);
  }

  async run(request: { id: string }): Promise<Candidate> {
    try {
      const deleted = await this.candidatesRepo.softDelete(request.id);
      this.logger.log(`Candidate soft-deleted | id=${deleted.id}`);
      return new Candidate(deleted);
    } catch (err) {
      this.logger.badRequest('Failed to delete candidate', err);
    }
  }
}
