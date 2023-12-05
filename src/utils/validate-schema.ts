import { z } from 'zod';

export function validateSchema<T>(body: unknown, schema: z.ZodType<T>) {
  const result = schema.safeParse(body);

  if (!result.success) return result.error.errors[0].message;

  return result.data;
}
