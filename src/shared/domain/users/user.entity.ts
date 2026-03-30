import { UserRole } from 'prisma/generated/enums';
import { UserModel } from 'prisma/generated/models';

export interface IUserData {
  id: string;
  password: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUserData {
  id: string;
  password: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IUserData | UserModel) {
    Object.assign(this, props);
  }

  safe(): SafeUserData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this;
    return user;
  }
}

export type SafeUserData = Omit<IUserData, 'password'>;
