import request = require("supertest");
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

type MockDbState = {
  inventoryByRoom: Map<string, number[]>;
  busTickets: Set<string>;
  bookingSequence: number;
  ticketSequence: number;
};

const mockDbState: MockDbState = {
  inventoryByRoom: new Map(),
  busTickets: new Set(),
  bookingSequence: 1,
  ticketSequence: 1
};

const activeLocks = new Set<string>();

function sqlText(input: unknown): string {
  return typeof input === "string" ? input : "";
}

jest.mock("../src/common/utils/redis", () => ({
  withLock: async (key: string, _ttl: number, callback: () => Promise<unknown>) => {
    if (activeLocks.has(key)) {
      throw new Error("Resource is currently locked");
    }
    activeLocks.add(key);
    try {
      // Keep lock long enough to make concurrency behavior deterministic in tests.
      await new Promise((resolve) => setTimeout(resolve, 20));
      return await callback();
    } finally {
      activeLocks.delete(key);
    }
  },
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }
}));

jest.mock("../src/common/utils/db", () => ({
  query: jest.fn(),
  pool: {
    connect: jest.fn(async () => ({
      query: jest.fn(async (sql: unknown, params: unknown[] = []) => {
        const text = sqlText(sql);

        if (text.includes("SELECT available_count") && text.includes("FROM room_inventory")) {
          const roomId = String(params[0]);
          const available = mockDbState.inventoryByRoom.get(roomId) ?? [0];
          return {
            rows: available.map((available_count) => ({ available_count }))
          };
        }

        if (text.includes("UPDATE room_inventory")) {
          const roomId = String(params[1]);
          const decrement = Number(params[0]);
          const current = mockDbState.inventoryByRoom.get(roomId) ?? [0];
          mockDbState.inventoryByRoom.set(
            roomId,
            current.map((value) => value - decrement)
          );
          return { rows: [] };
        }

        if (text.includes("INSERT INTO bookings")) {
          const id = `booking-${mockDbState.bookingSequence++}`;
          return { rows: [{ id }] };
        }

        if (text.includes("SELECT 1") && text.includes("FROM bus_trip_seats")) {
          return { rows: [{ "?column?": 1 }] };
        }

        if (text.includes("INSERT INTO bus_tickets")) {
          const tripId = String(params[0]);
          const seatNo = String(params[1]);
          const key = `${tripId}:${seatNo}`;

          if (mockDbState.busTickets.has(key)) {
            const error = new Error("duplicate key value violates unique constraint");
            (error as Error & { code?: string }).code = "23505";
            throw error;
          }

          mockDbState.busTickets.add(key);
          const id = `ticket-${mockDbState.ticketSequence++}`;
          return { rows: [{ id }] };
        }

        return { rows: [] };
      }),
      release: jest.fn()
    }))
  }
}));

describe("Booking E2E", () => {
  let app: INestApplication;

  beforeEach(async () => {
    mockDbState.inventoryByRoom.clear();
    mockDbState.busTickets.clear();
    mockDbState.bookingSequence = 1;
    mockDbState.ticketSequence = 1;
    activeLocks.clear();
    mockDbState.inventoryByRoom.set("room-a", [2, 2, 2]);
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("holds a property booking when inventory is available", async () => {
    const response = await request(app.getHttpServer())
      .post("/v1/bookings/properties/hold")
      .send({
        userId: "user-1",
        roomId: "room-a",
        checkIn: "2026-03-01",
        checkOut: "2026-03-04",
        roomsRequested: 1
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("pending_payment");
    expect(response.body.bookingId).toMatch(/^booking-/);
    expect(mockDbState.inventoryByRoom.get("room-a")).toEqual([1, 1, 1]);
  });

  it("rejects property hold when inventory is insufficient", async () => {
    const response = await request(app.getHttpServer())
      .post("/v1/bookings/properties/hold")
      .send({
        userId: "user-1",
        roomId: "room-a",
        checkIn: "2026-03-01",
        checkOut: "2026-03-04",
        roomsRequested: 3
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  it("prevents bus seat double-booking for the same trip and seat", async () => {
    const first = await request(app.getHttpServer()).post("/v1/bookings/bus/seat-hold").send({
      userId: "user-1",
      tripId: "trip-1",
      seatNo: "A1"
    });

    const second = await request(app.getHttpServer()).post("/v1/bookings/bus/seat-hold").send({
      userId: "user-2",
      tripId: "trip-1",
      seatNo: "A1"
    });

    expect(first.status).toBe(201);
    expect(first.body.status).toBe("reserved");
    expect(second.status).toBe(500);
  });

  it("enforces lock behavior during concurrent property hold attempts", async () => {
    const [first, second] = await Promise.all([
      request(app.getHttpServer()).post("/v1/bookings/properties/hold").send({
        userId: "user-1",
        roomId: "room-a",
        checkIn: "2026-03-01",
        checkOut: "2026-03-04",
        roomsRequested: 1
      }),
      request(app.getHttpServer()).post("/v1/bookings/properties/hold").send({
        userId: "user-2",
        roomId: "room-a",
        checkIn: "2026-03-01",
        checkOut: "2026-03-04",
        roomsRequested: 1
      })
    ]);

    const statuses = [first.status, second.status].sort();
    expect(statuses).toEqual([201, 500]);
  });
});
