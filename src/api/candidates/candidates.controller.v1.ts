import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CandidateBaseResponse } from './dto/candidate.base-response';
import { IGetCandidateUseCase } from './use-cases/get-candidate/get-candidate.interface';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from './dto/create.candidate.dto';
import { ICreateCandidateUseCase } from './use-cases/create/create-candidate.interface';
import {
  SearchCandidatesPaginatedResponse,
  SearchCandidatesQuery,
} from './dto/search.candidates.dto';
import { ISearchCandidatesUseCase } from './use-cases/search-candidates/search-candiadtes.interface';

@Controller({
  version: '1',
  path: 'candidates',
})
export class CandidatesControllerV1 {
  constructor(
    private readonly getCandidate: IGetCandidateUseCase,
    private readonly createCandidate: ICreateCandidateUseCase,
    private readonly searchCandidates: ISearchCandidatesUseCase,
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<CandidateBaseResponse> {
    return await this.getCandidate.run(id);
  }

  @Get()
  async getCandidates(
    @Query() query: SearchCandidatesQuery,
  ): Promise<SearchCandidatesPaginatedResponse> {
    return await this.searchCandidates.run(query);
  }

  @Post()
  async create(
    @Body() request: CreateCandidateRequest,
  ): Promise<CreateCandidateResponse> {
    return await this.createCandidate.run(request);
  }
}
