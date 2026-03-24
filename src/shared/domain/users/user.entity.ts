import { UserRole } from 'prisma/generated/enums';
import { UserModel } from 'prisma/generated/models';

export interface IUserData {
  id: string;
  password: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export class User implements IUserData {
  id: string;
  password: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;

  constructor(data: IUserData | UserModel) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;

    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  safe(): SafeUserData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this;
    return this;
  }
}

export type SafeUserData = Omit<IUserData, 'password'>;
