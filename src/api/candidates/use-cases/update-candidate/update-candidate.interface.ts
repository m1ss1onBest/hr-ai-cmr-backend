import { Provider } from '@nestjs/common';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  UpdateCandidateRequest,
  UpdateCandidateResponse,
} from '../../dto/update.candidate.dto';
import { UpdateCandidateUseCase } from './update-candidate.use-case';

export abstract class IUpdateCandidateUseCase extends IBaseUseCase<
  UpdateCandidateRequest & { id: string },
  UpdateCandidateResponse
> {}

export const UPDATE_CANDIDATE_USE_CASE_PROVIDER: Provider = {
  provide: IUpdateCandidateUseCase,
  useClass: UpdateCandidateUseCase,
};
