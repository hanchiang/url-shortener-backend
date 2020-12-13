import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  mysqlHost: process.env.MYSQL_HOST,
  mysqlDb: process.env.MYSQL_DB,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlPort: parseInt(process.env.MYSQL_PORT) || 3306,
  redisCacheUrl: process.env['REDIS_CACHE_URL'],
  redisKeysUrl: process.env['REDIS_KEYS_URL'],
};

export default config;
