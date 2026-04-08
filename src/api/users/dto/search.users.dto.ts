import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';
import { UserBaseResponse } from './user.base-response';
import { BaseSearchQuery } from 'src/shared/contracts/dto/search.dto';
import { UserRole } from 'prisma/generated/enums';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export type SortUsersBy = 'createdAt' | 'updatedAt' | 'name';

export class SearchUsersQuery extends BaseSearchQuery<SortUsersBy> {
  @IsOptional()
  @IsEnum(() => UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class SearchUsersResponse extends PaginatedResponse<UserBaseResponse> {}
