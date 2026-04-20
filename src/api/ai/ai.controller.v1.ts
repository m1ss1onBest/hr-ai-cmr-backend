import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IMatchCandidateUseCase } from './use-cases/match-candidate/match-candidate.interface';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { ApiResponse } from '@nestjs/swagger';
import { ResumeAnalysisResponse } from './dto/analyze-resume.dto';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/modules/guards/roles.guard';
import { IAnalyzeResumeUseCase } from './use-cases/analyze-resume/analyze-resume.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  version: '1',
  path: 'ai',
})
export class AiControllerV1 {
  constructor(
    private readonly matchCandidateUseCase: IMatchCandidateUseCase,
    private readonly analyzeResumeUseCase: IAnalyzeResumeUseCase,
  ) {}

  @Post('match-candidate/candidate/:candidateId/vacancy/:vacancyId')
  @Roles(UserRole.HR)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Candidate matched successfully',
  })
  async matchCandidate(
    @Param('candidateId') candidateId: string,
    @Param('vacancyId') vacancyId: string,
  ) {
    return await this.matchCandidateUseCase.run({
      candidateId,
      vacancyId,
    });
  }

  @Post(':id/analyze-resume')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Resume analyzed successfully',
    type: ResumeAnalysisResponse,
  })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  @ApiResponse({ status: 408, description: 'AI request timed out' })
  @ApiResponse({ status: 429, description: 'AI rate limit exceeded' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  async analyzeResumeForCandidate(
    @Param('id') id: string,
  ): Promise<ResumeAnalysisResponse> {
    return await this.analyzeResumeUseCase.run(id);
  }
}
