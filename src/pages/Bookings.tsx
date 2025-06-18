import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatus, BookingInfo } from "@/lib/types";
import { bookings } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Plus, Search, Download, FileText, Pencil, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "../utils/helper";
import html2pdf from "html2pdf.js";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [bookingsList, setBookingsList] = useState<any>([]);
  const [showBookingsDialog, setShowBookingsDialog] = useState<any>(false);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [extraServices, setExtraServices] = useState<any>({});
  const [locationList, setLocationList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [carList, setCarList] = useState<any[]>([]);
  const [depositOption, setDepositOption] = useState<"deposit" | "full">(
    "deposit"
  );
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingStatusDialog, setShowBookingStatusDialog] = useState<any>(false);
  const [bookingById, setBookingById] = useState<any>({});
  const [bookingStatus, setBookingStatus] = useState<any>("");
  const [paymentStatus, setPaymentStatus] = useState<any>("");
  const [errors, setErrors] = useState<any>({});
  const [selectedServices, setSelectedServices] = useState<any>({});
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [car, setCar] = useState<any>({});
  const [bookingData, setBookingData] = useState<any>({
    pickUp: "",
    dropOff: "",
    pickUpDate: "",
    dropOffDate: "",
    selectedServices: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    is18Plus: false,
    vehicle_id: 0,
    security_Deposit: 0,
    daily_Rate: 0,
    extra_Services: 0,
    total_Price: 0,
    bookingStatus: "pending",
    paymentStatus: "pending",
    paymentMethod: 1 // 1 for cash
  });
  const [activeDeductions, setActiveDeductions] = useState<number[]>([]);
  const [price, setPrice] = useState<number>(car?.daily_rate ?? 0);
  const printRef = useRef(null);
  let totalDeductions = activeDeductions.reduce((sum, val) => sum + val, 0);
  let baseRate = car?.daily_rate ?? 0;
  let finalPrice = (baseRate + totalDeductions) + car?.security_desposit;
  let sec_Deposit = car?.security_desposit;
  useEffect(() => {
   totalDeductions = activeDeductions.reduce((sum, val) => sum + val, 0);
   baseRate = car?.daily_rate ?? 0;
   sec_Deposit = car?.security_desposit ?? 0;
   finalPrice = baseRate + totalDeductions + sec_Deposit;

    setBookingData(prev => ({
      ...prev,
      security_Deposit: sec_Deposit,
      daily_Rate: baseRate,
      extra_Services: totalDeductions,
      total_Price: finalPrice
    }));
    fetchServices(car?.id);
  }, [activeDeductions, car]);

  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      vehicle_id: car?.id
    }));
  }, [car])

  const fileInputRef = useRef<any>();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleClick = () => {
    fileInputRef.current.click();
  };
const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newErrors = {};

    const imageFiles = files.filter(file =>
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file?.type)
    );
    const pdfFiles = files.filter(file => file?.type === 'application/pdf');

    if (pdfFiles.length > 0 && imageFiles.length > 0) {
      newErrors.files = "You cannot upload both images and a PDF.";
    } else if (pdfFiles.length > 1) {
      newErrors.files = "Only one PDF is allowed.";
    } else if (imageFiles.length === 1) {
      newErrors.files = "Please upload both front and back images (2 required).";
    } else if (imageFiles.length > 2) {
      newErrors.files = "Only two images are allowed.";
    } else if (pdfFiles.length === 1 || imageFiles.length === 2) {
      setErrors({});
      setSelectedFiles(files);
      return;
    } else {
      newErrors.files = "Unsupported file format or incorrect number of files.";
    }

    setErrors(newErrors);
    setSelectedFiles([]);
    event.target.value = null;
  };

  const [pickupLocation, setPickupLocation] = useState<any>("");
  const [dropoffLocation, setDropoffLocation] = useState<any>("");
  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      selectedServices: selectedServices
    }));
    console.log(selectedServices);
  }, [selectedServices])
  useEffect(() => {
    setBookingData((prev: any) => ({
      ...prev,
      pickUp: pickupLocation,
      dropOff: dropoffLocation,
    }));
  }, [pickupLocation, dropoffLocation]);
  useEffect(() => {
    setBookingData((prev: any) => ({
      ...prev,
      pickUpDate: formatDate(pickupDate),
      dropOffDate: formatDate(dropoffDate),
    }));
  }, [pickupDate, dropoffDate]);

  useEffect(() => {
    fetchBookings();
  }, []);
  useEffect(() => {
    fetchCars();
  }, []);
  
  const fetchBookings = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getBookings`);
    const data = await response.json();
    setBookingsList(data?.data);
  }
  const fetchLocations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getLocations`);
      const result = await res.json();
      setLocationList(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }
  const fetchCars = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarsList`);
      const result = await res.json();
      setCarList(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }
  const fetchServices = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getServicesFromCar/${id}`);
      const result = await res.json();
      setServicesList(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }
  const fetchStatuses = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getBookingById/${id}`);
    const res = await response.json();
    console.log(res?.data[0]);
    setBookingById(res?.data[0]);
    setShowBookingStatusDialog(true);
  }

  const handleDownloadAndOpenPDF = async (id: number) => {
  try {
    setLoadingId(id); // Start loading

    const res = await fetch(`${import.meta.env.VITE_API_URL}/getBookingPDF/${id}`);
    const json = await res.json();
    const data = json.data?.[0];
    console.log("Booking Data: ", data);
    if (!data) {
      toast.error("No booking data found!");
      throw new Error("No booking data found");
    }

    const container = document.createElement("div");
    container.id = "temp-pdf-container";
    container.style.position = "relative";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.border = "1px solid #ddd";
    container.innerHTML = `
      
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BADU Car Rentals - Bookings</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .invoice-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 30px;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .company-info h1 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .company-info .tagline {
            font-size: 1.2rem;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        
        .company-info p {
            opacity: 0.8;
            margin-bottom: 3px;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-meta h2 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .invoice-meta .invoice-number {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .invoice-meta .dates {
            opacity: 0.8;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #f97316;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .two-column {
            display: flex;
            gap: 40px;
        }
        
        .column {
            flex: 1;
        }
        
        .info-group {
            margin-bottom: 15px;
        }
        
        .info-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 3px;
        }
        
        .info-value {
            font-weight: 500;
            color: #111827;
        }
        
        .separator {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
        
        .pricing-table {
            background-color: #fef3e2;
            border-radius: 8px;
            padding: 25px;
        }
        
        .pricing-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .pricing-row:last-child {
            margin-bottom: 0;
        }
        
        .pricing-separator {
            height: 1px;
            background-color: #fed7aa;
            margin: 15px 0;
        }
        
        .total-row {
            font-size: 1.2rem;
            font-weight: bold;
            color: #f97316;
        }
        
        .footer {
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 25px;
            margin-top: 40px;
        }
        
        .footer p {
            margin-bottom: 8px;
        }
        
        .footer .thank-you {
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .container {
                padding: 0;
            }
            
            .invoice-card {
                box-shadow: none;
                border: none;
            }
        }
        @media print {
        .page-break {
          page-break-before: always;
        }
      }
    </style>
</head>
<body>
    <div class="container">
        <div class="invoice-card">
            <!-- Header -->
            <div class="header">
                <div class="header-content">
                    <div class="company-info">
                        <h1>BADU</h1>
                        <p class="tagline">Car Rentals</p>
                        <p>Professional Car Rental Services</p>
                        <p>📍 123 Business Ave, Los Angeles, CA 90210</p>
                        <p>📞 (555) BADU-CAR | 📧 info@badurentals.com</p>
                    </div>
                    <div class="invoice-meta">
                        <h2>BOOKING</h2>
                        <p class="invoice-number">#${data?.id}</p>
                        <div class="dates">
                            <p>From Date: ${data?.pickUpDate}</p>
                            <p>To Date: ${data?.dropOffDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Customer and Vehicle Information -->
                <div class="section">
                    <div class="two-column">
                        <div class="column">
                            <h3 class="section-title">👤 Customer Information</h3>
                            <div class="info-group">
                                <div class="info-label">Name</div>
                                <div class="info-value">${data?.firstName} ${data?.lastName}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Email</div>
                                <div class="info-value">${data?.email}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Phone</div>
                                <div class="info-value">${data?.phone}</div>
                            </div>
                        </div>

                        <div class="column">
                            <h3 class="section-title">🚗 Vehicle Information</h3>
                            <div class="info-group">
                                <div class="info-label">Model</div>
                                <div class="info-value">${data?.model}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">License Plate</div>
                                <div class="info-value">${data?.license_plate}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Type</div>
                                <div class="info-value">${data?.category}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>

                <!-- Rental Details -->
                <div class="section">
                    <h3 class="section-title">📅 Rental Details</h3>
                    <div class="two-column">
                        <div class="column">
                            <div class="info-group">
                                <div class="info-label">Pickup Date</div>
                                <div class="info-value">${data?.pickUpDate}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Return Date</div>
                                <div class="info-value">${data?.dropOffDate}</div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="info-group">
                                <div class="info-label">Pickup Location</div>
                                <div class="info-value">${data?.pickup_location_name}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Return Location</div>
                                <div class="info-value">${data?.dropoff_location_name}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>

                <!-- Pricing Breakdown -->
                <div class="section page-break" style="margin-top: 25px;">
                    <h3 class="section-title">💰 Pricing Breakdown</h3>
                    <div class="pricing-table">
                        <div class="pricing-row">
                            <span>Payment Method</span>
                            <span>${data?.method}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Daily Rate</span>
                            <span>$${data?.Daily_Rate}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Extra Services</span>
                            <span>$${data?.Extra_Services}</span>
                        </div>
                        <div class="pricing-row">
                            <span>Security Deposit</span>
                            <span>$${data?.security_Deposit}</span>
                        </div>
                        <div class="pricing-separator"></div>
                        <div class="pricing-row total-row">
                            <span>Total Amount</span>
                            <span>$${data?.total_Price}</span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p class="thank-you">Thank you for choosing BADU Car Rentals!</p>
                    <p>Payment is due within 7 days of invoice date. For questions, contact us at (555) BADU-CAR</p>
                    <p>Visit us at www.badurentals.com | Follow us @badurentals</p>
                </div>
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
        filename: "booking-summary.pdf",
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        html2canvas: { scale: 3 },
        margin: 2,
      })
      .outputPdf("bloburl");

    window.open(pdfBlobUrl, "_blank");

    container.remove();
  } catch (err) {
    console.error("PDF generation error:", err);
    toast.error("Failed to generate PDF");
  } finally {
    setLoadingId(null); // Stop loading
  }
};




  const handleSubmits = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!bookingData.pickUp) newErrors.pickUp = "PickUp Location is required";
    if (!bookingData.dropOff) newErrors.dropOff = "DropOff Location is required";
    if (!bookingData.pickUpDate) newErrors.pickUpDate = "PickUp Date is required";
    if (!bookingData.dropOffDate) newErrors.dropOffDate = "Drop Off Date is required";
    if (!bookingData.firstName) newErrors.firstName = "First name is required";
    if (!bookingData.lastName) newErrors.lastName = "Last Name is required";
    if (!bookingData.email) newErrors.email = "Email is required";
    if (!bookingData.phone) newErrors.phone = "Phone is required";
    if (selectedFiles.length === 0) {
          newErrors.files = "Please upload your identity verification file(s).";
        } else {
          const imageFiles = selectedFiles.filter(file =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
          );
          const pdfFiles = selectedFiles.filter(file => file.type === "application/pdf");

          if (pdfFiles.length > 0 && imageFiles.length > 0) {
            newErrors.files = "You cannot upload both images and a PDF.";
          } else if (pdfFiles.length > 1) {
            newErrors.files = "Only one PDF file is allowed.";
          } else if (imageFiles.length === 1) {
            newErrors.files = "Please upload both front and back images of your ID (2 images required).";
          } else if (imageFiles.length > 2) {
            newErrors.files = "Only two images are allowed.";
          }
        }


    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    console.log(selectedServices);
    // Construct form data
    const formData = new FormData();
    // Object.entries(bookingData).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });
    Object.entries(bookingData).forEach(([key, value]) => {
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      formData.append(key, formattedValue);
    });

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    console.log("Booking Data: ", bookingData);
    try {
      console.log("POST DATA: ", formData);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addBooking`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      setBookingData({
        pickUp: "",
        dropOff: "",
        fromDate: "",
        toDate: "",
        selectedServices: [],
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        is18Plus: false
      });
      setSelectedFiles([]);
      setShowBookingsDialog(false);
      fetchBookings();
      toast.success("Booking Added Successfully!");
      if (!res.ok) throw new Error("Failed to create booking!");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleStatusUpdate = async () => {
    const bookingId = bookingById?.id;
    const bookingSt = bookingStatus;
    const paymetnSt = paymentStatus; 
    const response = await fetch(`${import.meta.env.VITE_API_URL}/updateBookingStatus/${bookingId}/${bookingSt}/${paymetnSt}`);
    const res = await response.json();
    toast.success("Booking updated successfully!");
    setShowBookingStatusDialog(false);
    fetchBookings();
  }

  useEffect(() => {
    fetchLocations();
    // fetchServices();
  }, []);
  useEffect(() => {
    setBookingStatus(bookingById?.bookingStatus);
    setPaymentStatus(bookingById?.paymentStatus);
  }, [bookingById])

 const filteredBookings = useMemo(() => {
    const baseList = Array.isArray(bookingsList)
      ? filter === "all"
        ? bookingsList
        : bookingsList.filter((booking) => booking?.bookingStatus === filter)
      : [];

    // Apply search filtering
    const term = searchTerm.trim().toLowerCase();
    const searchedList = term
      ? baseList.filter((booking) =>
          [booking?.firstName, booking?.lastName, booking?.email, booking?.phone, booking?.model]
            .some(field => field?.toLowerCase().includes(term))
        )
      : baseList;

    // Apply date filtering
    const dateFilteredList = searchedList.filter((booking) => {
      const bookingDate = new Date(booking?.pickUpDate); // or dropOffDate if preferred

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const isAfterFrom = !from || bookingDate >= from;
      const isBeforeTo = !to || bookingDate <= to;

      return isAfterFrom && isBeforeTo;
    });

    return dateFilteredList;
  }, [bookingsList, filter, searchTerm, fromDate, toDate]);


  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    };

    return (
      <Badge variant="outline" className={cn(
        "px-2.5 py-1 rounded-full font-semibold text-xs",
        styles[status]
      )}>
        {status}
      </Badge>
    );
  };

  if (isSubmitting) return <div className="flex justify-center items-center mt-6">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">View and manage all reservations, check status, and process bookings.</p>
        </div>
        <Button onClick={setShowBookingsDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* ADD BOOKING DIALOG */}
      <Dialog open={showBookingsDialog} onOpenChange={setShowBookingsDialog}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add Booking</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="basic" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="information">Information</TabsTrigger>
               
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4 pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Pickup Location */}
                      <div className="space-y-2">
                        <label
                          htmlFor="pickupLocation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Pickup Location
                        </label>
                      <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.pickUp}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* Drop Off Location */}
                                        <Select value={pickupLocation} onValueChange={setPickupLocation}>
                                          <SelectTrigger className={`w-full border ${cn(errors.pickUp ? "border-red-500" : "border-gray-300")} rounded-md`}>
                                            <SelectValue placeholder="Select Pick-Up Location" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Array.isArray(locationList) && locationList?.map((location) => (
                                              <SelectItem
                                                key={location.id}
                                                value={location.id}
                                                disabled={location.id === dropoffLocation} // prevent same as pickup
                                              >
                                                {location.location_name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.pickUp}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>

                      </div>

                      {/* Drop-off Location */}
                      <div className="space-y-2">
                        <label
                          htmlFor="dropoffLocation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Drop-off Location
                        </label>
                        
                      <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.dropOff}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* Drop Off Location */}
                                        <Select value={dropoffLocation} onValueChange={setDropoffLocation}>
                                          <SelectTrigger className={`w-full border ${cn(errors.dropOff ? "border-red-500" : "border-gray-300")} rounded-md`}>
                                            <SelectValue placeholder="Select Drop-off Location" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Array.isArray(locationList) && locationList?.map((location) => (
                                              <SelectItem
                                                key={location.id}
                                                value={location.id}
                                                disabled={location.id === pickupLocation} // prevent same as pickup
                                              >
                                                {location.location_name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.dropOff}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>
                      </div>

                      {/* Pick-up Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Pick-up Date
                        </label>
                        <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.pickUpDate}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal border border-gray-300",
                                              !pickupDate && "text-gray-400"
                                            )}
                                          >
                                            {pickupDate ? format(pickupDate, "yyyy-MM-dd") : "YYYY-MM-DD"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={pickupDate}
                                            onSelect={setPickupDate}
                                            initialFocus
                                            className={`p-3 pointer-events-auto ${cn(errors.pickUpDate && "border-red-500")}`}
                                            required={true}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.pickUpDate}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>
                      </div>

                      {/* Drop-off Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Drop-off Date
                        </label>
                        <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.dropOffDate}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* Drop Off Date */}
                                        <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal border border-gray-300",
                                              !dropoffDate && "text-gray-400"
                                            )}
                                          >
                                            {dropoffDate
                                              ? format(dropoffDate, "yyyy-MM-dd")
                                              : "YYYY-MM-DD"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={dropoffDate}
                                            onSelect={setDropoffDate}
                                            initialFocus
                                            className={`p-3 pointer-events-auto ${cn(errors.dropOffDate && "border-red-500")}`}
                                            required={true}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.dropOffDate}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>
                      </div>
                    </div>
                    </TabsContent>
                    <TabsContent value="details" className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Select Car */}
                        <div className="space-y-2">
                          <label
                            htmlFor="pickupLocation"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Car:
                          </label>
                        <Tooltip.Provider>
                                    <Tooltip.Root open={!!errors.Car}>
                                      <Tooltip.Trigger asChild>
                                        <div>
                                          {/* Drop Off Location */}
                                          <Select value={car} onValueChange={setCar}>
                                            <SelectTrigger className={`w-full border ${cn(errors.Car ? "border-red-500" : "border-gray-300")} rounded-md`}>
                                              <SelectValue placeholder="Select Drop-off Location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {Array.isArray(carList) && carList?.map((car) => (
                                                <SelectItem
                                                  key={car?.id}
                                                  value={car}
                                                >
                                                  {car?.model}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </Tooltip.Trigger>
                                      <Tooltip.Content
                                        side="top"
                                        align="start"
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                      >
                                        {errors.Car}
                                        <Tooltip.Arrow className="fill-red-600" />
                                      </Tooltip.Content>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>

                        </div>
                      </div>
                      <div className="gap-4">
                        <div className="space-y-2">
                          {/* Extra Services */}
                          <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900">Extra Services</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Baby Seat */}
                              {servicesList?.length > 0 && servicesList.map((service) => (
                                <div key={service.id} className="flex items-start mb-3">
                                  <Checkbox
                                    id={`service-${service.id}`}
                                    // checked={extraServices[service.id]}
                                    onCheckedChange={(checked) => {
                                    const isChecked = checked === true;

                                    const deduction = service?.sale_price === 0 ? service?.amount : service?.sale_price;

                                    setActiveDeductions((prev) =>
                                      isChecked ? [...prev, deduction] : prev.filter(d => d !== deduction)
                                    );

                                    setSelectedServices((prev) => {
                                      if (!Array.isArray(prev)) return []; // safety check
                                      return isChecked
                                      ? Array.from(new Set([...prev, service.id])) // ensures unique IDs
                                      : prev.filter(id => id !== service.id);
                                    });
                                    setBookingData({
                                      ...bookingData, selectedServices: selectedServices
                                    });
                                  }}

                                    className="h-5 w-5 mt-1"
                                  />
                                  <div className="flex justify-between items-center ml-3 w-full">
                                    <label
                                      htmlFor={`service-${service.id}`}
                                      className="text-sm font-medium text-gray-700"
                                    >
                                      {service.name}
                                      {service.short_bio && (
                                        <div className="text-xs text-gray-500">{service.short_bio}</div>
                                      )}
                                    </label>
                                    <span className="text-sm text-gray-500">
                                      ${service?.sale_price === 0 ? service?.amount : service?.sale_price} / Total
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="information" className="space-y-4 pt-4 h-64 overflow-scroll">
                      <div className="gap-4">
                        <div className="space-y-2">
                          {/* Billing Information */}
                          <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* First Name */}
                              <div className="space-y-2">
                                      <Label htmlFor="first-name">First Name</Label>
                                      <Tooltip.Provider>
                                        <Tooltip.Root open={!!errors.firstName}>
                                          <Tooltip.Trigger asChild>
                                            <div>
                                              {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                                              <Input
                                                id="first-name"
                                                placeholder="First Name"
                                                value={bookingData.firstName}
                                                onChange={(e) =>
                                                  setBookingData({ ...bookingData, firstName: e.target.value })
                                                }
                                                className={cn(errors.firstName && "border-red-500")}
                                              />
                                            </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Content
                                            side="top"
                                            align="start"
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                          >
                                            {errors.firstName}
                                            <Tooltip.Arrow className="fill-red-600" />
                                          </Tooltip.Content>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>
                                    </div>
                              {/* Last Name */}
                              <div className="space-y-2">
                                      <Label htmlFor="first-name">Last Name</Label>
                                      <Tooltip.Provider>
                                        <Tooltip.Root open={!!errors.lastName}>
                                          <Tooltip.Trigger asChild>
                                            <div>
                                              {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                                              <Input
                                                id="last-name"
                                                placeholder="Last Name"
                                                value={bookingData.lastName}
                                                onChange={(e) =>
                                                  setBookingData({ ...bookingData, lastName: e.target.value })
                                                }
                                                className={cn(errors.lastName && "border-red-500")}
                                              />
                                            </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Content
                                            side="top"
                                            align="start"
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                          >
                                            {errors.lastName}
                                            <Tooltip.Arrow className="fill-red-600" />
                                          </Tooltip.Content>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>
                                    </div>

                              {/* Email Address */}
                              <div className="space-y-2">
                                      <Label htmlFor="email">Email Address</Label>
                                      <Tooltip.Provider>
                                        <Tooltip.Root open={!!errors.email}>
                                          <Tooltip.Trigger asChild>
                                            <div>
                                              {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                                              <Input
                                                id="email"
                                                placeholder="Email Address"
                                                value={bookingData.email}
                                                onChange={(e) =>
                                                  setBookingData({ ...bookingData, email: e.target.value })
                                                }
                                                className={cn(errors.email && "border-red-500")}
                                              />
                                            </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Content
                                            side="top"
                                            align="start"
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                          >
                                            {errors.email}
                                            <Tooltip.Arrow className="fill-red-600" />
                                          </Tooltip.Content>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>
                                    </div>
                                    {/* Phone */}
                                    <div className="space-y-2">
                                      <Label htmlFor="phone">Phone</Label>
                                      <Tooltip.Provider>
                                        <Tooltip.Root open={!!errors.phone}>
                                          <Tooltip.Trigger asChild>
                                            <div>
                                              {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                                              <Input
                                                id="phone"
                                                type="tel"
                                                maxLength={12}
                                                placeholder="Phone"
                                                value={bookingData.phone}
                                                onChange={(e) =>
                                                  setBookingData({ ...bookingData, phone: e.target.value.replace(/\D/g, "") }) // remove non-numeric input
                                                }
                                                className={cn(errors.phone && "border-red-500")}
                                              />
                                            </div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Content
                                            side="top"
                                            align="start"
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                          >
                                            {errors.phone}
                                            <Tooltip.Arrow className="fill-red-600" />
                                          </Tooltip.Content>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>
                                    </div>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Checkbox
                                    id="babySeat"
                                    className="h-5 w-5 mt-1"
                                    onCheckedChange={(checked) => {
                                      setBookingData({ ...bookingData, is18Plus: checked })
                                    }}
                                  />
                                  <label
                                    htmlFor="babySeat"
                                    className="text-sm ml-3 font-medium text-gray-700"
                                  >
                                    I'm 21 years of age or older
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900">Identity Verification</h3>
                            {/* <Label htmlFor="phone">Please upload your (Front & Back Pictures) National ID Card OR your Passport (PDF).</Label> */}
                            <div
                              onClick={handleClick}
                              className="border-2 mt-4 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-gray-300 hover:border-gray-400"
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf"
                                multiple
                              />
                              <div className="mx-auto w-fit p-3 rounded-full bg-gray-100 mb-3">
                                <Plus className="h-6 w-6 text-gray-500" />
                              </div>
                              <p className="text-sm text-gray-500">
                                Drag and drop images here or click to browse
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Supports JPEG, PNG • Max 5MB each
                              </p>
                            </div>
                            {errors.files && (
                              <p className="text-sm text-red-500 mt-2">{errors.files}</p>
                            )}
                            {selectedFiles.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                  {/* Remove Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updatedFiles = [...selectedFiles];
                                      updatedFiles.splice(index, 1);
                                      setSelectedFiles(updatedFiles);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                                    title="Remove file"
                                  >
                                    ×
                                  </button>

                                  {/* File Display */}
                                  {file.type === 'application/pdf' ? (
                                    <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
                                      📄 {file.name}
                                    </div>
                                  ) : (
                                    <div>
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-32 h-32 object-cover rounded border"
                                      />
                                      <p className="text-xs mt-1 text-center text-gray-600">
                                        {file.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          </div>

                          {/* PRICE CALCULATION */}
                          <div className="mt-8 space-y-2 flex flex-col items-end justify-end w-full">

                            <div className="w-50 flex items-center ">
                              <span className="text-gray-500 text-left text-sm mr-4">Security Deposit:</span>
                              <span className="text-badu-orange text-4xl font-bold">
                                ${car?.security_desposit}
                              </span>
                            </div>

                            <div className="w-50 flex items-center ">
                              <span className="text-gray-500 text-sm mr-4">Daily Rate:</span>
                              <span className="text-badu-orange text-4xl font-bold">
                                ${baseRate}
                              </span>
                            </div>

                            <div>
                              <div className="w-50 flex items-center ">
                                <span className="text-gray-500 text-sm mr-4">Extra Services:</span>
                                <span className="text-badu-orange text-4xl font-bold">
                                  ${totalDeductions}
                                </span>
                              </div>
                              <div className="w-50 flex items-center justify-end">
                                <span className="text-gray-500 text-sm mr-4">Total:</span>
                                <span className="text-badu-orange text-4xl font-bold">
                                  ${finalPrice}
                                </span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBookingsDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmits} disabled={isSubmitting}>Book Now</Button>
                  </DialogFooter>
                </DialogContent>
      </Dialog>

      {/* UPDATE BOOKING STATUS DIALOG */}
      <Dialog open={showBookingStatusDialog} onOpenChange={setShowBookingStatusDialog}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Update Booking Status</DialogTitle>
                  </DialogHeader>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Booking Status */}
                      <div className="space-y-2">
                        <label
                          htmlFor="pickupLocation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Booking Status
                        </label>
                      <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.bookingStatus}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* Booking Status */}
                                        <Select value={bookingStatus} onValueChange={setBookingStatus}>
                                          <SelectTrigger className={`w-full border ${cn(errors.bookingStatus ? "border-red-500" : "border-gray-300")} rounded-md`}>
                                            <SelectValue placeholder="Select Booking Status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem
                                                key={1}
                                                value="pending"
                                              >
                                                Pending
                                              </SelectItem>
                                              <SelectItem
                                                key={2}
                                                value="cancelled"
                                              >
                                                Cancelled
                                              </SelectItem>
                                              <SelectItem
                                                key={3}
                                                value="completed"
                                              >
                                                Completed
                                              </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.bookingStatus}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>

                      </div>

                      {/* Payment Status */}
                      <div className="space-y-2">
                        <label
                          htmlFor="dropoffLocation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Payment Status
                        </label>
                        
                      <Tooltip.Provider>
                                  <Tooltip.Root open={!!errors.paymentStatus}>
                                    <Tooltip.Trigger asChild>
                                      <div>
                                        {/* Payment Status */}
                                        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                          <SelectTrigger className={`w-full border ${cn(errors.paymentStatus ? "border-red-500" : "border-gray-300")} rounded-md`}>
                                            <SelectValue placeholder="Select Drop-off Location" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem
                                                key={1}
                                                value="pending"
                                              >
                                                Pending
                                              </SelectItem>
                                              <SelectItem
                                                key={2}
                                                value="cancelled"
                                              >
                                                Cancelled
                                              </SelectItem>
                                              <SelectItem
                                                key={2}
                                                value="completed"
                                              >
                                                Completed
                                              </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content
                                      side="top"
                                      align="start"
                                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                                    >
                                      {errors.paymentStatus}
                                      <Tooltip.Arrow className="fill-red-600" />
                                    </Tooltip.Content>
                                  </Tooltip.Root>
                                </Tooltip.Provider>
                      </div>
                    </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBookingStatusDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate}>Update Status</Button>
                  </DialogFooter>
                </DialogContent>
      </Dialog>


              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="all" className="mb-6">
                    <TabsList>
                      <TabsTrigger value="all" onClick={() => setFilter("all")}>All Bookings</TabsTrigger>
                      <TabsTrigger value="pending" onClick={() => setFilter("pending")}>Pending</TabsTrigger>
                      {/* <TabsTrigger value="confirmed" onClick={() => setFilter("confirmed")}>Confirmed</TabsTrigger> */}
                      {/* <TabsTrigger value="active" onClick={() => setFilter("active")}>Active</TabsTrigger> */}
                      <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        className="pl-10" 
                        placeholder="Search by customer, car, booking ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full space-x-2 mb-6">
                    <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "w-[160px] justify-start text-left font-normal border rounded-md px-3 py-2 text-sm",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : <span>From date</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-[160px] justify-start text-left font-normal border rounded-md px-3 py-2 text-sm",
                              !toDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "PPP") : <span>From date</span>}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Car</TableHead>
                          <TableHead>License Plate</TableHead>
                          <TableHead>PickUp Date</TableHead>
                          <TableHead>DropOff Date</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          {/* <TableHead>Payment</TableHead> */}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(filteredBookings) && filteredBookings?.map((booking) => (
                          <TableRow key={booking?.id}>
                            <TableCell className="font-medium">#{booking?.id.toString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {/* <img 
                                  src={'#'} 
                                  alt={booking?.firstName + ' ' + booking?.lastName}
                                  className="w-8 h-8 rounded-full object-cover"
                                /> */}
                                <span>{booking?.firstName + ' ' + booking?.lastName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{booking?.model}</TableCell>
                            <TableCell>{booking?.license_plate}</TableCell>
                            <TableCell>{booking?.pickUpDate}</TableCell>
                            <TableCell>{booking?.dropOffDate}</TableCell>
                            <TableCell>{booking?.pickup_location_name}</TableCell>
                            <TableCell>{booking?.dropoff_location_name}</TableCell>
                            <TableCell><span className="text-orange-500">$</span>{booking?.total_Price}</TableCell>
                            <TableCell>{getStatusBadge(booking?.bookingStatus)}</TableCell>
                            {/* <TableCell>
                              <Badge variant="outline" className={cn(
                                "px-2 py-0.5 rounded text-xs",
                                booking?.paymentStatus === "paid" 
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              )}>
                                {booking?.paymentStatus}
                              </Badge>
                            </TableCell> */}
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadAndOpenPDF(booking?.id)}
                                disabled={loadingId === booking?.id}
                              >
                                {loadingId === booking?.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                              </Button>
                              {/* <Button onClick={() => fetchStatuses(booking?.id)} variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button> */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </div>
                </CardContent>
              </Card>
    </div>
  );
};

export default Bookings;
