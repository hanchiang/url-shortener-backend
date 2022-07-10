import Knex from 'knex';
import knexStringCase from 'knex-stringcase';
import { Model } from 'objection';
import { Redis } from './redis';
import config from '../config';
import dbConfig from '../knexfile';

const getDbConfig = (env: string) => dbConfig[env];

let knex: Knex;

export const initDb = () => {
  knex = Knex(getKnexOptions());
  Model.knex(knex);
  Redis.getInstance();
};

export const closeDb = async () => {
  await clearDb();
  await knex.destroy();
  await Redis.close();
};

export const clearDb = async () => {
  await knex('url').del();
  await Redis.flush();
};

const getKnexOptions = () => {
  return knexStringCase(getDbConfig(config.nodeEnv));
};
