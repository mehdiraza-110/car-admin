import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CarFront, CheckCircle, CalendarPlus, AlertTriangle, MessageSquare } from "lucide-react";
import { Bell, Star } from "lucide-react"; // example icons
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Activity {
  id: number;
  notification: string;
  type: string;
  createdAt: string;
}

const iconMap: Record<string, { icon: JSX.Element; color: string; bg: string }> = {
  booking: {
    icon: <CarFront className="h-5 w-5" />,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  review: {
    icon: <Star className="h-5 w-5" />,
    color: "text-yellow-600",
    bg: "bg-yellow-100"
  },
  default: {
    icon: <Bell className="h-5 w-5" />,
    color: "text-gray-500",
    bg: "bg-gray-200"
  }
};

const RecentActivity = () => {
  
  const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `Just now`;
};

 const [activities, setActivities] = useState<Activity[]>([]);
  
 useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/recentNotifications`)
      .then(res => res.json())
      .then(data => setActivities(data?.data))
      .catch(err => console.error(err));
  }, []);

  return (
     <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {Array.isArray(activities) && activities?.map((activity) => {
            const icon = iconMap[activity.type] || iconMap.default;
            return (
              <div key={activity.id} className="flex items-start">
                <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center", icon.bg)}>
                  <div className={icon.color}>{icon.icon}</div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{activity.notification}</p>
                  <p className="text-xs text-gray-500">{timeAgo(activity.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="link" asChild className="w-full mt-4 text-sm text-primary hover:text-primary-800 font-medium">
          <Link href="/notifications">View All Activity</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
