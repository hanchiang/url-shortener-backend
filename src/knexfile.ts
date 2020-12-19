import { knexSnakeCaseMappers } from 'objection';
import config from './config';
// Update with your config settings.

export default {
  development: {
    client: 'postgres',
    useNullAsDefault: true,
    connection: {
      host: config.postgresHost,
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  ...knexSnakeCaseMappers(),
};
