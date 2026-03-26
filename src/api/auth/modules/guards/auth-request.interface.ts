import { User } from 'src/shared/domain/users/user.entity';

export interface AuthRequest extends Request {
  _user?: User;
}
