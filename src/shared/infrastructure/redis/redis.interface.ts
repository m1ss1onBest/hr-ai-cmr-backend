import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from './redis.config';
import { RedisService } from './redis.service';

export const REDIS_PROVIDER: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (config: RedisConfig) => {
    const logger: Logger = new Logger(RedisService.name);

    const redis = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
    });

    redis.on('connect', () => {
      logger.log('Redis connecting...');
    });

    redis.on('ready', () => {
      logger.log('Redis connection successfully');
    });

    redis.on('error', (err) => {
      logger.error('Redis error', err);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    return redis;
  },
  inject: [RedisConfig],
};
