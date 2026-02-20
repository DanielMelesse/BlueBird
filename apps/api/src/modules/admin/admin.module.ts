import { Controller, Get, Module, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
class AdminController {
  @Get("kpis")
  getKpis() {
    return {
      gmvMonthlyETB: 0,
      netRevenueMonthlyETB: 0,
      conversionRate: 0,
      cancellationRate: 0
    };
  }
}

@Module({
  controllers: [AdminController]
})
export class AdminModule {}
