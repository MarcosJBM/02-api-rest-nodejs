import 'dotenv/config';

import { Knex, knex as setupKnex } from 'knex';

import { env } from './env';

const connection =
  env.DATABASE_CLIENT === 'sqlite3'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection,
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    database: env.DATABASE_CLIENT,
    extension: 'ts',
  },
};

export const knex = setupKnex(config);
