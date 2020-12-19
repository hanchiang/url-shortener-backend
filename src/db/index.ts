import Knex from 'knex';
import { Model } from 'objection';
import config from '../config';
import { getDbConfig } from './knex';

export const initDb = () => {
  const knex = Knex(getDbConfig(config.nodeEnv));
  Model.knex(knex);
};
