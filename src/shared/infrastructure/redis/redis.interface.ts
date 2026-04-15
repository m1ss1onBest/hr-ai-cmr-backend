import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from './redis.config';

export const REDIS_PROVIDER: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (config: RedisConfig) => {
    return new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
    });
  },
  inject: [RedisConfig],
};
