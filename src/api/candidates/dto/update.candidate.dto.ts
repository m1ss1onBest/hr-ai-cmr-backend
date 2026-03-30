import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
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
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    return typeof value === 'string' ? value : String(value);
  })
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

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Candidate email (must be unique)',
    example: 'john.doe@example.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Candidate phone number',
    example: '+380991112233',
  })
  phone?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://www.linkedin.com/in/john-doe/',
  })
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiPropertyOptional({
    description: 'Additional comment',
    example: 'Strong DevOps background, referred by ...',
  })
  comment?: string;
}

export class UpdateCandidateResponse extends CandidateBaseResponse {}
