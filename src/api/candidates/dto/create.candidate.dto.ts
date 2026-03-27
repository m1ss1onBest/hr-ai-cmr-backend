import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { CandidateBaseResponse } from './candidate.base-response';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Candidate real first and last name',
    example: 'John Doe',
  })
  name: string;

  @IsUrl()
  @MaxLength(255)
  @ApiProperty({
    description: 'CV file url',
    example: 'https://cv.storage.domain/jonh-cv.pdf',
  })
  cvUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Expected salary value',
    example: '4600 USD',
  })
  expectedSalary: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Candidate position',
    example: 'Senior DevOps Engineer',
  })
  position: string;
}

export class CreateCandidateResponse extends CandidateBaseResponse {}
