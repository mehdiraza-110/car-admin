import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, MoreVertical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CarStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CarTableProps {
  limit?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  carList?: []
  setShowUpdateCarDialog?: any
  setUpdateVehicleID?: any
  setOpenModal?: any
  setSelectedImages: any
}

type displayCars = {
  id: number | string;
  image_1: string | any;
  model: any;
  year: any;
  image_2: any;
  category: any;
  trasmission_type: any;
  daily_rate: any;
  max_passengers: any;
  fuel: any;
}

const CarTable: React.FC<CarTableProps> = ({
  limit,
  showHeader = true,
  showPagination = true,
  carList = [],
  setShowUpdateCarDialog,
  setUpdateVehicleID,
  setOpenModal,
  setSelectedImages
}) => {
  const recordsPerPage = 5;
  const [page, setPage] = useState(1);
  const totalRecords = Array.isArray(carList) && carList?.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const paginatedCars = Array.isArray(carList) && carList?.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );
  const [category, setCategory] = useState<string>("all");

  // const filteredCars = category === "all"
  //   ? cars
  //   : cars.filter(car => car.category.toLowerCase() === category.toLowerCase());

  const displayCars = limit ? Array.isArray(carList) && carList?.slice(0, 5) : paginatedCars;

  const statusColor = (status: CarStatus) => {
    switch (status) {
      case "Available":
        return "bg-success bg-opacity-10 text-success";
      case "Booked":
        return "bg-destructive bg-opacity-10 text-destructive";
      case "Maintenance":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-0 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Vehicle Fleet</CardTitle>
            <div className="flex space-x-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Transmission</TableHead>
                <TableHead>Seating Capacity</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(displayCars) && displayCars?.map((car: any) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="flex-shrink-0 h-14 w-20 cursor-pointer"
                        onClick={() => {
                          setSelectedImages([
                            car.image_1,
                            car.image_2,
                            car.image_3,
                            car.image_4,
                            car.image_5,
                          ]);
                          setOpenModal(true);
                        }}
                      >
                        <img
                          className="h-14 w-20 object-cover rounded"
                          src={car.image_1}
                          alt={car.model}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{car.model}</div>
                        <div className="text-sm text-gray-500">Year: {car.year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{car.category}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "px-2.5 py-1 rounded-full font-semibold text-xs",
                      statusColor("Available")
                    )}>
                      {"Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    AED {car.daily_rate.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">{car.trasmission_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">{car.max_passengers}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">{car.fuel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:text-primary-700 mr-2"
                      onClick={() => {
                        setUpdateVehicleID(car.id);
                        setShowUpdateCarDialog(true)
                      }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * recordsPerPage + 1}</span>
              {" "}to{" "}
              <span className="font-medium">
                {Math.min(page * recordsPerPage, totalRecords)}
              </span>{" "}
              of <span className="font-medium">{totalRecords}</span> vehicles
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default CarTable;
