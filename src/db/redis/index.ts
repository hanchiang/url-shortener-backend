import redis, { RedisClient, ClientOpts } from 'redis';
import Promise from 'bluebird';
import config from '../../config';

Promise.promisifyAll(redis);

export class Redis {
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

  public static close(): void {
    this.instance.conn.quit();
  }

  public static flush(): void {
    this.instance.conn.flushdb();
  }
}
