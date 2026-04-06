import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

/**
 * API accepts both enum values and backward/typo aliases.
 * Canonical values are: NEW | SCREENING | INTERVIEW | TEST_TASK | OFFER | HIRED | REJECTED
 * Internally, Prisma enum currently uses TEST_TALK.
 */
export const ALLOWED_CANDIDATE_STATUS_INPUTS = [
  'NEW',
  'SCREENING',
  'INTERVIEW',
  'TEST_TASK',
  'TEST_TALK',
  'OFFER',
  'HIRED',
  'REJECTED',
] as const;

export type AllowedCandidateStatusInput =
  (typeof ALLOWED_CANDIDATE_STATUS_INPUTS)[number];

export class UpdateCandidateStatusRequest {
  @IsString()
  @IsIn(ALLOWED_CANDIDATE_STATUS_INPUTS, {
    message: `status must be one of: ${ALLOWED_CANDIDATE_STATUS_INPUTS.join(', ')}`,
  })
  @ApiProperty({
    description: 'New candidate status',
    example: 'INTERVIEW',
    enum: ALLOWED_CANDIDATE_STATUS_INPUTS,
  })
  status: AllowedCandidateStatusInput;
}

