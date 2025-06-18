import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// Car Types
export type CarCategory = "Sedan" | "SUV" | "Sports" | "Electric";
export type CarStatus = "Available" | "Booked" | "Maintenance";

export interface Car {
  id: number;
  name: string;
  license: string;
  category: string;
  status: CarStatus;
  pricePerDay: number;
  rating: number;
  image: string;
}

// Booking Types
export type BookingStatus = "confirmed" | "pending" | "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface Customer {
  name: string;
  image: string;
}

export interface BookingInfo {
  id: number;
  customer: Customer;
  car: string;
  duration: string;
  date: string;
  status: BookingStatus;
  isNew: boolean;
  paymentStatus: PaymentStatus;
}

// Service Types
export interface ExtraService {
  id: number;
  name: string;
  description: string;
  price: string;
  enabled: boolean;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  is_active?: boolean;
  amount: number;
  short_bio?: string;
}

// Dashboard Types
export interface TrendData {
  value: string;
  direction: 'up' | 'down';
  timeframe: string;
}
