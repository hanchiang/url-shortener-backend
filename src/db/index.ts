import Knex from 'knex';
import knexStringCase from 'knex-stringcase';
import { Model } from 'objection';
import { Redis } from './redis';
import config from '../config';
import dbConfig from '../knexfile';

const getDbConfig = (env: string) => dbConfig[env];

export const initDb = () => {
  const options = knexStringCase(getDbConfig(config.nodeEnv));
  const knex = Knex(options);
  Model.knex(knex);
  Redis.getInstance();
};
