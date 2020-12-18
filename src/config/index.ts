import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresDb: process.env.POSTGRES_DB || 'url-shortener',
  postgresUser: process.env.POSTGRES_USER || 'root',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'root',
  postgresPort: parseInt(process.env.POSTGRES_PORT) || 5432,
  redisUrl: process.env['REDIS_URL'] || 'redis://localhost:6379/0',
};

export default config;
