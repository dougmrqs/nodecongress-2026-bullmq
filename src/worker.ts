import { Worker } from 'bullmq';
import { User } from './types.js';
import { config } from './config/index.js';
import { UserRegistrationClient } from './services/UserRegistrationClient.js';

async function jobHandler(job: { data: User }) {
  console.log(`[Worker] Registering user: ${job.data.username}`);
  return await UserRegistrationClient.register(job.data);
}

export const userWorker = new Worker<User>(config.queue.name, jobHandler, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

userWorker.on('failed', (job, err) => {
  console.error(`[Worker] Failed to register user: ${job?.data.username}`, err);
});

userWorker.on('completed', (job) => {
  console.log(`[Worker] User registered: ${job.data.username}`);
});
