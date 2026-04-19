import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { IMatchCandidateUseCase } from './use-cases/match-candidate/match-candidate.interface';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';

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
}
