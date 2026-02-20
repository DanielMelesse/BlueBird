import { Controller, Get, Module, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";

@Controller("vendor")
@UseGuards(JwtAuthGuard, RolesGuard)
class VendorController {
  @Get("dashboard")
  @Roles("hotel_owner", "tour_operator", "car_rental_provider", "bus_operator")
  dashboard() {
    return {
      bookingsToday: 0,
      revenueTodayETB: 0,
      pendingApprovals: 0
    };
  }
}

@Module({
  controllers: [VendorController]
})
export class VendorModule {}
