import { BadRequestException, Injectable } from '@nestjs/common';
import { ICreateCandidateUseCase } from './create-candidate.interface';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from '../../dto/create.candidate.dto';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/users/candidate.entity';

@Injectable()
export class CreateCandidateUseCase implements ICreateCandidateUseCase {
  constructor(private readonly candidates: CandidatesRepository) {}

  async run(request: CreateCandidateRequest): Promise<CreateCandidateResponse> {
    const candidateResult = await this.candidates.create(request);
    if (!candidateResult) {
      throw new BadRequestException('Failed to create candidate');
    }
    return new Candidate(candidateResult);
  }
}
