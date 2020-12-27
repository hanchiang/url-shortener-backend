import Knex from 'knex';
import knexStringCase from 'knex-stringcase';
import { Model } from 'objection';
import { Redis } from './redis';
import config from '../config';
import dbConfig from '../knexfile';

const getDbConfig = (env: string) => dbConfig[env];
export const initDb = () => {
  const knex = Knex(getKnexOptions());
  Model.knex(knex);
  Redis.getInstance();
};

export const closeDb = async () => {
  // TODO: some connection does not close
  const knex = Knex(getKnexOptions());
  await flushDb();
  await knex.destroy();
  await Redis.close();
};

const flushDb = async () => {
  const knex = Knex(getKnexOptions());
  knex.schema.dropTableIfExists('url');
  await Redis.flush();
};

const getKnexOptions = () => {
  return knexStringCase(getDbConfig(config.nodeEnv));
};
