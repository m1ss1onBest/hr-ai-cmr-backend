import { ApiProperty } from '@nestjs/swagger';
import { CandidateStatus } from 'prisma/generated/enums';

export class FunnelStageDto {
  @ApiProperty({ enum: CandidateStatus })
  status: CandidateStatus;

  @ApiProperty({
    description: 'Human-friendly stage label for UI',
    example: 'Screening',
  })
  label: string;

  @ApiProperty({ example: 42 })
  count: number;

  @ApiProperty({
    description:
      'Conversion from previous stage to this one in percent. For the first stage is null.',
    example: 75.5,
    nullable: true,
  })
  conversionFromPrevPct: number | null;

  @ApiProperty({
    description: 'Conversion from the first stage to this stage (percent).',
    example: 12.34,
    nullable: true,
  })
  conversionFromStartPct: number | null;

  @ApiProperty({
    description:
      'Drop-off from previous stage to this stage in absolute candidates count. For the first stage is null.',
    example: 5,
    nullable: true,
  })
  dropOffFromPrev: number | null;
}

export class FunnelResponseDto {
  @ApiProperty({ type: [FunnelStageDto] })
  stages: FunnelStageDto[];

  @ApiProperty({ example: 123 })
  totalCandidates: number;
}
