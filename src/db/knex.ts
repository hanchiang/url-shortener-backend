import config from '../config';

const dbConfig = {
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
  },
};

export const getDbConfig = (env: string) => dbConfig[env];
