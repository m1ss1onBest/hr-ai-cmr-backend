import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from '../../dto/create.candidate.dto';
import { Provider } from '@nestjs/common';
import { CreateCandidateUseCase } from './create-candidate.use-case';

export abstract class ICreateCandidateUseCase extends IBaseUseCase<
  CreateCandidateRequest,
  CreateCandidateResponse
> {}

export const CREATE_CANDIDATE_USE_CASE_PROVIDER: Provider = {
  provide: ICreateCandidateUseCase,
  useClass: CreateCandidateUseCase,
};
