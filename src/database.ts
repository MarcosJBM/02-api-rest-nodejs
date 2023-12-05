import 'dotenv/config';

import { Knex, knex as setupKnex } from 'knex';

import { env } from './env';

type Config = Record<'development' | 'test', Knex.Config>;

const connection =
  env.DATABASE_CLIENT === 'sqlite3'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL;

export const config: Config = {
  development: {
    client: env.DATABASE_CLIENT,
    connection,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
      database: env.DATABASE_CLIENT,
      extension: 'ts',
    },
  },

  test: {
    client: env.DATABASE_CLIENT,
    connection,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
      database: env.DATABASE_CLIENT,
      extension: 'ts',
    },
  },
};

export const knex = setupKnex(config.test);
