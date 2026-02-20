import { Body, Controller, Get, Module, Param, Patch, Post } from "@nestjs/common";
import { query } from "../../common/utils/db";

class ReviewsService {
  async createReview(payload: {
    bookingId: string;
    userId: string;
    serviceType: string;
    serviceId: string;
    ratingOverall: number;
    cleanliness: number;
    value: number;
    comfort: number;
    comment?: string;
  }) {
    return query(
      `
        INSERT INTO reviews (
          id, booking_id, user_id, service_type, service_id, rating_overall, comment, moderation_status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pending'
        )
        RETURNING id
      `,
      [
        payload.bookingId,
        payload.userId,
        payload.serviceType,
        payload.serviceId,
        payload.ratingOverall,
        payload.comment ?? null
      ]
    );
  }
}

@Controller("reviews")
class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() payload: Record<string, unknown>) {
    await this.reviewsService.createReview({
      bookingId: String(payload.bookingId),
      userId: String(payload.userId),
      serviceType: String(payload.serviceType),
      serviceId: String(payload.serviceId),
      ratingOverall: Number(payload.ratingOverall),
      cleanliness: Number(payload.cleanliness),
      value: Number(payload.value),
      comfort: Number(payload.comfort),
      comment: payload.comment ? String(payload.comment) : undefined
    });
    return { status: "pending_moderation" };
  }

  @Get(":serviceType/:serviceId")
  getByService(@Param("serviceType") serviceType: string, @Param("serviceId") serviceId: string) {
    return { serviceType, serviceId, reviews: [] };
  }

  @Post(":id/helpful")
  markHelpful(@Param("id") id: string, @Body() payload: { userId: string }) {
    return { id, userId: payload.userId, vote: "helpful" };
  }

  @Patch("admin/:id/moderate")
  moderate(@Param("id") id: string, @Body() payload: { action: "approve" | "reject"; reason?: string }) {
    return { id, action: payload.action, reason: payload.reason ?? null };
  }
}

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
