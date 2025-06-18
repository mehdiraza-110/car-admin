import { FaCar, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaChartBar, FaStar, FaPlus } from "react-icons/fa";
import StatCard from "@/components/dashboard/StatCard";
import BookingActivityChart from "@/components/dashboard/BookingActivityChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CarTable from "@/components/car/CarTable";
import BookingList from "@/components/booking/BookingList";
import LocationMap from "@/components/location/LocationMap";
import ServiceCard from "@/components/service/ServiceCard";
import { services } from "@/lib/data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [extraServices, setExtraServices] = useState(services);
  const [tabData, setTabData] = useState<any>();
  const handleServiceToggle = (id: number, enabled: boolean) => {
    setExtraServices(services.map(service => 
      service.id === id ? { ...service, enabled } : service
    ));
  };

  async function fetchDashboardSummary() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getDashTabs`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();

    // Destructure the result
    const {
      totalCars,
      pendingBookings,
      thisMonthRevenue,
      averageRating
    } = data;
    setTabData(data.data[0]);

    console.log('Dashboard Summary:', data.data[0]);

    // You can now use this data in your state/UI
    return data;

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return null;
  }
}

useEffect(() => {
  fetchDashboardSummary();
}, []);


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, here's what's happening with your fleet today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Cars"
          value={tabData?.totalCars}
          icon={<FaCar className="h-5 w-5" />}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          trend={{ value: "12%", direction: "up", timeframe: "from last month" }}
        />
        <StatCard 
          title="Active Bookings"
          value={tabData?.pendingBookings}
          icon={<FaCalendarAlt className="h-5 w-5" />}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100"
          trend={{ value: "8%", direction: "up", timeframe: "from last week" }}
        />
        <StatCard 
          title="Monthly Revenue"
          value={`$${tabData?.thisMonthRevenue}`}
          icon={<FaChartBar className="h-5 w-5" />}
          iconColor="text-indigo-500"
          iconBgColor="bg-indigo-100"
          trend={{ value: "16.2%", direction: "up", timeframe: "from last month" }}
        />
        <StatCard 
          title="Customer Rating"
          value={`${tabData?.averageRating}/5`}
          icon={<FaStar className="h-5 w-5" />}
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-100"
          trend={{ value: "0.3", direction: "up", timeframe: "from last quarter" }}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <BookingActivityChart />
        </div>
        <RecentActivity />
      </div>

      {/* Booking Management and Location Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BookingList limit={4} />
        <LocationMap />
      </div>
    </div>
  );
};

export default Dashboard;
