import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { VendorModule } from "./modules/vendor/vendor.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AccommodationModule } from "./modules/accommodation/accommodation.module";
import { ToursModule } from "./modules/tours/tours.module";
import { CarsModule } from "./modules/cars/cars.module";
import { BusModule } from "./modules/bus/bus.module";
import { SearchModule } from "./modules/search/search.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { BookingModule } from "./modules/booking/booking.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    VendorModule,
    AdminModule,
    AccommodationModule,
    ToursModule,
    CarsModule,
    BusModule,
    SearchModule,
    PricingModule,
    AvailabilityModule,
    BookingModule,
    PaymentModule,
    ReviewsModule,
    NotificationsModule
  ]
})
export class AppModule {}
