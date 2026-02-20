import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export type Role =
  | "customer"
  | "hotel_owner"
  | "tour_operator"
  | "car_rental_provider"
  | "bus_operator"
  | "admin";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
