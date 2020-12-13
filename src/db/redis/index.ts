import redis, { RedisClient, ClientOpts } from 'redis';
import Promise from 'bluebird'
import config from '../../config';

Promise.promisifyAll(redis)

export class Redis {
  private static instance: Redis;
  private static readonly REDIS_CACHE = 'REDIS_CACHE'; // redis used for caching shortened url -> original url
  private static readonly REDIS_KEYS = 'REDIS_KEYS'; // redis used for storing available keys
  private connection: { [key: string]: RedisClient };
  private constructor(conn: { [key: string]: RedisClient }) {
    this.connection = conn;
  }
  public static getInstance(): Redis {
    if (!this.instance) {
      const redisCache = this.connect({ url: config.redisCacheUrl });
      const redisKeys = this.connect({ url: config.redisKeysUrl });
      this.instance = new Redis({
        [this.REDIS_CACHE]: redisCache,
        [this.REDIS_KEYS]: redisKeys,
      });
    }
    return this.instance;
  }

  private static connect(options?: ClientOpts): RedisClient {
    return redis.createClient(options);
  }

  public static close(): void {
    for (const conn of Object.values(this.instance.connection)) {
      conn.quit();
    }
  }

  public static flush(connectionKey?: string): void {
    if (connectionKey) {
      this.instance.connection[connectionKey].flushdb();
    } else {
      for (const conn of Object.values(this.instance.connection)) {
        conn.flushdb();
      }
    }
  }
}
