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

  constructor(data: IUserData | UserModel) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  safe(): SafeUserData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this;
    return this;
  }
}

export type SafeUserData = Omit<IUserData, 'password'>;
