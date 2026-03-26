import { UserRole } from 'prisma/generated/enums';
import { SafeUserData } from 'src/shared/domain/users/user.entity';

export class UserBaseResponse implements SafeUserData {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
