import { faker } from '@faker-js/faker';
import { User } from '../src/types.js';

const SERVER_URL = 'http://localhost:3000';
const USER_COUNT = 100;

const users: User[] = Array.from({ length: USER_COUNT }, () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
}));

const startTime = Date.now();

const response = await fetch(`${SERVER_URL}/users/bulk`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: users,
    callbackEmail: faker.internet.email(),
  }),
});


const elapsed = Date.now() - startTime;
const result = await response.json();

console.log(`Status: ${response.status} ${response.statusText}`);
console.log(`Response:`, result);
console.log(`Total time: ${elapsed}ms`);
console.log(`Average per user: ${elapsed / USER_COUNT}ms`);
