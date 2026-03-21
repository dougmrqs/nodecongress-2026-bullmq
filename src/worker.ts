import { Worker, Job, DelayedError } from 'bullmq';
import { config } from './config/index.js';
import {
  UserRegistrationClient,
  TooManyRequestError,
} from './services/UserRegistrationClient.js';
import { EmailService } from './services/EmailService.js';
import { User, BulkRegistrationParentData } from './types.js';

export const worker = new Worker(config.queue.name, async (job, token) => {
  switch (job.name) {
    case config.queue.job.name:
      return registerUser(job);

    case config.queue.flow.name:
      return sendBulkEmail(job);

    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}, {
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

async function registerUser(job: Job<User>, token?: string) {
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

async function sendBulkEmail(job: Job<BulkRegistrationParentData>) {
  console.log(`[Worker] All registrations complete, sending email to ${job.data.callbackEmail}`);
  await EmailService.sendResult(job.data.callbackEmail);
}

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job failed: ${job?.name}`, err);
});

worker.on('completed', (job) => {
  console.log(`[Worker] Job completed: ${job.name}`);
});
