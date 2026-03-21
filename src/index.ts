import Fastify from 'fastify';
import { BulkRequest, BulkResponse } from './types.js';
import { config } from './config/index.js';
import { userQueue, flowProducer } from './queue.js';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';

const fastify = Fastify({ logger: true });

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullMQAdapter(userQueue)],
  serverAdapter,
  options: {
    uiConfig: {
      locale: { lng: 'en' },
    }
  }
});

await fastify.register(serverAdapter.registerPlugin(), { prefix: '/queues' });

fastify.decorate('queue', userQueue);

fastify.get('/health', async () => ({ status: 'ok' }));

fastify.post<{ Body: BulkRequest }>('/users/bulk', async (request, reply) => {
  const { data: users, callbackEmail } = request.body;

  console.log(`Creating flow with ${users.length} user registrations`);
  await flowProducer.add({
    name: config.queue.flowName,
    queueName: config.queue.name,
    data: { callbackEmail },
    children: users.map((user) => ({
      name: config.queue.job.name,
      queueName: config.queue.name,
      data: user,
    })),
  });

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
