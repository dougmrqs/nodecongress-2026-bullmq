import { User } from '../types.js';

export const UserRegistration = {
  async register(_user: User): Promise<{ success: boolean }> {
    const delay = Math.floor(Math.random() * 301) + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return { success: true };
  },
};
