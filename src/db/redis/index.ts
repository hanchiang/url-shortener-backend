/* eslint-disable @typescript-eslint/no-unused-vars */
import redis, { RedisClient, ClientOpts } from 'redis';
import BluebirdPromise from 'bluebird';
import config from '../../config';

BluebirdPromise.promisifyAll(redis);

export interface MemoryStore {
  setString(key: string, value: string, ttl?: number): Promise<void>;
  getString(key: string): Promise<string | null>;
}

export class Redis implements MemoryStore {
  private static instance: Redis;
  private conn: RedisClient;

  private constructor(redis: RedisClient) {
    this.conn = redis;
  }

  public static getInstance(): Redis {
    if (!this.instance) {
      const redis = this.connect({ url: config.redisUrl });
      this.instance = new Redis(redis);
    }
    return this.instance;
  }

  private static connect(options?: ClientOpts): RedisClient {
    return redis.createClient(options);
  }

  public async setString(
    key: string,
    value: string,
    ttl: number = 60 * 60
  ): Promise<void> {
    if (ttl) {
      await this.conn.set(key, value, 'EX', ttl);
    } else {
      await this.conn.set(key, value);
    }
  }

  public async getString(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.conn.get(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }

  public static close(): Promise<void> {
    return new Promise((resolve) => {
      this.instance.conn.quit((err, data) => {
        this.instance.conn = null;
        this.instance = null;
        resolve();
      });
    });
  }

  public static flush(): Promise<void> {
    return new Promise((resolve) => {
      this.instance.conn.flushdb((err, data) => resolve());
    });
  }
}
