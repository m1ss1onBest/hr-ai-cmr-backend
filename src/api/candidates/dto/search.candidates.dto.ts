import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CandidateStatus } from 'prisma/generated/enums';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';
import { CandidateBaseResponse } from './candidate.base-response';

export class SearchCandidatesQuery {
  @IsOptional()
  @IsEnum(CandidateStatus, { each: true })
  status?: CandidateStatus[];

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
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  pageSize: number = 10;
}

export class SearchCandidatesPaginatedResponse extends PaginatedResponse<CandidateBaseResponse> {}
