import { Link, useLocation } from "wouter";
import {
  FaTachometerAlt,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBell,
  FaChartBar,
  FaCog,
  FaTools,
  FaArchive,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth, hasAccess } from "../../context/auth-context";


interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar-background text-sidebar-foreground shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <SidebarContent location={location} closeSidebar={closeSidebar} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-sidebar-background text-sidebar-foreground shadow-lg">
        <SidebarContent location={location} closeSidebar={() => {}} />
      </div>
    </>
  );
};

interface SidebarContentProps {
  location: string;
  closeSidebar: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  location,
  closeSidebar,
}) => {
  const menuItems = [
    {
      icon: <FaTachometerAlt className="h-5 w-5" />,
      label: "Dashboard",
      href: "/",
    },
    { icon: <FaCar className="h-5 w-5" />, label: "Car Fleet", href: "/cars" },
    {
      icon: <FaCalendarAlt className="h-5 w-5" />,
      label: "Bookings",
      href: "/bookings",
    },
    {
      icon: <FaMapMarkerAlt className="h-5 w-5" />,
      label: "Locations",
      href: "/locations",
    },
    {
      icon: <FaCreditCard className="h-5 w-5" />,
      label: "Payments",
      href: "/payments",
    },
    {
      icon: <FaTools className="h-5 w-5" />,
      label: "Services",
      href: "/services",
    },
    {
      icon: <FaArchive className="h-5 w-5" />,
      label: "Reviews",
      href: "/reviews",
    },
    {
      icon: <FaBell className="h-5 w-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <FaChartBar className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <FaCog className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];
  const { user, loading } = useAuth();
   if (loading) return <div className="flex justify-center items-center mt-6">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>;
  return (
    <>
      <div className="flex items-center justify-center h-20 border-b border-sidebar-border px-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <FaCar className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-heading font-bold text-sidebar-foreground">
            BADU
          </h1>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide">
        <nav className="flex-1 px-3 py-5 space-y-1.5">
          {menuItems
          .filter((item) => hasAccess(user, item.href)) // Only keep allowed routes
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-lg group transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {item.icon}
                </span>
                <span className={isActive ? "font-medium" : ""}>{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-lg"></div>
                )}
              </Link>
            );
          })}

        </nav>
        {/* <div className="p-4">
          <div className="bg-sidebar-accent/10 rounded-lg p-4 border border-sidebar-border">
            <div className="flex items-center mb-3">
              <FaUserCircle className="h-8 w-8 text-primary mr-2" />
              <div>
                <p className="text-sm text-sidebar-foreground font-medium">
                  Admin Account
                </p>
                <p className="text-xs text-sidebar-foreground/70">Premium</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-sidebar-foreground/70">
                Storage: 230 GB / 500 GB
              </span>
              <span className="text-xs text-sidebar-foreground/70">46%</span>
            </div>
            <div className="w-full h-1.5 bg-sidebar-accent/20 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: "46%" }}
              ></div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;
