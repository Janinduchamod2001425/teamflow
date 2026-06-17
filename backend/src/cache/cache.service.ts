import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis = new Redis({
    host: 'localhost',
    port: 6379,
  });

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 300) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  async deleteByPattern(pattern: string) {
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
