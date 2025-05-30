// knexfile.ts
import type { Knex } from 'knex';
import { env } from './env';

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './db/migrations',
    },
  },
};

export default config;
