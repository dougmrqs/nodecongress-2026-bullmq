import { User } from '../types.js';
import { config } from '../config/index.js';

export class TooManyRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TooManyRequestError';
  }
}

export const UserRegistrationClient = {
  async register(user: User): Promise<{ success: boolean }> {
    const response = await fetch(
      `${config.servers.registration.baseUrl}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new TooManyRequestError('Too many requests');
      }

      throw new Error(
        `Registration failed: ${response.status} -- ${response.statusText}`,
      );
    }

    return { success: true };
  },
};
