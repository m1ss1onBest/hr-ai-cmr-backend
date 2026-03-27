import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { GetCandidateUseCase } from './get-candidate.use-case';
import { CandidateBaseResponse } from '../../dto/candidate.base-response';

export abstract class IGetCandidateUseCase extends IBaseUseCase<
  string,
  CandidateBaseResponse
> {}

export const GET_CANDIDATE_USE_CASE_PROVIDER: Provider = {
  provide: IGetCandidateUseCase,
  useClass: GetCandidateUseCase,
};
