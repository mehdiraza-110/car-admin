import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceCard from "@/components/service/ServiceCard";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Switch } from "@/components/ui/switch";
import { ExtraService } from "@/lib/types";
import { services } from "@/lib/data";
import CarSelectionModal from "@/components/modal/CarSelectionModal";
import {
  Plus,
  Search,
  Filter,
  PenLine,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import React from "react";
import IconPicker from "@/components/ui/icon-picker";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";

const Services = () => {
  const [extraServices, setExtraServices] = useState<ExtraService[]>(services);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showAssignId, setShowAssignId] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [updateErrors, setUpdateErrors] = useState<any>({});
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [updateServiceId, setUpdateServiceId] = useState<number>(0);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [carsList, setCarsList] = useState<any>([]);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [showIconPicker, setShowIconPicker] = useState<any>(false);
  const [selectedIcon, setSelectedIcon] = useState<any>("");
  const [updateService, setUpdateService] = useState<any>({
    id: 0,
    name: "",
    short_bio: "",
    amount: 0,
    sale_price: 0,
    icon: null,
    is_active: true
  });
  const [service, setService] = useState<any>({
    id: 0,
    name: "",
    short_bio: "",
    amount: 0,
    sale_price: 0,
    icon: null,
    is_active: true
  });
  const initialData = {
    id: 0,
    name: "",
    short_bio: "",
    amount: 0,
    icon: null,
    sale_price: 0,
    is_active: false
  }

  useEffect(() => {
    setService({ ...service, icon: selectedIcon });
    setUpdateService({ ...updateService, icon: selectedIcon });
  }, [selectedIcon]);
  // Utility to get icon dynamically from its names
  const getIconComponent = (iconName: string) => {
    return MdIcons[iconName] || FaIcons[iconName] || MdIcons.MdHelp; // fallback
  };

  const handleServiceToggle = (id: number, enabled: boolean) => {
    setExtraServices(extraServices.map(service =>
      service.id === id ? { ...service, enabled } : service
    ));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterServices = () => {
    let filtered = Array.isArray(serviceList) ? [...serviceList] : [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.short_bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter(service => service.is_active);
    } else if (activeTab === "inactive") {
      filtered = filtered.filter(service => !service.is_active);
    }

    return filtered;
  };

  const deleteService = () => {
    if (selectedServiceId !== null) {
      // setExtraServices(extraServices.filter(service => service.id !== selectedServiceId));
      setShowDeleteDialog(false);
      // setSelectedServiceId(null);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getServices`);
      const result = await res.json();
      setServiceList(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch services.", err);
      toast.error("Failed to fetch services.");
    }
  }
  const fetchServiceForUpdate = async (id: number) => {
    if (id !== 0) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getService/${id}`);
        const result = await res.json();
        setUpdateService(result?.data[0]);
        setSelectedIcon(result?.data[0]?.icon);
        console.log(result?.data[0]);
      } catch (err) {
        console.error("Failed to fetch services.", err);
        toast.error("Failed to fetch services.");
      }
    }
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarsList`);
      const result = await res.json();
      setCarsList(result?.data);

    } catch (err) {
      console.error("Failed to fetch services.", err);
      toast.error("Failed to fetch services.");
    }
  }
  const fetchServiceAssignedVehicles = async (id: number) => {
    try {
      const assignedCars = await fetch(`${import.meta.env.VITE_API_URL}/getServiceAssignedCars/${id}`);
      const response = await assignedCars.json();
      console.log("Car List: ", response?.data);
      setSelectedCars(response?.data);
    }
    catch (err) {
      console.log(err);
      return err;
    }
  }

  const handleSubmit = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!service.name) newErrors.name = "Name is required";
    if (!service.amount) newErrors.amount = "Amount is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addService`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(service),
      });
      const result = res.json();
      console.log("Service: ", result);
      if (!res.ok) throw new Error("Failed to save vehicle");
      setShowAddDialog(false);
      toast.success("Service Added Successfully!");
      setService(initialData);
      fetchServices();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to add service.");
    }
  }
  const handleUpdate = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!updateService.name) newErrors.name = "Name is required";
    if (!updateService.amount) newErrors.amount = "Amount is required";

    setUpdateErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateService`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(updateService),
      });
      const result = res.json();
      console.log("Service: ", result);
      if (!res.ok) throw new Error("Failed to update!");
      setShowUpdateDialog(false);
      toast.success("Service Updated Successfully!");
      setUpdateService(initialData);
      fetchServices();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to update service.");
    }
  }
  const handleAssign = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/assignCars`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ showAssignId, selectedCars }),
      });
      const result = res.json();
      console.log("Service: ", result);
      if (!res.ok) throw new Error("Failed to Assign Service.");
      toast.success("Service Added Successfully!");
      setSelectedCars([]);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to Assign Service.");
    }
  }

  useEffect(() => {
    fetchServices();
  }, []); // fetching services
  useEffect(() => {
    if (updateServiceId !== 0) {
      fetchServiceForUpdate(updateServiceId);
      setShowUpdateDialog(true);
    }
  }, [updateServiceId]); // fetching service to update
  useEffect(() => {
    if (showAssignId !== 0) {
      fetchVehicles();
      fetchServiceAssignedVehicles(showAssignId);
      setIsModalOpen(true);
    }
  }, [showAssignId]); // fetching list of cars to show in assigned cars modal


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Extra Services Management</h1>
          <p className="text-gray-600">Manage additional services offered with car rentals.</p>
        </div>
        {/* CREATE SERVICE */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-name" className="text-right">
                  Name
                </Label>
                <Tooltip.Provider>
                  <Tooltip.Root open={!!errors.name}>
                    <Tooltip.Trigger asChild>
                      <div className="col-span-3">
                        <Input
                          id="service-name"
                          placeholder="Premium Insurance"
                          className="col-span-3"
                          value={service.name}
                          onChange={(e) => setService({ ...service, name: e.target.value })}
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="start"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                    >
                      {errors.name}
                      <Tooltip.Arrow className="fill-red-600" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>

              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="service-description"
                  placeholder="Full coverage with zero deductible"
                  value={service.short_bio}
                  onChange={(e) => setService({ ...service, short_bio: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-price" className="text-right">
                  Price (AED)
                </Label>
                <Tooltip.Provider>
                  <Tooltip.Root open={!!errors.amount}>
                    <Tooltip.Trigger asChild>
                      <div className="col-span-3">
                        <Input
                          id="service-price"
                          placeholder="$0"
                          value={service.amount}
                          onChange={(e) => setService({ ...service, amount: e.target.value })}
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="start"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                    >
                      {errors.amount}
                      <Tooltip.Arrow className="fill-red-600" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-price" className="text-right">
                  Sale Price (AED)
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder="$0"
                  value={service.sale_price}
                  onChange={(e) => setService({ ...service, sale_price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-icon" className="text-right">
                  Icon
                </Label>
                <Select>
                  <SelectTrigger id="service-icon" className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shield">Shield</SelectItem>
                    <SelectItem value="user">Chauffeur</SelectItem>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="wifi">WiFi</SelectItem>
                    <SelectItem value="child">Child Seat</SelectItem>
                    <SelectItem value="map">GPS</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-badge" className="text-right">
                  Badge
                </Label>
                <Input
                  id="service-badge"
                  placeholder="Popular"
                  className="col-span-3"
                />
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-enabled" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    checked={service.is_active}
                    onCheckedChange={(checked) => setService({ ...service, is_active: checked })}
                    id="service-enabled" />
                </div>
              </div>
              {showIconPicker && (
                <IconPicker
                  onSelect={(icon) => {
                    setSelectedIcon(icon);
                    setShowIconPicker(false);
                  }}
                />
              )}

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(true)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {selectedIcon ? `Change Icon (${selectedIcon})` : "Choose Icon"}
                </button>

                {selectedIcon && (
                  <span className="text-xl">
                    {React.createElement(MdIcons[selectedIcon] || MdIcons.MdHelpOutline)}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>Save Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* UPDATE SERVICE */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-name" className="text-right">
                  Name
                </Label>
                <Tooltip.Provider>
                  <Tooltip.Root open={!!updateErrors.name}>
                    <Tooltip.Trigger asChild>
                      <div className="col-span-3">
                        <Input
                          id="service-name"
                          placeholder="Premium Insurance"
                          className="col-span-3"
                          value={updateService.name}
                          onChange={(e) => setUpdateService({ ...updateService, name: e.target.value })}
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="start"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                    >
                      {updateErrors.name}
                      <Tooltip.Arrow className="fill-red-600" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>

              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="service-description"
                  placeholder="Full coverage with zero deductible"
                  value={updateService.short_bio}
                  onChange={(e) => setUpdateService({ ...updateService, short_bio: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-price" className="text-right">
                  Price (AED)
                </Label>
                <Tooltip.Provider>
                  <Tooltip.Root open={!!updateErrors.amount}>
                    <Tooltip.Trigger asChild>
                      <div className="col-span-3">
                        <Input
                          id="service-price"
                          placeholder="$0"
                          value={updateService.amount}
                          onChange={(e) => setUpdateService({ ...updateService, amount: e.target.value })}
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="start"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                    >
                      {updateErrors.amount}
                      <Tooltip.Arrow className="fill-red-600" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-price" className="text-right">
                  Sale Price (AED)
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder="$0"
                  value={updateService.sale_price}
                  onChange={(e) => setUpdateService({ ...updateService, sale_price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-enabled" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    checked={updateService.is_active}
                    onCheckedChange={(checked) => setUpdateService({ ...updateService, is_active: checked })}
                    id="service-enabled" />
                </div>
              </div>
              {showIconPicker && (
                <IconPicker
                  onSelect={(iconName) => {
                    setSelectedIcon(iconName); 
                    setShowIconPicker(false);
                  }}
                />
              )}

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(true)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  {selectedIcon ? `Change Icon (${selectedIcon})` : "Choose Icon"}
                </button>

                {selectedIcon && (
                  <span className="text-xl">
                    {React.createElement(MdIcons[selectedIcon] || MdIcons.MdHelpOutline)}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleUpdate}>Update Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ASSIGN SERVICE */}
        <CarSelectionModal
          isOpen={isModalOpen}
          carsList={carsList}
          selectedCars={selectedCars}
          setSelectedCars={setSelectedCars}
          handleAssign={handleAssign}
          showAssignId={showAssignId}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Available Services</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                className="pl-10"
                placeholder="Search services..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            {/* <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name: A-Z</SelectItem>
                  <SelectItem value="name_desc">Name: Z-A</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices().map((service: any) => (
              <div key={service.id} className="relative group">
                <Tooltip.Provider key={service.id}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="relative group">
                    <ServiceCard
                      service={service}
                      setShowAssignId={setShowAssignId}
                      serviceId={service.id}
                      onChange={handleServiceToggle}
                    />
                </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="bg-black text-white text-sm rounded px-2 py-1 shadow-md max-w-xs"
                    >
                      {service.short_bio?.length > 100
                        ? `${service.short_bio.slice(0, 100)}...`
                        : service.short_bio || "No description"}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUpdateServiceId(service.id)}
                      className="h-8 w-8 bg-white shadow-sm text-gray-500 hover:text-primary"
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white shadow-sm text-gray-500 hover:text-destructive"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filterServices().length === 0 && (
            <div className="text-center py-10">
              <div className="mx-auto w-fit p-4 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Bundles Section */}
      {/* <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-900">Service Packages</h2>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Package
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="bg-primary-50 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Basic Protection</h3>
              <p className="text-gray-500 text-sm mb-4">Essential services for standard rentals</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Premium Insurance</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">GPS Navigation</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Prepaid Fuel</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Package Price:</span>
                <span className="text-lg font-bold">$35/day</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Regular price:</span>
                <span>$40/day</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Save 12%</span>
                <Button variant="secondary" size="sm">Edit Package</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="bg-secondary bg-opacity-10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <UserRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Business Traveler</h3>
              <p className="text-gray-500 text-sm mb-4">Perfect for business trips and professionals</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Premium Insurance</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Portable WiFi</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">GPS Navigation</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Express Checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Package Price:</span>
                <span className="text-lg font-bold">$45/day</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Regular price:</span>
                <span>$52/day</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Save 15%</span>
                <Button variant="secondary" size="sm">Edit Package</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="bg-accent bg-opacity-10 text-accent rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Baby className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Family Friendly</h3>
              <p className="text-gray-500 text-sm mb-4">Everything needed for family trips</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Premium Insurance</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Child Seat (x2)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">GPS Navigation</span>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm">Prepaid Fuel</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Package Price:</span>
                <span className="text-lg font-bold">$50/day</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Regular price:</span>
                <span>$61/day</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Save 18%</span>
                <Button variant="secondary" size="sm">Edit Package</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this service? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
