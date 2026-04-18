import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setValue(key: string, value: string, expiration?: number) {
    if (expiration) {
      await this.redis.set(key, value, 'EX', expiration);
    } else {
      await this.redis.set(key, value);
    }
  }

  async readValue(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async removeValue(key: string): Promise<boolean> {
    const result = await this.redis.del(key);
    return result > 0;
  }
}
