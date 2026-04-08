import { IsOptional, IsString } from 'class-validator';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';
import { CandidateBaseResponse } from './candidate.base-response';
import { BaseSearchQuery } from 'src/shared/contracts/dto/search.dto';

export type SortCandidatesBy = 'createdAt' | 'updatedAt' | 'name';

export class SearchCandidatesQuery extends BaseSearchQuery<SortCandidatesBy> {
  @IsOptional()
  @IsString({ each: true })
  position?: string[];

  @IsOptional()
  @IsString()
  minSalary?: string;

  @IsOptional()
  @IsString()
  maxSalary?: string;
}

export class SearchCandidatesPaginatedResponse extends PaginatedResponse<CandidateBaseResponse> {}
