import { User } from '../types.js';
import { config } from '../config/index.js';

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
      throw new Error(
        `Registration failed: ${response.status} -- ${response.statusText}`,
      );
    }

    return { success: true };
  },
};
