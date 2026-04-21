import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsIn,
} from 'class-validator';
import { CandidateBaseResponse } from './candidate.base-response';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ALLOWED_CANDIDATE_STATUS_INPUTS,
  AllowedCandidateStatusInput,
} from './update.candidate-status.dto';

export class CreateCandidateRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Candidate real first and last name',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Candidate email (must be unique)',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    required: false,
    description: 'Candidate phone number',
    example: '+380991112233',
  })
  phone?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @ApiProperty({
    required: false,
    description: 'LinkedIn profile URL',
    example: 'https://www.linkedin.com/in/john-doe/',
  })
  linkedInUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Candidate position',
    example: 'Senior DevOps Engineer',
  })
  position: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    required: false,
    description: 'Additional comment',
    example: 'Strong DevOps background, referred by ...',
  })
  comment?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @ApiProperty({
    required: false,
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
  @MaxLength(255)
  @ApiProperty({
    required: false,
    description: 'Expected salary value',
    example: '4600 USD',
  })
  expectedSalary?: string;

  @IsOptional()
  @Transform(({ value }): unknown => {
    if (value === null || value === undefined || value === '') return undefined;
    if (typeof value !== 'string') return value;
    return value.toUpperCase();
  })
  @IsString()
  @IsIn(ALLOWED_CANDIDATE_STATUS_INPUTS, {
    message: `status must be one of: ${ALLOWED_CANDIDATE_STATUS_INPUTS.join(', ')}`,
  })
  @ApiProperty({
    required: false,
    description: 'Initial candidate status (defaults to NEW)',
    example: 'NEW',
    enum: ALLOWED_CANDIDATE_STATUS_INPUTS,
  })
  status?: AllowedCandidateStatusInput;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Internal: creator user id (filled from JWT on backend; do not send from UI)',
  })
  createdById?: string;
}

export class CreateCandidateResponse extends CandidateBaseResponse {}
