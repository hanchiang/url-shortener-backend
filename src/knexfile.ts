/* eslint-disable @typescript-eslint/camelcase */
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
      application_name: config.applicationName,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  test: {
    client: 'postgres',
    useNullAsDefault: true,
    connection: {
      host: config.postgresHost,
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
      application_name: config.applicationName,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'postgres',
    useNullAsDefault: true,
    connection: {
      host: config.postgresHost,
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
      application_name: config.applicationName,
    },
    pool: {
      min: 1,
      max: 5,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  ...knexSnakeCaseMappers(),
};
