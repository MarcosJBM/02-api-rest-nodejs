import 'dotenv/config';

import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test')
  config({ path: '.env.test', override: true });
else config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z
    .string()
    .default('3333')
    .transform(port => Number(port)),
});

export const env = envSchema.parse(process.env);
