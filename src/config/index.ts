import path from 'path';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.test') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresDb: process.env.POSTGRES_DB || 'url_shortener',
  postgresUser: process.env.POSTGRES_USER || 'root',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'root',
  postgresPort: parseInt(process.env.POSTGRES_PORT) || 5432,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379/0',
  baseDomain: process.env.BASE_DOMAIN || 'http://localhost:3000',
};

export default config;
