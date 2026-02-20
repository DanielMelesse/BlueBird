import { Body, Controller, Get, Module, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Controller("auth")
class AuthController {
  @Post("login")
  login(@Body() payload: { email: string; password: string }) {
    return {
      accessToken: "replace-with-signed-jwt",
      refreshToken: "replace-with-rotating-refresh-token",
      user: { email: payload.email }
    };
  }

  @Post("refresh")
  refresh(@Body() payload: { refreshToken: string }) {
    return {
      accessToken: `new-token-for-${payload.refreshToken.slice(0, 8)}`
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me() {
    return { message: "Authenticated profile endpoint" };
  }
}

@Module({
  controllers: [AuthController]
})
export class AuthModule {}
