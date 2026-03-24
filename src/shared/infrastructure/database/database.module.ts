import { Module } from '@nestjs/common';
import { REPOSITORIES } from './repositories';
import { PrismaService } from './prisma.service';

@Module({
  providers: [...REPOSITORIES, PrismaService],
  exports: [...REPOSITORIES, PrismaService],
})
export class DatabaseModule {}
