export type ServiceType = "property" | "tour" | "car" | "bus";

export type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "expired" | "refunded";

export interface BookingSummary {
  id: string;
  serviceType: ServiceType;
  status: BookingStatus;
  totalETB: number;
}
