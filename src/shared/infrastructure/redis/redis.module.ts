import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_PROVIDER } from './redis.interface';

export const REDIS_MODULE_PROVIDERS = [RedisService, REDIS_PROVIDER];

@Module({
  imports: [],
  exports: [...REDIS_MODULE_PROVIDERS],
  providers: [...REDIS_MODULE_PROVIDERS],
})
export class RedisModule {}
