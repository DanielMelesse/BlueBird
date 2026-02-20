import { Body, Controller, Module, Post } from "@nestjs/common";

@Controller("notifications")
class NotificationsController {
  @Post("send")
  send(@Body() payload: { channel: "sms" | "email"; to: string; template: string; locale: "en" | "am" }) {
    return {
      accepted: true,
      queue: "notifications",
      payload
    };
  }
}

@Module({
  controllers: [NotificationsController]
})
export class NotificationsModule {}
