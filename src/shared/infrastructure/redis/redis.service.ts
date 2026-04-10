import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setValue(key: string, value: string, expiration?: number) {
    if (expiration) {
      await this.redis.set(key, value, 'EX', expiration);
    } else {
      await this.redis.set(key, value);
    }
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}
