import { Body, Controller, Get, Module, Post } from "@nestjs/common";
import { query } from "../../common/utils/db";

class AvailabilityService {
  async checkRoomAvailability(roomId: string, checkIn: string, checkOut: string) {
    const sql = `
      SELECT stay_date, available_count
      FROM room_inventory
      WHERE room_id = $1
        AND stay_date >= $2::date
        AND stay_date < $3::date
      ORDER BY stay_date ASC
    `;
    const result = await query(sql, [roomId, checkIn, checkOut]);
    return result.rows;
  }
}

@Controller("availability")
class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get("rooms")
  async getRoomAvailability() {
    return {
      message: "Use POST /availability/rooms/check with room and date range"
    };
  }

  @Post("rooms/check")
  async checkRooms(@Body() payload: { roomId: string; checkIn: string; checkOut: string }) {
    const rows = await this.availabilityService.checkRoomAvailability(
      payload.roomId,
      payload.checkIn,
      payload.checkOut
    );
    return { rows };
  }
}

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService]
})
export class AvailabilityModule {}
