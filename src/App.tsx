import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Cars from "@/pages/Cars";
import Bookings from "@/pages/Bookings";
import Locations from "@/pages/Locations";
import Payments from "@/pages/Payments";
import Services from "@/pages/Services";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { isAuthenticated } from "./utils/auth";
import Reviews from "./pages/Reviews";
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthProvider } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";


function AppRoutes() {
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user && location !== "/login") {
        navigate("/login");
      } else if (user && location === "/login") {
        navigate("/");
      }
    }
  }, [user, loading, location]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  if (!user && location === "/login") return <Login />;


  // Otherwise, render the dashboard with MainLayout
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cars" component={Cars} />
        <Route path="/reviews" component={Reviews}/>
        <Route path="/bookings" component={Bookings} />
        <Route path="/locations" component={Locations} />
        <Route path="/payments" component={Payments} />
        <Route path="/services" component={Services} />
        <Route path="/reports" component={Reports} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
