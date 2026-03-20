import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { userRepository } from './db.js';

const fastify = Fastify({ logger: true });

await fastify.register(rateLimit, {
  max: 50,
  timeWindow: '1 second',
});

fastify.post<{ Body: { username: string; email: string } }>(
  '/users',
  async (request, reply) => {
    const { username, email } = request.body;
    const delay = Math.floor(Math.random() * 301) + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
    const user = userRepository.create({ username, email });
    return reply.status(201).send({ data: user });
  },
);

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
