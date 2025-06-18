import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Search, Download, CreditCard, Wallet, RefreshCw, Filter, Calendar, Pencil, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";

interface Payment {
  id: string;
  customer: {
    name: string;
    image: string;
  };
  amount: number;
  date: string;
  method: "credit_card" | "paypal" | "bank_transfer" | "cash";
  status: "completed" | "pending" | "failed" | "refunded";
  reference: string;
}

const payments: Payment[] = [
  {
    id: "INV-001",
    customer: {
      name: "James Wilson",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    amount: 475.50,
    date: "May 20, 2023",
    method: "credit_card",
    status: "completed",
    reference: "BMW M4 - 3 days"
  },
  {
    id: "INV-002",
    customer: {
      name: "Emily Thompson",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    amount: 1050.00,
    date: "May 18, 2023",
    method: "paypal",
    status: "pending",
    reference: "Tesla Model S - 7 days"
  },
  {
    id: "INV-003",
    customer: {
      name: "Robert Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    amount: 950.25,
    date: "May 15, 2023",
    method: "bank_transfer",
    status: "completed",
    reference: "Range Rover Sport - 5 days"
  },
  {
    id: "INV-004",
    customer: {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1532170579297-281918c8ae72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    amount: 500.00,
    date: "May 12, 2023",
    method: "credit_card",
    status: "completed",
    reference: "Porsche 911 - 2 days"
  },
  {
    id: "INV-005",
    customer: {
      name: "David Miller",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
    },
    amount: 350.75,
    date: "May 10, 2023",
    method: "credit_card",
    status: "refunded",
    reference: "BMW 3 Series - 2 days"
  }
];

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentList, setPaymentList] = useState<any[]>([]);
  const [pendingTotal, setPendingTotal] = useState<number>(0);
  const [pendingTransactions, setPendingTransactions] = useState<number>(0);
  const [refundTotal, setRefundTotal] = useState<number>(0);
  const [refundTransactions, setRefundTransactions] = useState<number>(0);
  const [completedTotal, setCompletedTotal] = useState<number>(0);
  const [completedTransactions, setCompletedTransactions] = useState<number>(0);
  const [completedAvgOrder, setCompletedAvgOrder] = useState<number>(0);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showBookingStatusDialog, setShowBookingStatusDialog] = useState<any>(false);
  const [errors, setErrors] = useState<any>({});
  const [bookingById, setBookingById] = useState<any>({});
  const [bookingStatus, setBookingStatus] = useState<any>("");
  const [paymentStatus, setPaymentStatus] = useState<any>("");
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const filteredPayments = useMemo(() => {
    // 1. Start with full list
    const baseList = Array.isArray(paymentList) ? paymentList : [];

    // 2. Filter by payment method (statusFilter = method)
    const methodFilteredList =
      statusFilter === "all"
        ? baseList
        : baseList.filter(payment => payment?.paymentStatus === statusFilter);

    // 3. Filter by search term
    const term = searchTerm.trim().toLowerCase();
    const searchedList = term
      ? methodFilteredList.filter(payment =>
          [payment?.firstName, payment?.lastName]
            .some(field => field?.toLowerCase().includes(term))
        )
      : methodFilteredList;

    return searchedList;
  }, [paymentList, statusFilter, searchTerm]);

  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      case "disputed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Disputed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Refunded</Badge>;
      default:
        return null;
    }
  };
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 text-primary mr-2" />;
      case "paypal":
        return <Wallet className="h-4 w-4 text-blue-500 mr-2" />;
      case "bank_transfer":
        return <RefreshCw className="h-4 w-4 text-green-500 mr-2" />;
      case "cash":
        return <Wallet className="h-4 w-4 text-gray-500 mr-2" />;
      default:
        return null;
    }
  };

  const getPaymentList = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getBookings`);
      const result = await res.json();
      setPaymentList(result?.data);

    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
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
      <title>BADU Car Rentals - Invoice</title>
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
                          <h2>INVOICE</h2>
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
  
  const fetchStatuses = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getBookingById/${id}`);
    const res = await response.json();
    console.log(res?.data[0]);
    setBookingById(res?.data[0]);
    setShowBookingStatusDialog(true);
  }
  
  const handleStatusUpdate = async () => {
      const bookingId = bookingById?.id;
      const bookingSt = paymentStatus;
      const paymetnSt = paymentStatus; 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateBookingStatus/${bookingId}/${bookingSt}/${paymetnSt}/${refundAmount !== 0 ? refundAmount : 0}`);
      const res = await response.json();
      toast.success("Booking updated successfully!");
      setShowBookingStatusDialog(false);
      setRefundAmount(0);
      getPaymentList();
  }

  useEffect(() => {
    getPaymentList();
  }, []); // Load Payment Listings
  useEffect (() => {
     // Pending Total
      const pendingStats = paymentList?.reduce(
        (acc, booking) => {
          if (booking.paymentStatus === "pending") {
            acc.total += booking.total_Price;
            acc.count += 1;
          }
          return acc;
        },
        { total: 0, count: 0 }
      );
      // Destructure the result
      const { total: pendingTotal, count: pendingCount } = pendingStats;
      setPendingTransactions(pendingCount);
      setPendingTotal(pendingTotal);

      // Pending Total
      const pendingRefund = paymentList?.reduce(
        (acc, booking) => {
          if (booking.paymentStatus === "disputed") {
            acc.total += booking.refundAmount;
            acc.count += 1;
          }
          return acc;
        },
        { total: 0, count: 0 }
      );
      // Destructure the result
      const { total: pendingRef, count: pendingC } = pendingRefund;
      setRefundTransactions(pendingC);
      setRefundTotal(pendingRef);

      // Total Confirmed Revenue
      const completedStats = paymentList?.reduce(
        (acc, booking) => {
          if (booking.paymentStatus === "completed") {
            acc.total += booking.total_Price;
            acc.count += 1;
          }
          return acc;
        },
        { total: 0, count: 0 }
      );

      // Destructure the result
      const { total: completedTotal, count: completedCount } = completedStats;
      setCompletedTransactions(completedCount);
      setCompletedTotal(completedTotal);

      // Set Avg Order
      const completedAverage =
      completedTransactions > 0 ? completedTotal / completedTransactions : 0;
      setCompletedAvgOrder(completedAverage);
  }, [paymentList, completedTotal]); // update Calculations
  useEffect(() => {
    // setBookingStatus(bookingById?.bookingStatus);
    setPaymentStatus(bookingById?.paymentStatus);
  }, [bookingById]) // Update Booking Statuses

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">View and manage payment transactions, invoices, and refunds.</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Refund
          </Button>
        </div> */}
      </div>

      {/* UPDATE BOOKING STATUS DIALOG */}
      <Dialog open={showBookingStatusDialog} onOpenChange={setShowBookingStatusDialog}>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Update Booking Status</DialogTitle>
                        </DialogHeader>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                      value="disputed"
                                                    >
                                                      Dispute
                                                    </SelectItem>
                                                    <SelectItem
                                                      key={3}
                                                      value="cancelled"
                                                    >
                                                      Cancelled
                                                    </SelectItem>
                                                    <SelectItem
                                                      key={4}
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
                          {paymentStatus === "disputed" && (
                            <div className="space-y-2">
                              <label
                                htmlFor="refundAmount"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Refund Amount
                              </label>
                              <input
                                type="number"
                                id="refundAmount"
                                name="refundAmount"
                                value={refundAmount}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (value <= (bookingById?.total_Price || 0)) {
                                    setRefundAmount(value);
                                  }
                                }}
                                max={bookingById?.total_Price || 0}
                                className={`w-full border ${cn(errors.refundAmount ? "border-red-500" : "border-gray-300")} rounded-md px-3 py-2`}
                                placeholder="Enter refund amount"
                              />
                              <span className="text-xs text-gray-500">Total Paid: ${bookingById?.total_Price}</span>
                              {errors.refundAmount && (
                                <p className="text-red-600 text-sm">{errors.refundAmount}</p>
                              )}
                            </div>
                          )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowBookingStatusDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleStatusUpdate}>Update Status</Button>
                        </DialogFooter>
                      </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
            <p className="text-2xl font-bold">${completedTotal?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{completedTransactions} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Pending Payments</p>
            <p className="text-2xl font-bold">${pendingTotal?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{pendingTransactions} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Average Order</p>
            <p className="text-2xl font-bold">${completedAvgOrder?.toLocaleString()}</p>
            {/* <p className="text-xs text-success mt-1">↑ 5.2% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Refunds</p>
            <p className="text-2xl font-bold">${refundTotal?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{refundTransactions} transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                {/* <TabsTrigger value="refunded">Refunded</TabsTrigger> */}
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="disputed">Dispute</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                className="pl-10" 
                placeholder="Search by customer, invoice, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>ID Front</TableHead>
                  <TableHead>ID Back</TableHead>
                  <TableHead>ID PDF</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredPayments) && filteredPayments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <img
                          src={payment.customer.image}
                          alt={payment.customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        /> */}
                        <span>{payment?.firstName} {payment?.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment?.phone}</TableCell>
                    <TableCell><a className={payment?.identityPic_Front !== "#" ? "text-orange-500" : ""} href={payment?.identityPic_Front} target={payment?.identityPic_Front !== "#" ? "_blank" : "_self"} rel="noopener noreferrer">{payment?.identityPic_Front == "#" ? "N/A" : "Attached"}</a></TableCell>
                    <TableCell><a className={payment?.identityPic_Back !== "#" ? "text-orange-500" : ""} href={payment?.identityPic_Back} target={payment?.identityPic_Back !== "#" ? "_blank" : "_self"} rel="noopener noreferrer">{payment?.identityPic_Back == "#" ? "N/A" : "Attached"}</a></TableCell>
                    <TableCell><a className={payment?.identity_PDF !== "#" ? "text-orange-500" : ""} href={payment?.identity_PDF} target={payment?.identity_PDF !== "#" ? "_blank" : "_self"} rel="noopener noreferrer">{payment?.identity_PDF == "#" ? "N/A" : "Attached"}</a></TableCell>
                    <TableCell><span className="text-orange-500">$</span>{payment?.total_Price}</TableCell>
                    <TableCell>{payment?.booking_Date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getMethodIcon("cash")}
                        <span className="capitalize">
                          {payment?.payment_method === 1 ? "cash" : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment?.paymentStatus)}</TableCell>
                    <TableCell><span className="text-orange-500">$</span>{payment?.refundAmount}</TableCell>
                    <TableCell className="text-right">
                      {/* <Button 
                      onClick={() => handleDownloadAndOpenPDF(payment?.id)} 
                      variant="ghost" 
                      size="sm">View</Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadAndOpenPDF(payment?.id)}
                        disabled={loadingId === payment?.id}
                      >
                      {loadingId === payment?.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      </Button>
                      {payment?.paymentStatus !== "disputed" && (
                        <Button onClick={() => fetchStatuses(payment?.id)} variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
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

export default Payments;
