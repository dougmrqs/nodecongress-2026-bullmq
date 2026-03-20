import Fastify from 'fastify';
import { BulkRequest, BulkResponse } from './types.js';
import { config } from './config/index.js';
import { EmailService } from './services/EmailService.js';
import { userQueue } from './queue.js';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';

const fastify = Fastify({ logger: true });

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullMQAdapter(userQueue)],
  serverAdapter,
});

await fastify.register(serverAdapter.registerPlugin(), { prefix: '/queues' });

fastify.decorate('queue', userQueue);

fastify.get('/health', async () => ({ status: 'ok' }));

fastify.post<{ Body: BulkRequest }>('/users/bulk', async (request, reply) => {
  const { data: users, callbackEmail } = request.body;

  const userJobs = users.map((user) => ({
    name: config.queue.job.name,
    data: user,
  }));

  console.log(`Adding ${userJobs.length} jobs to the queue`);
  await userQueue.addBulk(userJobs);

  await EmailService.sendResult(callbackEmail);

  const response: BulkResponse = {
    accepted: true,
    callbackEmail,
  };

  return reply.status(202).send(response);
});

const start = async () => {
  try {
    await fastify.listen(config.servers.main);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
