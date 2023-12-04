import type { Knex } from 'knex';

import { config as developmentConfig } from './src/database';

const config: { [key: string]: Knex.Config } = {
  development: developmentConfig,

  test: developmentConfig,

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = config;
