import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { FunnelResponseDto } from './dto/funnel.dto';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsOverviewStatsResponseDto,
  AnalyticsJobsTableResponseDto,
} from './dto/overview.dto';

@Controller({
  version: '1',
  path: 'analytics',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsControllerV1 {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('funnel')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Funnel stats: counts per stage and conversion % between stages',
    type: FunnelResponseDto,
  })
  async getFunnel(): Promise<FunnelResponseDto> {
    return await this.analyticsService.getFunnel();
  }

  @Get('overview/stats')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Top cards overview: open vacancies, new candidates, interview/test candidates, hired; includes MoM % change',
    type: AnalyticsOverviewStatsResponseDto,
  })
  async getOverviewStats(): Promise<AnalyticsOverviewStatsResponseDto> {
    return await this.analyticsService.getOverviewStats();
  }

  @Get('overview/jobs-table')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Jobs overview table: vacancies list with aggregated funnel counts (total, interview/test, offer, hired)',
    type: AnalyticsJobsTableResponseDto,
  })
  async getJobsTable(): Promise<AnalyticsJobsTableResponseDto> {
    return await this.analyticsService.getJobsTable();
  }
}
