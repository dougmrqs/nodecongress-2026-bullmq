import { Worker, Job, DelayedError } from 'bullmq';
import { config } from './config/index.js';
import {
  UserRegistrationClient,
  TooManyRequestError,
} from './services/UserRegistrationClient.js';
import { User } from './types.js';

async function jobHandler(job: Job<User>, token?: string) {
  console.log(`[Worker] Registering user: ${job.data.username}`);
  try {
    return await UserRegistrationClient.register(job.data);
  } catch (err) {
    if (err instanceof TooManyRequestError) {

      console.log(
        `[Worker] Rate limited: ${job.data.username}, delaying retry`,
      );
      await job.moveToDelayed(Date.now() + 5000, token ?? '');
      throw new DelayedError();
    }
    throw err;
  }
}

export const userWorker = new Worker<User>(config.queue.name, jobHandler, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
  concurrency: config.worker.concurrency,
  limiter: {
    max: config.worker.rateLimit.max,
    duration: config.worker.rateLimit.duration,
  }
});

userWorker.on('failed', (job, err) => {
  console.error(`[Worker] Failed to register user: ${job?.data.username}`, err);
});

userWorker.on('completed', (job) => {
  console.log(`[Worker] User registered: ${job.data.username}`);
});
