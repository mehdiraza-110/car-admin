import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { bookings } from "@/lib/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "wouter";

interface BookingListProps {
  limit?: number;
  showViewAll?: boolean;
  showManageButton?: boolean;
}

type BookingStatus = "confirmed" | "pending" | "active" | "completed" | "cancelled";

interface Booking {
  id: number;
  customer: {
    name: string;
    image?: string | null;
  };
  car: string;
  duration: string;
  date: string;
  status: BookingStatus;
  isNew: boolean;
}

const BookingList: React.FC<BookingListProps> = ({ 
  limit, 
  showViewAll = true, 
  showManageButton = true 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const displayBookings = limit ? bookings.slice(0, limit) : bookings;

  const statusBadge = (status: BookingStatus) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    };

    return (
      <span className={cn(
        "px-2.5 py-1 text-xs font-semibold rounded-full",
        styles[status]
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const fetchBookings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/getDashboardBookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-0 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          {showViewAll && (
           <Link href="/bookings" passHref>
            <Button variant="link" asChild className="text-primary hover:text-primary-800 text-sm font-medium">
              <span>View All</span>
            </Button>
          </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {displayBookings.map((booking) => (
            <div key={booking.id} className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-start">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={booking.customer.image} 
                    alt={`${booking.customer.name} photo`} 
                  />
                  <AvatarFallback>
                    {booking.customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{booking.customer.name}</p>
                    {booking.isNew && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {booking.car} • {booking.duration} • {booking.date}
                  </p>
                </div>
              </div>
              {statusBadge(booking.status)}
            </div>
          ))}
        </div>
        {showManageButton && (
          <div className="p-6">
            <Link href="/bookings">
              <Button variant="outline" asChild className="w-full">
                <span>Manage All Bookings</span>
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingList;
