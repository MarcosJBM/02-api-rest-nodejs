import 'dotenv/config';

import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test')
  config({ path: '.env.test', override: true });
else config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      errorMap: () => ({
        message: 'NODE_ENV must be development, test or production',
      }),
    })
    .default('production'),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg'], {
    errorMap: () => ({ message: 'DATABASE_CLIENT must be sqlite3 or pg' }),
  }),
  DATABASE_URL: z
    .string({
      invalid_type_error: 'DATABASE_URL has an invalid type',
      required_error: 'DATABASE_URL is required',
    })
    .min(1, 'DATABASE_URL is required'),
  PORT: z
    .number({
      coerce: true,
      invalid_type_error: 'PORT has an invalid type',
      required_error: 'PORT is required',
    })
    .default(3333),
});

const result = envSchema.safeParse(process.env);

if (!result.success) throw new Error(result.error.errors[0].message);

export const env = result.data;
