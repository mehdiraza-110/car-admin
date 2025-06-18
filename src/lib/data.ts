import { Car, BookingInfo, ExtraService } from "@/lib/types";
import { ShieldCheck, UserRound, Fuel, Wifi, Baby, Map } from "lucide-react";
import { createElement } from "react";

// Car data
export const cars: Car[] = [
  {
    id: 1,
    name: "Tesla Model S",
    license: "XYZ 789",
    category: "Electric",
    status: "Available",
    pricePerDay: 150.00,
    rating: 4.9,
    image: "https://pixabay.com/get/g8acb943eefa1184545cb3da67934baacae20fd21d7383f44b1ee38b2866428a8620c5f5e1ac61f4ee94f5136cfcbe60a9e64bd121f8c17731bed553968ba6627_1280.jpg"
  },
  {
    id: 2,
    name: "BMW M4",
    license: "ABC 123",
    category: "Sports",
    status: "Booked",
    pricePerDay: 180.00,
    rating: 4.7,
    image: "https://pixabay.com/get/g2074e8bf8550a469798f369d9c03ed3c295b30fd428187f26ae9c7eba0d252c90fa25851c33faf67208e5fed8aace63a9071d9733ae1d143440c44acc32a5b8e_1280.jpg"
  },
  {
    id: 3,
    name: "Range Rover Sport",
    license: "DEF 456",
    category: "SUV",
    status: "Maintenance",
    pricePerDay: 200.00,
    rating: 4.8,
    image: "https://pixabay.com/get/g6939a9434df956090949aca51f6c065ad4423694bbe9661151ef96d42e6df44fe4c3bbe56dd9f124bca50abe4e7a9887586a5a8e416e8a52c82a4fc628f88611_1280.jpg"
  },
  {
    id: 4,
    name: "Porsche 911",
    license: "GHI 789",
    category: "Sports",
    status: "Available",
    pricePerDay: 250.00,
    rating: 5.0,
    image: "https://pixabay.com/get/gb2ecbf5aad12ef0e87eaf1fccf0a13f6a21b02af553af4bdb683cdbd0577aa6e5aa2a72a60d53962887ff6848eddd4fa4a55cc3aa0dec5343d3e72c1dd1c5d87_1280.jpg"
  }
];

// Booking data
export const bookings: BookingInfo[] = [
  {
    id: 1,
    customer: {
      name: "James Wilson",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    car: "BMW M4",
    duration: "3 days",
    date: "May 15-18",
    status: "confirmed",
    isNew: true,
    paymentStatus: "paid"
  },
  {
    id: 2,
    customer: {
      name: "Emily Thompson",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    car: "Tesla Model S",
    duration: "7 days",
    date: "May 12-19",
    status: "pending",
    isNew: false,
    paymentStatus: "pending"
  },
  {
    id: 3,
    customer: {
      name: "Robert Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    car: "Range Rover Sport",
    duration: "5 days",
    date: "May 10-15",
    status: "active",
    isNew: false,
    paymentStatus: "paid"
  },
  {
    id: 4,
    customer: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1532170579297-281918c8ae72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    car: "Porsche 911",
    duration: "2 days",
    date: "May 8-10",
    status: "completed",
    isNew: false,
    paymentStatus: "paid"
  }
];

// Services data
export const services: ExtraService[] = [
  {
    id: 1,
    name: "Premium Insurance",
    description: "Full coverage with zero deductible",
    price: "$25/day",
    enabled: true,
    icon: null,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "Popular",
    badgeColor: "bg-green-100 text-green-800"
  },
  {
    id: 2,
    name: "Chauffeur Service",
    description: "Professional driver for your journey",
    price: "$150/day",
    enabled: false,
    icon: null,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "Premium",
    badgeColor: "bg-gray-100 text-gray-800"
  },
  {
    id: 3,
    name: "Prepaid Fuel",
    description: "Return with empty tank, no extra fees",
    price: "$45 flat",
    enabled: true,
    icon: null,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    badge: "Recommended",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  {
    id: 4,
    name: "Portable WiFi",
    description: "Unlimited high-speed internet on the go",
    price: "$10/day",
    enabled: false,
    icon: null,
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "New",
    badgeColor: "bg-gray-100 text-gray-800"
  },
  {
    id: 5,
    name: "Child Seat",
    description: "Safety-certified seats for children",
    price: "$8/day",
    enabled: false,
    icon: null,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
    badge: "Essential",
    badgeColor: "bg-gray-100 text-gray-800"
  },
  {
    id: 6,
    name: "GPS Navigation",
    description: "Premium GPS with real-time updates",
    price: "$7/day",
    enabled: true,
    icon: null,
    iconBgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    badge: "Most Booked",
    badgeColor: "bg-blue-100 text-blue-800"
  }
];
