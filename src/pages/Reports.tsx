import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format } from "date-fns";
import {
  CalendarRange,
  Download,
  Mail,
  Share2,
  ChevronUp,
  ChevronDown,
  Car,
  DollarSign,
  Plus,
  Users,
  BarChart as BarChartIcon,
  Loader2,
  Calendar,
  CalendarIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import DateFilter from "@/components/ui/DatePick";

const carUtilizationData = [
  { name: "Tesla Model S", utilization: 92 },
  { name: "BMW M4", utilization: 85 },
  { name: "Range Rover", utilization: 78 },
  { name: "Porsche 911", utilization: 95 },
  { name: "Mercedes E-Class", utilization: 82 }
];

const vehicleTypeData = [
  { name: "Sedan", value: 35 },
  { name: "SUV", value: 25 },
  { name: "Sports", value: 20 },
  { name: "Electric", value: 15 },
  { name: "Luxury", value: 5 }
];

const locationData = [
  { name: "Downtown", pickups: 45, returns: 40 },
  { name: "Airport", pickups: 65, returns: 60 },
  { name: "Hotel Zone", pickups: 25, returns: 28 },
  { name: "Mall", pickups: 15, returns: 17 },
  { name: "Suburbs", pickups: 10, returns: 10 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Reports = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [tabData, setTabData] = useState<any>({});
  const [revenueDetails, setRevenueDetails] = useState<any>({});
  const [bookDetails, setBookDetails] = useState<any>({});
  const [revenueData, setRevenueData] = useState<any>({});
  const [vehicleType, setVehicleType] = useState<any[]>([]);
  const [vehicleUtilization, setVehicleUtilization] = useState<any[]>([]);
  const [utilData, setUtilData] = useState<any>({});
  const [locationStats, setLocationStats] = useState<any>({});
  const [revenuByModelLoading, setRevenueByModelLoading] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState('revenue');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);


  const fetchTabData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getTabData`);
      const result = await res.json();
      setTabData(result?.data[0]);
    } catch (err) {
      console.error("Failed to fetch tabs data", err);
    }
  }
  const fetchVehicleType = async () => {
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getVehicleTypeBreakdown`);
      const result = await res.json();
      const vehicleTypeData = result?.data?.map(item => ({
        name: item.category_name,
        value: parseFloat(item.percentage)
      }));
      setVehicleType(vehicleTypeData);
      console.log(result?.data)
    } catch (err) {
      console.error("Failed to fetch vehicles data", err);
    }
  }
  const fetchVehicleUtilization = async (fromDate?: Date, toDate?: Date) => {
    try {
       const query = new URLSearchParams();

      if (fromDate) query.append("from", fromDate.toLocaleString('en-US'));
      if (toDate) query.append("to", toDate.toLocaleString('en-US'));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/getVehicleUtilization?${query}`);
      const result = await res.json();
      const vehicleUtilData = result?.data?.top5UtilizedVehicles?.map(item => ({
        name: item.model,
        utilization: parseFloat(item.utilization_percentage)
      }));
      setVehicleUtilization(vehicleUtilData);
      setUtilData(result?.data);
    } catch (err) {
      console.error("Failed to fetch vehicles data", err);
    }
  }
  const fetchLocationStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getLocationStats`);
      const result = await res.json();
      const locationData = result?.data?.map(item => ({
        name: item.location_name,
        pickups: parseFloat(item.total_pickups),
        returns: parseFloat(item.total_dropoffs)
      }));
      setLocationStats(locationData);
      console.log("Location Stats: ", locationData);
    } catch (err) {
      console.error("Failed to fetch vehicles data", err);
    }
  }
  const fetchRevenueDetails = async (fromDate?: Date, toDate?: Date) => {
    try {
      const query = new URLSearchParams();

      if (fromDate) query.append("from", fromDate.toLocaleString('en-US'));
      if (toDate) query.append("to", toDate.toLocaleString('en-US'));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/getMonthlyRevenueDetails?${query}`);
      const result = await res.json();
      const revData = result?.data.map(row => ({
        name: formatMonth(row.month),
        revenue: parseFloat(row.monthly_revenue),
      }));
      const bookData = result?.data.map(row => ({
        name: formatMonth(row.month),
        bookings: parseInt(row.bookings_count, 10),
      }));
      setRevenueDetails(revData);
      setBookDetails(bookData);
      setRevenueData(result?.data[0]);
    } catch (err) {
      console.error("Failed to fetch revenue data", err);
    }
  };


  const formatMonth = (monthStr) => {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleString('default', { month: 'short' }); // e.g. "Jun"
  };
  useEffect(() => {
    fetchTabData();
    fetchRevenueDetails();
    fetchVehicleType();
    fetchVehicleUtilization();
    fetchLocationStats();
  }, []); // Fetching chart data on load

  // PDF Generation

  const handleDownloadAndOpenRevenuePDF = async () => {
    try {
      const query = new URLSearchParams();

      const formatDate = (date) =>
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      let fDate = ``;
      let tDate = ``;
      if (fromDate) {
        fDate = formatDate(fromDate);
        query.append("from", fDate);
      }
      if (toDate) {
        tDate = formatDate(toDate);
        query.append("to", tDate);
      }

      console.log("REVENUE PDF: ", fDate, tDate);
      setRevenueByModelLoading(true); // indicate loading for report

      const res = await fetch(`${import.meta.env.VITE_API_URL}/getRevenueByCarModel?${query}`);
      const json = await res.json();
      const rows = json.data; // expecting [{ model, total_revenue }, ...]
      if (!rows || rows.length === 0) {
        toast.error("No revenue data found!");
        throw new Error("No data");
      }

      // Build HTML table rows
      const tableRows = rows
        .map(
          (r: { car_model: string; total_revenue: number }) => `
        <tr>
          <td>${r.car_model}</td>
          <td style="text-align: right;">$${r.total_revenue}</td>
        </tr>`
        )
        .join("");

      const container = document.createElement("div");
      container.id = "temp-pdf-container";
      container.style.position = "relative";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.border = "1px solid #ddd";
      container.innerHTML = `
        <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>BADU Car Rentals - Revenue Report</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{line-height:1.6;color:#333;background:#fff;}
          .container{max-width:800px;margin:0 auto;padding:20px;}
          .invoice-card{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);}
          .header{background:linear-gradient(135deg,#f97316,#ea580c);color:white;padding:30px;}
          .header-content{display:flex;justify-content:space-between;align-items:flex-start;}
          .company-info h1{font-size:2.5rem;font-weight:bold;margin-bottom:5px;}
          .company-info .tagline{font-size:1.2rem;margin-bottom:15px;opacity:0.9;}
          .content{padding:40px;}
          .section-title{font-size:1.2rem;font-weight:600;color:#f97316;margin-bottom:15px;}
          table{width:100%;border-collapse:collapse;font-size:1rem;}
          th,td{padding:12px;border-bottom:1px solid #e5e7eb;}
          th{background:#fef3e2;color:#111827;text-align:left;}
          .total-row{font-size:1.1rem;font-weight:bold;color:#f97316;background:#fed7aa;}
          @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;} .invoice-card{box-shadow:none;border:none;}}
        </style></head>
        <body><div class="container"><div class="invoice-card">
          <div class="header"><div class="header-content">
            <div class="company-info">
              <h1>BADU</h1><p class="tagline">Car Rentals</p><p>Revenue by Model Report</p>
            </div>
          </div></div>
          <div class="content">
            <h3 class="section-title">💼 Total Revenue by Car Model</h3>
            <table>
              <thead>
                <tr><th>Model</th><th style="text-align: right;">Revenue (USD)</th></tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div></div></div>
        </body></html>`;

      document.body.appendChild(container);
      await new Promise(r => setTimeout(r, 500));

      const pdfBlobUrl = await html2pdf()
        .from(container)
        .set({
          filename: "revenue-by-model.pdf",
          jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
          html2canvas: { scale: 3 },
          margin: 2
        })
        .outputPdf("bloburl");

      window.open(pdfBlobUrl, "_blank");
      container.remove();
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate revenue PDF");
    } finally {
      setRevenueByModelLoading(false);
    }
  };

  const handleBookingAnalysisPDF = async () => {
  try {
    setBookingLoading(true); // Now used for booking report too
    const query = new URLSearchParams();

      const formatDate = (date) =>
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      let fDate = ``;
      let tDate = ``;
      if (fromDate) {
        fDate = formatDate(fromDate);
        query.append("from", fDate);
      }
      if (toDate) {
        tDate = formatDate(toDate);
        query.append("to", tDate);
      }

      console.log("REVENUE PDF: ", fDate, tDate);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/getBookingsAnalysis?${query}`);
    const json = await res.json();
    const rows = json.data; // expecting full bookings report

    if (!rows || rows.length === 0) {
      toast.error("No booking data found!");
      throw new Error("No data");
    }

    const tableRows = rows
      .map(
        (r: {
          booking_id: number;
          pickUpDate: string;
          dropOffDate: string;
          pickup_location: string;
          dropoff_location: string;
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          vehicle_model: string;
          vehicle_year: number;
          vehicle_category: string;
          bookingStatus: string;
          paymentStatus: string;
          total_Price: number;
          booking_Date: string;
        }) => `
      <tr>
        <td>${r.booking_id}</td>
        <td>${r.firstName} ${r.lastName}</td>
        <td>${r.email}</td>
        <td>${r.phone}</td>
        <td>${r.vehicle_model} (${r.vehicle_year}) - ${r.vehicle_category}</td>
        <td>${r.pickUpDate}</td>
        <td>${r.dropOffDate}</td>
        <td>${r.pickup_location}</td>
        <td>${r.dropoff_location}</td>
        <td>${r.bookingStatus}</td>
        <td>${r.paymentStatus}</td>
        <td style="text-align: right;">$${r.total_Price}</td>
        <td>${r.booking_Date}</td>
      </tr>`
      )
      .join("");

    const container = document.createElement("div");
    container.id = "temp-pdf-container";
    container.style.position = "relative";
    container.style.fontFamily = "Arial, sans-serif";
    container.innerHTML = `
      <!DOCTYPE html>
      <html lang="en"><head><meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BADU Car Rentals - Bookings Report</title>
      <style>
        body { line-height:1.4; color:#333; background:#fff; }
        .container {  margin: 0 auto; padding: 0px; font-size: 12px; }
        .invoice-card { border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; }
        .header h1 { margin-bottom: 5px; font-size: 24px; }
        .content { padding: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #f97316; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #fef3e2; text-align: left; }
        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="invoice-card">
            <div class="header">
              <h1>BADU Car Rentals</h1>
              <p>📋 Full Bookings Report</p>
            </div>
            <div class="content">
              <div class="section-title">Booking Summary</div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Vehicle</th>
                    <th>Pick-Up</th>
                    <th>Drop-Off</th>
                    <th>Pick-Up Location</th>
                    <th>Drop-Off Location</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total ($)</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    document.body.appendChild(container);
    await new Promise((r) => setTimeout(r, 500));

    const pdfBlobUrl = await html2pdf()
      .from(container)
      .set({
        filename: "bookings-report.pdf",
        jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
        html2canvas: { scale: 2 },
        margin: 10,
      })
      .outputPdf("bloburl");

    window.open(pdfBlobUrl, "_blank");
    container.remove();
  } catch (err) {
    console.error("PDF generation error:", err);
    toast.error("Failed to generate bookings PDF");
  } finally {
    setBookingLoading(false);
  }
  };

  const handlePaymentAnalysisPDF = async () => {
      try {
      setPaymentLoading(true);

      const query = new URLSearchParams();

      const formatDate = (date) =>
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      let fDate = ``;
      let tDate = ``;
      if (fromDate) {
        fDate = formatDate(fromDate);
        query.append("from", fDate);
      }
      if (toDate) {
        tDate = formatDate(toDate);
        query.append("to", tDate);
      }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/getPaymentAnalysis?${query}`);
        const json = await res.json();
        const rows = json.data;

        if (!rows || rows.length === 0) {
          toast.error("No payment data found!");
          throw new Error("No data");
        }

        const tableRows = rows
          .map(
            (r: {
              booking_id: number;
              pickUpDate: string;
              dropOffDate: string;
              pickup_location: string;
              dropoff_location: string;
              customer_name: string;
              vehicle_model: string;
              vehicle_year: number;
              vehicle_category: string;
              bookingStatus: string;
              paymentStatus: string;
              total_Price: number;
              booking_Date: string;
              Daily_Rate: number;
              Extra_Services: number;
              security_Deposit: number;
            }) => `
          <tr>
            <td>${r.booking_id}</td>
            <td>${r.customer_name}</td>
            <td>${r.vehicle_model} (${r.vehicle_year}) - ${r.vehicle_category}</td>
            <td>${r.pickup_location}</td>
            <td>${r.dropoff_location}</td>
            <td>${r.bookingStatus}</td>
            <td>${r.paymentStatus}</td>
            <td>$${r.Daily_Rate}</td>
            <td>$${r.Extra_Services}</td>
            <td>$${r.security_Deposit}</td>
            <td style="text-align: right; font-weight: bold;">$${r.total_Price}</td>
            <td>${r.booking_Date}</td>
          </tr>`
          )
          .join("");

        const container = document.createElement("div");
        container.id = "temp-pdf-container";
        container.style.position = "relative";
        container.style.fontFamily = "Arial, sans-serif";
        container.innerHTML = `
          <!DOCTYPE html>
          <html lang="en"><head><meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BADU Car Rentals - Bookings Report</title>
          <style>
            body { line-height:1.4; color:#333; background:#fff; }
            .container { margin: 0 auto; padding: 0px; font-size: 11px; }
            .invoice-card { border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; }
            .header h1 { margin-bottom: 5px; font-size: 24px; }
            .content { padding: 20px; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #f97316; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; }
            th { background: #fef3e2; text-align: left; font-weight: bold; }
            td { vertical-align: top; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
          </head>
          <body>
            <div class="container">
              <div class="invoice-card">
                <div class="header">
                  <h1>BADU Car Rentals</h1>
                  <p>📋 Payments Analysis</p>
                </div>
                <div class="content">
                  <div class="section-title">Booking Summary</div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Pick-Up Location</th>
                        <th>Drop-Off Location</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Daily Rate</th>
                        <th>Extra Services</th>
                        <th>Deposit</th>
                        <th>Total ($)</th>
                        <th>Booked On</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        document.body.appendChild(container);
        await new Promise((r) => setTimeout(r, 500));

        const pdfBlobUrl = await html2pdf()
          .from(container)
          .set({
            filename: "bookings-report.pdf",
            jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
            html2canvas: { scale: 2 },
            margin: 10,
          })
          .outputPdf("bloburl");

        window.open(pdfBlobUrl, "_blank");
        container.remove();
      } catch (err) {
        console.error("PDF generation error:", err);
        toast.error("Failed to generate bookings PDF");
      } finally {
        setPaymentLoading(false);
      }
  };

  // Export to CSV

  const exportRevenueChartToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const csvHeader = Object.keys(data[0]).join(',') + '\n';
    const csvRows = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportVehicleTypeToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const csvHeader = Object.keys(data[0]).join(',') + '\n';
    const csvRows = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportVehicleUtilizationToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const csvHeader = Object.keys(data[0]).join(',') + '\n';
    const csvRows = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportLocationStatsToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const csvHeader = Object.keys(data[0]).join(',') + '\n';
    const csvRows = data.map(row =>
      Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllDataToCSV = async () => {
    try {
      // Fetch all data in parallel
      const [
        tabRes,
        vehicleTypeRes,
        vehicleUtilRes,
        locationRes,
        revenueRes
      ] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/getTabData`),
        fetch(`${import.meta.env.VITE_API_URL}/getVehicleTypeBreakdown`),
        fetch(`${import.meta.env.VITE_API_URL}/getVehicleUtilization`),
        fetch(`${import.meta.env.VITE_API_URL}/getLocationStats`),
        fetch(`${import.meta.env.VITE_API_URL}/getMonthlyRevenueDetails`),
      ]);

      const tabData = await tabRes.json();
      const vehicleTypeData = await vehicleTypeRes.json();
      const vehicleUtilData = await vehicleUtilRes.json();
      const locationStats = await locationRes.json();
      const revenueDetails = await revenueRes.json();

      // Format sections
      let csvContent = '';

      // Tab Data
      csvContent += '--- Tab Data ---\n';
      if (tabData?.data?.length > 0) {
        const tab = tabData.data[0];
        csvContent += Object.keys(tab).join(',') + '\n';
        csvContent += Object.values(tab).join(',') + '\n';
      }
      csvContent += '\n';

      // Vehicle Type Breakdown
      csvContent += '--- Vehicle Type Breakdown ---\n';
      const vehicleTypes = vehicleTypeData?.data || [];
      if (vehicleTypes.length > 0) {
        csvContent += Object.keys(vehicleTypes[0]).join(',') + '\n';
        csvContent += vehicleTypes.map(item => Object.values(item).join(',')).join('\n') + '\n\n';
      }

      // Vehicle Utilization
      csvContent += '--- Vehicle Utilization ---\n';
      const topVehicles = vehicleUtilData?.data?.top5UtilizedVehicles || [];
      if (topVehicles.length > 0) {
        csvContent += Object.keys(topVehicles[0]).join(',') + '\n';
        csvContent += topVehicles.map(item => Object.values(item).join(',')).join('\n') + '\n\n';
      }

      // Location Stats
      csvContent += '--- Location Stats ---\n';
      const locationData = locationStats?.data || [];
      if (locationData.length > 0) {
        csvContent += Object.keys(locationData[0]).join(',') + '\n';
        csvContent += locationData.map(item => Object.values(item).join(',')).join('\n') + '\n\n';
      }

      // Revenue & Bookings
      csvContent += '--- Revenue & Bookings ---\n';
      const revenueRows = revenueDetails?.data || [];
      if (revenueRows.length > 0) {
        csvContent += Object.keys(revenueRows[0]).join(',') + '\n';
        csvContent += revenueRows.map(row => Object.values(row).join(',')).join('\n') + '\n\n';
      }

      // Create Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_data_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Failed to export data", err);
    }
  };


  
  return (
    <div>
      <div className="flex justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">View detailed statistics and analysis of your car rental business.</p>
        </div>
        <div className="flex gap-2">
          {/* <Select defaultValue="year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Button variant="outline">
            <CalendarRange className="mr-2 h-4 w-4" />
            Date Range
          </Button> */}
          <DateFilter onDateChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
            fetchRevenueDetails(from, to);
            fetchVehicleUtilization(from, to);
          }} />

          <Button variant="outline" onClick={exportAllDataToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">${Number(tabData?.total_revenue ? tabData?.total_revenue : 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary bg-opacity-10 rounded-md">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                <ChevronUp className="mr-1 h-3 w-3" />
                12.5%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">vs. previous year</span>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md font-medium text-gray-500">Total Bookings</p>
                <p className="text-3xl font-bold mt-1">{Number(tabData?.total_bookings ? tabData?.total_bookings : 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-secondary bg-opacity-10 rounded-md">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                <ChevronUp className="mr-1 h-3 w-3" />
                8.2%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">vs. previous year</span>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md font-medium text-gray-500">Fleet Utilization</p>
                <p className="text-3xl font-bold mt-1">{tabData?.fleet_utilization_percentage ? tabData?.fleet_utilization_percentage : 0}%</p>
              </div>
              <div className="p-2 bg-accent bg-opacity-10 rounded-md">
                <Car className="h-5 w-5 text-accent" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                <ChevronUp className="mr-1 h-3 w-3" />
                5.7%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">vs. previous year</span>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-md font-medium text-gray-500">Booking Dispute</p>
                <p className="text-3xl font-bold mt-1">{tabData?.booking_dispute_percentage ? tabData?.booking_dispute_percentage : 0}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            {/* <div className="mt-4 flex items-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                <ChevronUp className="mr-1 h-3 w-3" />
                2.1%
              </Badge>
              <span className="text-xs text-gray-500 ml-2">vs. previous year</span>
            </div> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue & Bookings Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Revenue & Bookings</CardTitle>
                <button
                  onClick={() => {
                    const isRevenueTab = selectedTab === 'revenue';
                    const dataToExport = isRevenueTab ? revenueDetails : bookDetails;
                    const filename = isRevenueTab ? 'revenue_data.csv' : 'bookings_data.csv';
                    exportRevenueChartToCSV(dataToExport, filename);
                  }}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Export CSV
                </button>
              </div>
              {/* <CardTitle className="text-lg">Revenue & Bookings</CardTitle> */}
              <Tabs defaultValue="revenue" value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue">
                    <CardContent className="pt-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueDetails} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorBookings)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="text-lg font-semibold">${Number(revenueData?.total_revenue).toLocaleString('en-US')}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Avg. Booking Value</p>
                          <p className="text-lg font-semibold">${Number(revenueData?.overall_avg_booking_value).toLocaleString('en-US')}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Revenue Growth</p>
                          <p className="text-lg font-semibold">{revenueData?.revenue_growth_percent}%</p>
                        </div>
                      </div>
                    </CardContent>
                </TabsContent>
                <TabsContent value="bookings">
                    <CardContent className="pt-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={bookDetails} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="text-lg font-semibold">${Number(revenueData?.total_revenue).toLocaleString('en-US')}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Avg. Booking Value</p>
                          <p className="text-lg font-semibold">${Number(revenueData?.overall_avg_booking_value).toLocaleString('en-US')}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500">Revenue Growth</p>
                          <p className="text-lg font-semibold">{revenueData?.revenue_growth_percent}%</p>
                        </div>
                      </div>
                    </CardContent>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* Vehicle Type Breakdown */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Vehicle Type Breakdown</CardTitle>
                <button
                  onClick={() => {
                    const dataToExport = vehicleType;
                    const filename = "vehicle_type.csv"
                    exportVehicleTypeToCSV(dataToExport, filename);
                  }}
                  className="text-[12px] px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Export CSV
                </button>
              </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleType?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {vehicleType?.map((item, index) => (
                <div key={item?.name} className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs">{item?.name}: {item?.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Vehicle Utilization */}
        <Card>
          <CardHeader className="pb-0">
             <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Vehicle Utilization</CardTitle>
              <button
                onClick={() => exportVehicleUtilizationToCSV(vehicleUtilization, 'vehicle_utilization.csv')}
                className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Export CSV
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vehicleUtilization}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Utilization']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar 
                    dataKey="utilization" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    background={{ fill: '#f3f4f6' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <div>
                <p className="text-gray-500">Average Utilization</p>
                <p className="font-semibold">{utilData?.averageUtilization}%</p>
              </div>
              <div>
                <p className="text-gray-500">Best Performer</p>
                <p className="font-semibold">{utilData?.bestPerformer?.model} ({utilData?.bestPerformer?.utilization_percentage}%)</p>
              </div>
              <div>
                <p className="text-gray-500">Needs Attention</p>
                <p className="font-semibold">{utilData?.needsAttention?.model} ({utilData?.needsAttention?.utilization_percentage ? utilData?.needsAttention?.utilization_percentage : 0}%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Statistics */}
        <Card>
          <CardHeader className="pb-0">
           <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Location Statistics</CardTitle>
            <button
              onClick={() => exportLocationStatsToCSV(locationStats, 'location_stats.csv')}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Export CSV
            </button>
          </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pickups" name="Pickups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returns" name="Returns" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Most Popular</p>
                <p className="font-semibold">{locationStats ? locationStats[0]?.name : ""} ({locationStats ? locationStats[0]?.pickups : 0} pickups)</p>
              </div>
              {/* <div>
                <p className="text-gray-500">Pickup/Return Ratio</p>
                <p className="font-semibold">1.08:1</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Reports Section */}
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Additional Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={handleDownloadAndOpenRevenuePDF}
            disabled={revenuByModelLoading} // Optional: disable during loading
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md mr-3">
                {revenuByModelLoading ? (
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <BarChartIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium">Revenue by Model Report</p>
                <p className="text-xs text-gray-500">Analyze the most profitable vehicles</p>
              </div>
            </div>
          </Button>
          
          <Button 
          onClick={handleBookingAnalysisPDF}
          disabled={bookingLoading} // Optional: disable during loading
          variant="outline" 
          className="h-auto p-4 justify-start">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md mr-3">
                {bookingLoading ? (
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <Users className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium">Bookings Analysis Report</p>
                <p className="text-xs text-gray-500">Booking preferences & Status Data</p>
              </div>
            </div>
          </Button>
          
          <Button 
          variant="outline"
          onClick={handlePaymentAnalysisPDF}
          disabled={paymentLoading}  
          className="h-auto p-4 justify-start">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-md mr-3">
                {paymentLoading ? (
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <DollarSign className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium">Payment Analysis Report</p>
                <p className="text-xs text-gray-500">Track profits and loss</p>
              </div>
            </div>
          </Button>
          
          {/* <Button variant="outline" className="h-auto p-4 justify-start">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-md mr-3">
                <BarChartIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Custom Report</p>
                <p className="text-xs text-gray-500">Create a new custom report</p>
              </div>
            </div>
          </Button> */}
        </div>
      </div>

      {/* Scheduled Reports */}
      {/* <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Scheduled Reports</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Schedule New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <BarChartIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Monthly Performance Summary</p>
                  <p className="text-xs text-gray-500">Sent on the 1st of every month</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">Active</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Weekly Booking Report</p>
                  <p className="text-xs text-gray-500">Sent every Monday at 9 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">Active</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-md mr-3">
                  <Car className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Vehicle Utilization Report</p>
                  <p className="text-xs text-gray-500">Sent every Friday at 4 PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 bg-gray-200 text-gray-700 border-gray-300">Paused</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Reports;
