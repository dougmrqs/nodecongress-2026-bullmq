export const config = {
  redis: {
    host: 'localhost',
    port: 6379,
  },
  servers: {
    main: {
      host: 'localhost',
      port: 3000,
    },
    registration: {
      host: 'localhost',
      port: 3001,
      baseUrl: 'http://localhost:3001',
    },
  },
  queue: {
    name: 'user-registration',
    job: {
      name: 'register-user',
    },
  },
  worker: {
    concurrency: 30,
    rateLimit: {
      max: 10,
      duration: 1000, // 1 second
    }
  }
};
