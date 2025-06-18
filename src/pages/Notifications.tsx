import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  ExternalLink,
  Filter,
  Info,
  MailWarning,
  RefreshCw,
  Settings,
  Trash2,
  User,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import toast from "react-hot-toast";

interface Notification {
  id: number;
  notification: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  heading: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getNotifications`);
      const result = await res.json();
      setNotifications(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }
  const updateNotification = async (id:Number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateNotification/${id}`, {
        credentials: "include",
      });
      toast.success("Notification marked as read.");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to update notification", err);
      toast.error("Failed to mark as read.");
    }
  }
  const updateAllNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateAllNotification`, {
        credentials: "include",
      });
      toast.success("Notifications marked as read.");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to update notifications", err);
      toast.error("Failed to mark as read.");
    }
  }
  const deleteNotification = async (id:Number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/deleteNotification/${id}`, {
        credentials: "include",
      });
      toast.success("Notification deleted.");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
      toast.error("Failed to delete notification.");
    }
  }
  const deleteAllNotification = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/deleteAllNotification`, {
        credentials: "include",
      });
      toast.success("Notifications deleted.");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notifications", err);
      toast.error("Failed to delete notifications.");
    }
  }
  

  useEffect(() => {
    fetchNotifications();
  }, []); // Fetching Notifications List

  // const filteredNotifications = notifications?.filter((notification: Notification) => {
  //   if (activeTab === "all") return true;
  //   if (activeTab === "unread") return !notification.isRead;
  //   return notification.type === activeTab;
  // });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <MailWarning className="h-5 w-5 text-amber-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

 const getTimeAgo = (dateString: string) => {
    // Expecting format: "16/06/2025, 13:01:07"
    const [datePart, timePart] = dateString.split(",").map(s => s.trim()); // "16/06/2025", "13:01:07"
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    const date = new Date(year, month - 1, day, hours, minutes, seconds); // month is 0-indexed

    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Mock notifications for development
  // const mockNotifications: Notification[] = [
  //   {
  //     id: 1,
  //     title: "New booking request",
  //     message: "John Doe requested to book Toyota Camry for 23-25 May",
  //     type: "info",
  //     isRead: false,
  //     createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  //   },
  //   {
  //     id: 2,
  //     title: "Payment successful",
  //     message: "Payment of $350 for booking #12345 has been received",
  //     type: "success",
  //     isRead: false,
  //     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  //   },
  //   {
  //     id: 3,
  //     title: "Vehicle maintenance due",
  //     message: "Toyota Camry (ABC-123) is due for maintenance in 3 days",
  //     type: "warning",
  //     isRead: true,
  //     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  //   },
  //   {
  //     id: 4,
  //     title: "Booking cancellation",
  //     message: "Sarah Johnson has cancelled booking #54321",
  //     type: "error",
  //     isRead: false,
  //     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  //   },
  //   {
  //     id: 5,
  //     title: "New customer registration",
  //     message: "Mike Smith has registered as a new customer",
  //     type: "info",
  //     isRead: true,
  //     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  //   },
  // ];

  // Use mock notifications during development
  // const displayNotifications = notifications?.length ? notifications : mockNotifications as any;
  const displayNotifications = 100 == 100 ? notifications : [];
  const displayFilteredNotifications = activeTab === "all"
    ? displayNotifications
    : activeTab === "unread"
      ? displayNotifications?.filter((n: Notification) => !n.isRead)
      : displayNotifications?.filter((n: Notification) => n.type === activeTab);

  const unreadCount = displayNotifications?.filter((n: Notification) => !n.isRead).length;
  const infoCount = displayNotifications?.filter((n: Notification) => n.type === "info").length;
  const successCount = displayNotifications?.filter((n: Notification) => n.type === "success").length;
  const warningCount = displayNotifications?.filter((n: Notification) => n.type === "warning").length;
  const errorCount = displayNotifications?.filter((n: Notification) => n.type === "error").length;

  return (
    <div className="container p-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Notifications</h1>
          <p className="text-gray-600">Manage and view your notifications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchNotifications();
              toast.success("Refreshed notifications.");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={unreadCount === 0}
            onClick={updateAllNotifications}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={deleteAllNotification}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all notifications
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Filter className="h-4 w-4 mr-2" />
                Notification preferences
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle>Your notifications</CardTitle>
          <CardDescription>
            You have <span className="font-medium">{unreadCount}</span> unread notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-4">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  All
                  <Badge variant="outline" className="ml-2 bg-gray-100">{displayNotifications.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  Unread
                  <Badge variant="outline" className="ml-2 bg-gray-100">{unreadCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  Info
                  <Badge variant="outline" className="ml-2 bg-gray-100">{infoCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="success" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  Success
                  <Badge variant="outline" className="ml-2 bg-gray-100">{successCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="warning" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  Warnings
                  <Badge variant="outline" className="ml-2 bg-gray-100">{warningCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="error" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full">
                  Errors
                  <Badge variant="outline" className="ml-2 bg-gray-100">{errorCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[500px]">
              {displayFilteredNotifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-gray-500">
                    You don't have any {activeTab !== "all" ? activeTab : ""} notifications yet
                  </p>
                </div>
              ) : (
                <div>
                  {displayFilteredNotifications?.map((notification: Notification) => (
                    <div key={notification.id} className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-gray-50' : ''}`}>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-medium ${!notification.isRead ? 'text-black' : 'text-gray-700'}`}>
                              {notification?.heading}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <Badge variant="outline" className="bg-primary text-white">New</Badge>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification?.notification}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 hover:bg-red-500"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-xs">Delete</span>
                            </Button>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => updateNotification(notification.id)}
                              >
                                <Check className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-xs">Mark as read</span>
                              </Button>
                            )}
                            {/* <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ExternalLink className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-xs">View details</span>
                            </Button> */}
                          </div>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}