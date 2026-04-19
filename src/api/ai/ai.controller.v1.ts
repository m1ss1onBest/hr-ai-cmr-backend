import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { IMatchCandidateUseCase } from './use-cases/match-candidate/match-candidate.interface';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { ApiResponse } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'ai',
})
export class AiControllerV1 {
  constructor(private readonly matchCandidateUseCase: IMatchCandidateUseCase) {}

  @Post('match-candidate/candidate/:candidateId/vacancy/:vacancyId')
  @Roles(UserRole.HR)
  @HttpCode(200)
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
    @Body() request: AnalyzeResumeRequest,
  ): Promise<ResumeAnalysisResponse> {
    return await this.analyzeResume.run({ candidateId: id, ...request });
  }
}
