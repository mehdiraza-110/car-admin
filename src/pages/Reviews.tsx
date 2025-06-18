import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MapPin, CheckCircle2, AlertTriangle, Info, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast from "react-hot-toast";

const Reviews = () => {
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [review, setReview] = useState<any>("");
  const [reviewStatus, setReviewStatus] = useState<any>("");
  const [showUpdateReviewDialog, setShowUpdateReviewDialog] = useState<any>(false);


  const filteredReviews = reviewList.filter((review) =>
    filterStatus === "all" ? true : review.status === filterStatus
  );
  const fetchReviews = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getReviews`);
    const res = await response.json();
    setReviewList(res?.data);
    console.log(res);
  }
  useEffect(() => {
    fetchReviews();
  }, []);
  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const statusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "review":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };
  const fetchStatuses = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getReviewStatus/${id}`);
    const res = await response.json();
    console.log(res?.data[0]);
    setReview(res?.data[0]);
    setShowUpdateReviewDialog(true);
  }
  useEffect(() => {
    setReviewStatus(review?.status);
  }, [review]);

  const handleReviewUpdate = async () => {
    const reviewId = review?.id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateReviewStatus`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ status: reviewStatus, id: reviewId }),
      });
      const res = await response.json();
      toast.success("Review updated successfully!");
      setShowUpdateReviewDialog(false);
      fetchReviews();
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600">Manage Reviews, Statuses & more.</p>
        </div>
      </div>
      {/* UPDATE REVIEW STATUS DIALOG */}
            <Dialog open={showUpdateReviewDialog} onOpenChange={setShowUpdateReviewDialog}>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Update Review Status</DialogTitle>
                              </DialogHeader>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Review Status */}
                                  <div className="space-y-2">
                                    <label
                                      htmlFor="dropoffLocation"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Review Status
                                    </label>  
                                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                                                      <SelectTrigger className={`w-full border border-gray-300 rounded-md`}>
                                                        <SelectValue placeholder="Select Review Status" />
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
                                                            value="approved"
                                                          >
                                                            Approved
                                                          </SelectItem>
                                                          <SelectItem
                                                            key={3}
                                                            value="flagged"
                                                          >
                                                            Flagged
                                                          </SelectItem>
                                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowUpdateReviewDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleReviewUpdate}>Update Review</Button>
                              </DialogFooter>
                            </DialogContent>
            </Dialog>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "flagged"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded text-sm font-medium border ${
              filterStatus === status
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>


      <Card>
        
        <CardContent className="p-6">
        
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review By</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review?.id}>
                        <TableCell className="font-medium">{review?.name}</TableCell>
                        <TableCell>
                          <div>
                            <div>{review?.review}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex mt-2 space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="text-2xl cursor-default text-orange-500 focus:outline-none"
                                >
                                  {star <= review?.rating ? "★" : "☆"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {review?.submissionDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {statusIcon(review?.status)}
                            <Badge
                              variant="outline"
                              className={`px-2 py-0.5 rounded text-xs ${statusColor(review?.status)}`}
                            >
                              {review?.status?.charAt(0)?.toUpperCase() + review?.status?.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                        <Button onClick={() => fetchStatuses(review?.id)} variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
