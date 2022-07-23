import Knex from 'knex';
import knexStringCase from 'knex-stringcase';
import { Model } from 'objection';
import { Redis } from './redis';
import config from '../config';
import dbConfig from '../knexfile';
import util from 'node:util';
import logger from '../utils/logger';
const exec = util.promisify(require('node:child_process').exec);

const getDbConfig = (env: string) => dbConfig[env];

let knex: Knex;

export const initDb = async () => {
  await runMigrations();
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

export const runMigrations = async () => {
  const knexFile =
    config.nodeEnv === 'production'
      ? './dist/knexfile.js'
      : './src/knexfile.ts';
  const commands = [
    `knex migrate:list --knexfile ${knexFile}`,
    `knex migrate:latest --knexfile ${knexFile}`,
  ];

  for (const command of commands) {
    logger.info(`Migration command: ${command}`);
    try {
      const { stdout, stderr } = await exec(command);
      logger.info(`stdout: ${stdout}`);
      logger.info(`stderr:${stderr}`);
    } catch (e) {
      logger.error('Encountered error when running migrations: ', { error: e });
    }
  }
};
