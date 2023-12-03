import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z
    .string()
    .default('3333')
    .transform(port => Number(port)),
});

export const env = envSchema.parse(process.env);
