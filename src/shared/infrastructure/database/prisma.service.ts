import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../prisma/generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async healthCheck() {
    await this.$queryRaw`SELECT 1`;
  }

  async onModuleInit() {
    try {
      await this.healthCheck();
      await this.$connect();
      this.logger.log(`Database connection successfully`);
    } catch {
      this.logger.error(
        'Database connection failed! Unable to reach PostgreSQL. Please check if the database is running.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
