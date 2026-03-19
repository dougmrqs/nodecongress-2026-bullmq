export const EmailService = {
  async sendResult(email: string): Promise<void> {
    console.log(`[Email] Results sent to: ${email}`);
  },
};
