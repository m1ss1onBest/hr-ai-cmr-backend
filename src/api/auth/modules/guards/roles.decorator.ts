import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'prisma/generated/enums';
import { ROLES_KEY } from './roles.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
