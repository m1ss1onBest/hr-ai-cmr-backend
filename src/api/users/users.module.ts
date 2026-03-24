import { Module } from '@nestjs/common';
import { UsersControllerV1 } from './users.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UsersService } from './users.service';
import { REPOSITORIES } from 'src/shared/infrastructure/database/repositories';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersControllerV1],
  providers: [...REPOSITORIES, UsersService],
  exports: [...REPOSITORIES],
})
export class UsersModule {}
