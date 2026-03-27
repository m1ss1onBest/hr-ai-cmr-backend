import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { CandidateStatus } from 'prisma/generated/enums';
import { ICandidateData } from 'src/shared/domain/users/candidate.entity';

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
    description: 'CV file url',
    example: 'https://cv.storage.domain/jonh-cv.pdf',
  })
  cvUrl: string;

  @ApiProperty({
    description: 'Expected salary value',
    example: '4600 USD',
  })
  expectedSalary: string;

  @ApiProperty({
    enum: CandidateStatus,
    description: 'Current candidate status',
    example: 'NEW',
  })
  currentStatus: string;

  @ApiProperty({
    description: 'Candidate position',
    example: 'Senior DevOps Engineer',
  })
  position: string;

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
}
