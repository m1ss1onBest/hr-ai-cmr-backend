import { Injectable } from '@nestjs/common';
import { ISearchCandidatesUseCase } from './search-candiadtes.interface';
import {
  SearchCandidatesQuery,
  SearchCandidatesPaginatedResponse,
} from '../../dto/search.candidates.dto';
import { CandidatesRepository } from 'src/shared/infrastructure/database/repositories/candidates.repository';
import { Candidate } from 'src/shared/domain/candidates/candidate.entity';

@Injectable()
export class SearchCandidatesUseCase implements ISearchCandidatesUseCase {
  constructor(private readonly candidates: CandidatesRepository) {}
  async run(
    request: SearchCandidatesQuery,
  ): Promise<SearchCandidatesPaginatedResponse> {
    const candidatesData = await this.candidates.searchMany(request);

    const candidatesResponse = {
      data: candidatesData.data.map((c) => new Candidate(c)),
      meta: candidatesData.meta,
    };

    return candidatesResponse;
  }
}
