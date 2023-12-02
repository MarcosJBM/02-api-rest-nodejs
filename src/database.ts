import { Knex, knex as setupKnex } from 'knex';

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: { filename: './db/app.db' },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    database: 'sqlite3',
    extension: 'ts',
  },
};

export const knex = setupKnex(config);
