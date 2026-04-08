import { Module } from '@nestjs/common';
import { UsersControllerV1 } from './users.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UsersService } from './users.service';
import { SEARCH_USERS_USE_CASE_PROVIDER } from './use-cases/search-users/search-users.interface';
import { AuthModule } from '../auth/auth.module';

export const USERS_MODULE_PROVIDERS = [SEARCH_USERS_USE_CASE_PROVIDER];

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersControllerV1],
  providers: [UsersService, ...USERS_MODULE_PROVIDERS],
})
export class UsersModule {}
