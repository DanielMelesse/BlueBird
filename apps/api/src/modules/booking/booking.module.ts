import { Body, Controller, Module, Post } from "@nestjs/common";
import { pool } from "../../common/utils/db";
import { withLock } from "../../common/utils/redis";

type PropertyHoldPayload = {
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  roomsRequested: number;
};

type BusSeatHoldPayload = {
  userId: string;
  tripId: string;
  seatNo: string;
};

class BookingService {
  async holdProperty(payload: PropertyHoldPayload) {
    return withLock(`hold:property:${payload.roomId}:${payload.checkIn}:${payload.checkOut}`, 30, async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const inventoryResult = await client.query<{ available_count: number }>(
          `
            SELECT available_count
            FROM room_inventory
            WHERE room_id = $1
              AND stay_date >= $2::date
              AND stay_date < $3::date
            FOR UPDATE
          `,
          [payload.roomId, payload.checkIn, payload.checkOut]
        );

        if (
          inventoryResult.rows.some(
            (row: { available_count: number }) => row.available_count < payload.roomsRequested
          )
        ) {
          throw new Error("Insufficient inventory");
        }

        await client.query(
          `
            UPDATE room_inventory
            SET available_count = available_count - $1
            WHERE room_id = $2
              AND stay_date >= $3::date
              AND stay_date < $4::date
          `,
          [payload.roomsRequested, payload.roomId, payload.checkIn, payload.checkOut]
        );

        const booking = await client.query<{ id: string }>(
          `
            INSERT INTO bookings (id, user_id, service_type, status, currency_code)
            VALUES (gen_random_uuid(), $1, 'property', 'pending_payment', 'ETB')
            RETURNING id
          `,
          [payload.userId]
        );

        await client.query("COMMIT");
        return { bookingId: booking.rows[0].id, status: "pending_payment" };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    });
  }

  async holdBusSeat(payload: BusSeatHoldPayload) {
    return withLock(`seatlock:${payload.tripId}:${payload.seatNo}`, 300, async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        await client.query(
          `
            SELECT 1
            FROM bus_trip_seats
            WHERE trip_id = $1 AND seat_no = $2
            FOR UPDATE
          `,
          [payload.tripId, payload.seatNo]
        );

        const ticket = await client.query<{ id: string }>(
          `
            INSERT INTO bus_tickets (id, trip_id, seat_no, status, qr_token)
            VALUES (gen_random_uuid(), $1, $2, 'reserved', encode(gen_random_bytes(24), 'hex'))
            RETURNING id
          `,
          [payload.tripId, payload.seatNo]
        );

        await client.query("COMMIT");
        return { ticketId: ticket.rows[0].id, status: "reserved" };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    });
  }
}

@Controller("bookings")
class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("properties/hold")
  holdProperty(@Body() payload: PropertyHoldPayload) {
    return this.bookingService.holdProperty(payload);
  }

  @Post("bus/seat-hold")
  holdBusSeat(@Body() payload: BusSeatHoldPayload) {
    return this.bookingService.holdBusSeat(payload);
  }
}

@Module({
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
