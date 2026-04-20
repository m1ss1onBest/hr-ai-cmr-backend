import { Injectable, NotFoundException } from '@nestjs/common';
import { IGetCandidateUseCase } from './get-candidate.interface';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { CandidateBaseResponse } from '../../dto/candidate.base-response';

@Injectable()
export class GetCandidateUseCase implements IGetCandidateUseCase {
  constructor(private readonly candidates: CandidatesRepository) {}
  async run(request: string): Promise<CandidateBaseResponse> {
    const candidate = await this.candidates.findOneById(request);
    if (!candidate) {
      throw new NotFoundException('Candidate');
    }
    return new Candidate(candidate);
  }
}
