// src/database.ts
import { knex as setupKnex } from 'knex';
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

// Esta é a instância que deve ser usada nas rotas
export const knex = setupKnex(config[env.NODE_ENV || 'development']);
