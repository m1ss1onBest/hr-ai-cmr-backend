import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ICandidateData } from 'src/shared/domain/candidates/candidate.entity';

export class CandidateBaseResponse implements ICandidateData {
  @IsUUID()
  @ApiProperty({
    description: 'Candidate UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'Candidate real first and last name',
    example: 'Jonn Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Candidate email (unique)',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Candidate phone number',
    example: '+380991112233',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'LinkedIn profile URL',
    example: 'https://www.linkedin.com/in/john-doe/',
  })
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Additional comment',
    example: 'Strong DevOps background, referred by ...',
  })
  comment?: string;

  @ApiProperty({
    required: false,
    description: 'CV file url',
    example: 'https://cv.storage.domain/jonh-cv.pdf',
  })
  cvUrl?: string;

  @ApiProperty({
    required: false,
    description: 'Expected salary value',
    example: '4600 USD',
  })
  expectedSalary?: string;

  @ApiProperty({
    description: 'Candidate position id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  positionId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Candidate position name (optional)',
    example: 'Senior DevOps Engineer',
  })
  position?: string;

  @ApiProperty({
    description: 'Candidate creation date',
    example: '2026-03-27T15:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Candidate last update time',
    example: '2026-03-27T15:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description:
      'Candidate deletion date. Determines whether a candidate has been deleted',
    example: '2026-03-27T15:30:00.000Z',
  })
  deletedAt?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Current candidate status in the funnel',
    example: 'INTERVIEW',
  })
  currentStatus?: string;
}
