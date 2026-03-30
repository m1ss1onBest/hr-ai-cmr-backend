import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CandidateBaseResponse } from './candidate.base-response';

export class UpdateCandidateRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Candidate real first and last name',
    example: 'John Doe',
  })
  name?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'CV file url',
    example: 'https://cv.storage.domain/jonh-cv.pdf',
  })
  cvUrl?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Expected salary value',
    example: '4600 USD',
  })
  expectedSalary?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Candidate position',
    example: 'Senior DevOps Engineer',
  })
  position?: string;
}

export class UpdateCandidateResponse extends CandidateBaseResponse {}
