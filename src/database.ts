import 'dotenv/config';

import { Knex, knex as setupKnex } from 'knex';

import { env } from './env';

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: { filename: env.DATABASE_URL },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    database: 'sqlite3',
    extension: 'ts',
  },
};

export const knex = setupKnex(config);
