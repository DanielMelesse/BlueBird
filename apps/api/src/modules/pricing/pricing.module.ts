import { Body, Controller, Module, Post } from "@nestjs/common";
import { query } from "../../common/utils/db";

class PricingService {
  async quotePropertyNightly(roomId: string, checkIn: string, checkOut: string) {
    const sql = `
      SELECT
        d::date AS stay_date,
        COALESCE(sp.price_etb, r.base_price_etb) AS nightly_price_etb
      FROM generate_series($2::date, ($3::date - INTERVAL '1 day'), INTERVAL '1 day') d
      JOIN rooms r ON r.id = $1
      LEFT JOIN seasonal_prices sp
        ON sp.room_id = r.id
       AND d::date BETWEEN sp.start_date AND sp.end_date
    `;
    const result = await query<{ stay_date: string; nightly_price_etb: string }>(sql, [
      roomId,
      checkIn,
      checkOut
    ]);
    return result.rows;
  }
}

@Controller("pricing")
class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post("properties/quote")
  async quoteProperty(@Body() payload: { roomId: string; checkIn: string; checkOut: string }) {
    const nights = await this.pricingService.quotePropertyNightly(
      payload.roomId,
      payload.checkIn,
      payload.checkOut
    );
    const totalETB = nights.reduce((acc: number, night: { nightly_price_etb: string }) => {
      return acc + Number(night.nightly_price_etb);
    }, 0);
    return { nights, totalETB };
  }
}

@Module({
  controllers: [PricingController],
  providers: [PricingService]
})
export class PricingModule {}
