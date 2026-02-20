import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("cars")
class CarsController {
  @Get("search")
  searchCars(@Query() query: Record<string, string>) {
    return { service: "car", filters: query, results: [] };
  }

  @Get(":id/availability")
  getCarAvailability(@Param("id") id: string, @Query() query: Record<string, string>) {
    return { id, requested: query, available: true };
  }

  @Post()
  createCar(@Body() payload: Record<string, unknown>) {
    return { message: "Car created", payload };
  }
}

@Module({
  controllers: [CarsController]
})
export class CarsModule {}
