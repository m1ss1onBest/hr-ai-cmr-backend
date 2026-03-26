import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  SearchCandidatesQuery,
  SearchCandidatesPaginatedResponse,
} from '../../dto/search.candidates.dto';
import { Provider } from '@nestjs/common';
import { SearchCandidatesUseCase } from './search-candidates.use-case';

export abstract class ISearchCandidatesUseCase extends IBaseUseCase<
  SearchCandidatesQuery,
  SearchCandidatesPaginatedResponse
> {}

export const SEARCH_CANDIDATES_USE_CASE_PROVIDER: Provider = {
  provide: ISearchCandidatesUseCase,
  useClass: SearchCandidatesUseCase,
};
