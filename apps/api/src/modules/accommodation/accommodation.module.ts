import { Body, Controller, Get, Module, Param, Post, Query } from "@nestjs/common";

@Controller("properties")
class AccommodationController {
  @Post()
  createProperty(@Body() payload: Record<string, unknown>) {
    return { message: "Property created", payload };
  }

  @Get("search")
  searchProperties(@Query() query: Record<string, string>) {
    return { service: "property", filters: query, results: [] };
  }

  @Get(":id")
  getProperty(@Param("id") id: string) {
    return { id, type: "hotel", name: "Placeholder Property" };
  }

  @Post(":id/rooms")
  createRoom(@Param("id") propertyId: string, @Body() payload: Record<string, unknown>) {
    return { propertyId, room: payload };
  }
}

@Module({
  controllers: [AccommodationController]
})
export class AccommodationModule {}
