import { Queue } from 'bullmq';
import { config } from './config/index.js';

export const userQueue = new Queue(config.queue.name, {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});
