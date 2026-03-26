import { Module } from '@nestjs/common';
import { UsersControllerV1 } from './users.controller.v1';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersControllerV1],
  providers: [UsersService],
})
export class UsersModule {}
