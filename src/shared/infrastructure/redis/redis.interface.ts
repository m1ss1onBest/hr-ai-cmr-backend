import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_PROVIDER: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'localhost',
      port: 6379,
    });
  },
};
