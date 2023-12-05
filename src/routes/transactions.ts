import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knexInstance } from '../database';
import { checkSessionIdExists } from '../middlewares';
import { validateSchema } from '../utils';

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async request => {
    const { sessionId } = request.cookies;

    const transactions = await knexInstance('transactions')
      .where({ session_id: sessionId })
      .select();

    return { transactions };
  });

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z
          .string({
            invalid_type_error: 'Id has an invalid type',
            required_error: 'Id is required',
          })
          .uuid('Invalid UUID'),
      });

      const result = validateSchema(request.params, getTransactionParamsSchema);

      if (typeof result === 'string')
        return reply.status(400).send({ error: result });

      const { id } = result;

      const { sessionId } = request.cookies;

      const transaction = await knexInstance('transactions')
        .where({ id, session_id: sessionId })
        .first();

      return { transaction };
    },
  );

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async request => {
    const { sessionId } = request.cookies;

    const summary = await knexInstance('transactions')
      .where({ session_id: sessionId })
      .sum('amount', { as: 'amount' })
      .first();

    return { summary };
  });

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z
        .string({
          invalid_type_error: 'Title has an invalid type',
          required_error: 'Title is required',
        })
        .min(1, 'Title is required')
        .max(36, 'The title must have a maximum of 36 characters'),
      amount: z
        .number({
          invalid_type_error: 'Amount has an invalid type',
          required_error: 'Amount is required',
        })
        .positive('Amount must be a positive number'),
      type: z.enum(['credit', 'debit'], {
        errorMap: () => ({ message: 'Type must be credit or debit' }),
      }),
    });

    const result = validateSchema(request.body, createTransactionBodySchema);

    if (typeof result === 'string')
      return reply.status(400).send({ error: result });

    const { amount, title, type } = result;

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        maxAge: SEVEN_DAYS_IN_SECONDS,
        path: '/',
      });
    }

    await knexInstance('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
