import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';
import { CandidateBaseResponse } from './candidate.base-response';

export class SearchCandidatesQuery {
  @IsOptional()
  @IsString({ each: true })
  position?: string[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  minSalary?: string;

  @IsOptional()
  @IsString()
  maxSalary?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdBefore?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAfter?: Date;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'name';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';

  /** @deprecated use `order` */
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 20;

  /** @deprecated use `limit` */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageSize?: number;
}

export class SearchCandidatesPaginatedResponse extends PaginatedResponse<CandidateBaseResponse> {}
