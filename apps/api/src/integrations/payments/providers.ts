export type PaymentProvider = "telebirr" | "chapa" | "stripe";

export interface PaymentAdapter {
  createCheckout(input: { amountETB: number; bookingId: string }): Promise<{ checkoutUrl?: string; reference: string }>;
  verifyWebhook(input: { rawBody: string; signature?: string }): boolean;
}

export const paymentProviders: Record<PaymentProvider, PaymentAdapter> = {
  telebirr: {
    async createCheckout(input) {
      return { reference: `telebirr_${input.bookingId}` };
    },
    verifyWebhook() {
      return true;
    }
  },
  chapa: {
    async createCheckout(input) {
      return { reference: `chapa_${input.bookingId}` };
    },
    verifyWebhook() {
      return true;
    }
  },
  stripe: {
    async createCheckout(input) {
      return { reference: `stripe_${input.bookingId}` };
    },
    verifyWebhook() {
      return true;
    }
  }
};
