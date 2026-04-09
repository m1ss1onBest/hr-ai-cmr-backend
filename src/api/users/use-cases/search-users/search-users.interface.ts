import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  SearchUsersQuery,
  SearchUsersResponse,
} from '../../dto/search.users.dto';
import { Provider } from '@nestjs/common';
import { SearchUsersUseCase } from './search-users.use-case';

export abstract class ISearchUsersUseCase extends IBaseUseCase<
  SearchUsersQuery,
  SearchUsersResponse
> {}

export const SEARCH_USERS_USE_CASE_PROVIDER: Provider = {
  provide: ISearchUsersUseCase,
  useClass: SearchUsersUseCase,
};
