import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("bus")
class BusController {
  @Get("routes/search")
  searchRoutes(@Query() query: Record<string, string>) {
    return { service: "bus", filters: query, routes: [] };
  }

  @Get("trips/:tripId/seats")
  getTripSeats(@Param("tripId") tripId: string) {
    return { tripId, seats: [] };
  }

  @Post("operators")
  createOperator(@Body() payload: Record<string, unknown>) {
    return { message: "Bus operator created", payload };
  }
}

@Module({
  controllers: [BusController]
})
export class BusModule {}
