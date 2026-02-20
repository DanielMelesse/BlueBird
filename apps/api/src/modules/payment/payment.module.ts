import crypto from "node:crypto";
import { Body, Controller, Headers, Module, Param, Post } from "@nestjs/common";
import { query } from "../../common/utils/db";

type Gateway = "telebirr" | "chapa" | "stripe";

type PaymentIntentPayload = {
  bookingId: string;
  amountETB: number;
  gateway: Gateway;
};

class PaymentService {
  async createIntent(payload: PaymentIntentPayload) {
    const result = await query<{ id: string }>(
      `
        INSERT INTO payments (id, booking_id, provider, amount_etb, status)
        VALUES (gen_random_uuid(), $1, $2, $3, 'pending')
        RETURNING id
      `,
      [payload.bookingId, payload.gateway, payload.amountETB]
    );
    return { paymentId: result.rows[0].id, gateway: payload.gateway, status: "pending" };
  }

  verifySignature(rawBody: string, signature: string | undefined, secret: string) {
    if (!signature) {
      return false;
    }
    const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  }

  async processWebhook(provider: Gateway, eventId: string, status: string, paymentId: string) {
    await query(
      `
        INSERT INTO payment_webhook_events (provider, provider_event_id, payload)
        VALUES ($1, $2, jsonb_build_object('status', $3, 'paymentId', $4))
        ON CONFLICT (provider, provider_event_id) DO NOTHING
      `,
      [provider, eventId, status, paymentId]
    );

    if (status === "paid") {
      await query(`UPDATE payments SET status = 'captured' WHERE id = $1`, [paymentId]);
    }
    if (status === "failed") {
      await query(`UPDATE payments SET status = 'failed' WHERE id = $1`, [paymentId]);
    }
  }
}

@Controller("payments")
class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("intent")
  createIntent(@Body() payload: PaymentIntentPayload) {
    return this.paymentService.createIntent(payload);
  }

  @Post("webhooks/:provider")
  async webhook(
    @Body() payload: { rawBody: string; eventId: string; status: string; paymentId: string },
    @Headers("x-signature") signature: string | undefined,
    @Param("provider") provider: Gateway
  ) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET ?? "development-secret";
    const valid = this.paymentService.verifySignature(payload.rawBody, signature, secret);
    if (!valid) {
      return { accepted: false, reason: "invalid_signature" };
    }

    await this.paymentService.processWebhook(provider, payload.eventId, payload.status, payload.paymentId);
    return { accepted: true };
  }
}

@Module({
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
