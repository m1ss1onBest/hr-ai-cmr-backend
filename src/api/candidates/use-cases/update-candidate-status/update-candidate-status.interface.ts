import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CandidateBaseResponse } from '../../dto/candidate.base-response';
import { UpdateCandidateStatusUseCase } from './update-candidate-status.use-case';

export type UpdateCandidateStatusRequest = {
  id: string;
  status: string;
  changedById: string;
};

export abstract class IUpdateCandidateStatusUseCase extends IBaseUseCase<
  UpdateCandidateStatusRequest,
  CandidateBaseResponse
> {}

export const UPDATE_CANDIDATE_STATUS_USE_CASE_PROVIDER: Provider = {
  provide: IUpdateCandidateStatusUseCase,
  useClass: UpdateCandidateStatusUseCase,
};
