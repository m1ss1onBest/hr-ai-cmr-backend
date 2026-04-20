import { UserRole } from 'prisma/generated/enums';
import { UserBaseResponse } from './user.base-response';

export class CreateUserRequest {
  password: string;
  name: string;
  email: string;
  role?: UserRole;
}

export class CreateUserResponse extends UserBaseResponse {}
