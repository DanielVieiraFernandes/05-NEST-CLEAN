import { Injectable } from '@nestjs/common';
import { CacheRepository } from '../cache-repository';
import { RedisService } from './redis.service';

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: any) {
    await this.redis.set(key, value, 'EX', 60 * 15);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
