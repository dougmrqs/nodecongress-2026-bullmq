import Fastify from 'fastify';
import { BulkRequest, BulkResponse } from './types.js';
import { UserRegistration } from './services/UserRegistration.js';
import { EmailService } from './services/EmailService.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({ status: 'ok' }));

fastify.post<{ Body: BulkRequest }>('/users/bulk', async (request, reply) => {
  const { data: users, callbackEmail } = request.body;

  for (const user of users) {
    await UserRegistration.register(user);
  }

  await EmailService.sendResult(callbackEmail);

  const response: BulkResponse = {
    accepted: true,
    callbackEmail,
  };

  return reply.status(202).send(response);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
