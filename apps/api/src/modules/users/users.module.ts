import { Controller, Get, Module, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Controller("users")
class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile() {
    return { id: "placeholder-user-id", locale: "en", currency: "ETB" };
  }
}

@Module({
  controllers: [UsersController]
})
export class UsersModule {}
