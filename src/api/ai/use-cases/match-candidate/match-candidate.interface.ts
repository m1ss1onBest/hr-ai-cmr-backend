import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { MatchCandidateUseCase } from './match-candidate.use-case';
import { MatchCandidateResponse } from '../../dto/match-candidate.dto';

export abstract class IMatchCandidateUseCase extends IBaseUseCase<
  { candidateId: string; vacancyId: string },
  MatchCandidateResponse
> {}

export const MATCH_CANDIDATE_USE_CASE_PROVIDER: Provider = {
  provide: IMatchCandidateUseCase,
  useClass: MatchCandidateUseCase,
};
