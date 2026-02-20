import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("tours")
class ToursController {
  @Post()
  createTour(@Body() payload: Record<string, unknown>) {
    return { message: "Tour package created", payload };
  }

  @Get("search")
  searchTours(@Query() query: Record<string, string>) {
    return { service: "tour", filters: query, results: [] };
  }

  @Get(":id")
  getTour(@Param("id") id: string) {
    return { id, kind: "fixed_date", days: 3 };
  }

  @Post(":id/custom-requests")
  requestCustomTour(@Param("id") tourId: string, @Body() payload: Record<string, unknown>) {
    return { tourId, customRequest: payload, status: "submitted" };
  }
}

@Module({
  controllers: [ToursController]
})
export class ToursModule {}
