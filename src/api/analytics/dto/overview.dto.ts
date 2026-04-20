import { ApiProperty } from '@nestjs/swagger';

export class OverviewMetricDto {
  @ApiProperty({ example: 42 })
  value: number;

  @ApiProperty({
    description:
      'Month-over-month change percent relative to previous month. Null when previous month is 0 or missing.',
    example: 12.34,
    nullable: true,
  })
  momChangePct: number | null;
}

export class AnalyticsOverviewStatsResponseDto {
  @ApiProperty({ type: OverviewMetricDto })
  openVacancies: OverviewMetricDto;

  @ApiProperty({ type: OverviewMetricDto })
  newCandidates: OverviewMetricDto;

  @ApiProperty({ type: OverviewMetricDto })
  interviewOrTestCandidates: OverviewMetricDto;

  @ApiProperty({ type: OverviewMetricDto })
  hiredCandidates: OverviewMetricDto;
}

export class AnalyticsJobTableRowDto {
  @ApiProperty({ example: '4f171e9c-1a3b-4e14-9f8d-2c0bf0b0b5ce' })
  id: string;

  @ApiProperty({ example: 'Senior Backend Engineer' })
  title: string;

  @ApiProperty({ example: 'OPEN', required: false })
  status?: string;

  @ApiProperty({ example: 10 })
  totalCandidates: number;

  @ApiProperty({ example: 3 })
  interviewOrTest: number;

  @ApiProperty({ example: 1 })
  offer: number;

  @ApiProperty({ example: 1 })
  hired: number;
}

export class AnalyticsJobsTableResponseDto {
  @ApiProperty({ type: [AnalyticsJobTableRowDto] })
  data: AnalyticsJobTableRowDto[];
}

