import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { CandidateBaseResponse } from '../../dto/candidate.base-response';
import { DeleteCandidateUseCase } from './delete-candidate.use-case';

export abstract class IDeleteCandidateUseCase extends IBaseUseCase<
  { id: string },
  CandidateBaseResponse
> {}

export const DELETE_CANDIDATE_USE_CASE_PROVIDER: Provider = {
  provide: IDeleteCandidateUseCase,
  useClass: DeleteCandidateUseCase,
};
