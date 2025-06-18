import { useEffect, useRef, useState } from "react";
import { Bell, Settings, Search, Menu, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Link, useLocation } from "wouter";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";

interface HeaderProps {
  toggleSidebar: () => void;
}
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  bio: string;
  timezone: string;
  is_active: boolean;
  roles: string[];
  allowedRoutes: string[];
  avatarImage: string;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef(null);
  const [user, setUser] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    phone: '',
    bio: '',
    timezone: '',
    is_active: false,
    roles: [],
    allowedRoutes: [],
    avatarURL: ''
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

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
  const getTimeAgo = (dateString: string) => {
      // Expecting format: "16/06/2025, 13:01:07"
      const [datePart, timePart] = dateString.split(",").map(s => s.trim()); // "16/06/2025", "13:01:07"
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
  
      const date = new Date(year, month - 1, day, hours, minutes, seconds); // month is 0-indexed
  
      return formatDistanceToNow(date, { addSuffix: true });
  };
  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include", // important to send cookies
      });
      const data = await response.json();
      setUser(data?.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };
  useEffect(() => {

  fetchUser();
}, []);
  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 15 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30,000ms = 30s

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    fetchNotifications();
  }, []); // Fetching Notifications List

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* <div className="relative max-w-md ml-4 md:ml-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              className="pl-10 w-full lg:w-[300px]"
              placeholder="Search..."
              type="search"
            />
          </div> */}
        </div>

        <div className="flex items-center gap-4 relative">
                <div className="relative" ref={notifRef}>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-gray-900"
          onClick={() => {
            setIsOpen(!isOpen);
            fetchNotifications();
          } 
        }
        >
          <Bell className="h-5 w-5" />
          {notifications?.some(n => !n.isRead) && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <Link href="/notifications">
                    <li key={notification.id} className="px-4 py-3 mb-2 hover:bg-gray-50 cursor-pointer">
                      <p className="mb-2 text-sm font-medium text-gray-800 flex justify-between"><span>
                        {notification?.heading}
                        </span>
                      <Badge variant="outline" className="bg-primary text-white">New</Badge>
                        </p>
                      <p className="text-sm text-gray-600">{notification?.notification}</p>
                      <p className="text-xs text-gray-400">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
        <div ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center focus:outline-none"
            >
              <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatarURL ? user?.avatarURL : "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"}
                alt={`${user?.firstName || "User"} profile picture`}
              />
              <AvatarFallback>{user?.firstName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <div className="ml-2 text-left">
              <span className="block text-sm font-medium text-gray-900">{user?.firstName || "..."}</span>
              <span className="block text-xs text-gray-500">{Array.isArray(user?.roles) ? user.roles.join(", ") : user?.roles}</span>
            </div>

            <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {/* <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a> */}
                  <button
                    onClick={() => { logout().then(() => navigate("/login")); }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
