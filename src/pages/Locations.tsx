import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import * as utils from "../lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MapPin, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast from "react-hot-toast";
import LocationMapPicker from "@/components/ui/LocationMapPicker";


interface LocationPoint {
  id: number;
  name: string;
  address: string;
  city: string;
  type: string;
  pickups: number;
  returns: number;
  status: "active" | "inactive" | "maintenance";
}

const locationDataTemp: LocationPoint[] = [
  {
    id: 1,
    name: "Downtown Office",
    address: "123 Main Street",
    city: "New York, NY 10001",
    type: "Office",
    pickups: 32,
    returns: 28,
    status: "active"
  },
  {
    id: 2,
    name: "Airport Terminal",
    address: "Terminal 4, JFK Airport",
    city: "Queens, NY 11430",
    type: "Airport",
    pickups: 47,
    returns: 41,
    status: "active"
  },
  {
    id: 3,
    name: "Hotel Zone",
    address: "500 Park Avenue",
    city: "New York, NY 10022",
    type: "Hotel",
    pickups: 18,
    returns: 15,
    status: "active"
  },
  {
    id: 4,
    name: "Shopping Mall",
    address: "1 Columbus Circle",
    city: "New York, NY 10019",
    type: "Mall",
    pickups: 12,
    returns: 14,
    status: "inactive"
  },
  {
    id: 5,
    name: "Brooklyn Garage",
    address: "75 Livingston Street",
    city: "Brooklyn, NY 11201",
    type: "Garage",
    pickups: 28,
    returns: 32,
    status: "maintenance"
  }
];

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [updateLocationId, setUpdateLocationId] = useState<any>(0);
  const [showUpdateLocationDialog, setShowUpdateLocationDialog] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [updateErrors, setUpdateErrors] = useState<any>({});

  // Type
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Type for Update
  const [suggestionsUpdate, setSuggestionsUpdate] = useState<string[]>([]);
  const [showDropdownUpdate, setShowDropdownUpdate] = useState(false);
  const [typingTimeoutUpdate, setTypingTimeoutUpdate] = useState<NodeJS.Timeout | null>(null);
  const dropdownRefUpdate = useRef<HTMLDivElement | null>(null);

  const [locationList, setLocationList] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any>({
    id: 0,
    location_name: "",
    address: "",
    latitude: null,
    longitude: null,
    location_type: "",
    oeprational_days: "",
    day1_time: "",
    day2_time: "",
    day3_time: "",
    day4_time: "",
    day5_time: "",
    day6_time: "",
    day7_time: "",
    status: ""
  });
  const [updateLocationData, setUpdateLocationData] = useState<any>({
    id: 0,
    location_name: "",
    address: "",
    location_type: "",
    latitude: null,
    longitude: null,
    oeprational_days: "",
    day1_time: "",
    day2_time: "",
    day3_time: "",
    day4_time: "",
    day5_time: "",
    day6_time: "",
    day7_time: "",
    days: [],
    status: ""
  });


  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const statusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <Info className="h-4 w-4 text-gray-600" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };
  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getLocationTypes`);
      const result = await res.json();
      console.log("Get Location Types: ", result);
      const features = result?.data;
      const uniqueFeatures = [...new Set(features)] as any; // Remove Duplicates
      console.log(uniqueFeatures);
      setSuggestions(uniqueFeatures);
      // setSuggestions(features || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };
  const fetchSuggestionsForUpdate = async (query: string) => {
    if (!query) return setSuggestions([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getLocationTypes`);
      const result = await res.json();
      console.log("Get Location Types: ", result);
      const features = result?.data;
      const uniqueFeatures = [...new Set(features)]; // Remove Duplicates
      console.log(uniqueFeatures);
      setSuggestionsUpdate(uniqueFeatures);
      // setSuggestions(features || []);
      setShowDropdownUpdate(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationData({ ...locationData, location_type: value });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 400); // 400ms debounce

    setTypingTimeout(timeout);
  };
  const handleInputChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdateLocationData({ ...updateLocationData, location_type: value });

    if (typingTimeoutUpdate) clearTimeout(typingTimeoutUpdate);

    const timeout = setTimeout(() => {
      fetchSuggestionsForUpdate(value);
    }, 400); // 400ms debounce

    setTypingTimeoutUpdate(timeout);
  };
  const handleSelectSuggestion = (text: string) => {
    setLocationData({ ...locationData, location_type: text });
    setShowDropdown(false);
  };
  const handleUpdateSelectSuggestion = (text: string) => {
    setUpdateLocationData({ ...updateLocationData, location_type: text });
    setShowDropdownUpdate(false);
  };
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  const [operationalHours, setOperationalHours] = useState<any>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { active: false, from: "#", to: "#" };
      return acc;
    }, {})
  );
  const handleDayToggle = (day: string) => {
    setOperationalHours((prev: { [x: string]: { active: any; }; }) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
    setLocationData({ ...locationData, oeprational_days: operationalHours });

  };
  const handleDayToggleUpdate = (day: string) => {
    // setOperationalHours((prev: { [x: string]: { active: any; }; }) => ({
    //   ...prev,
    //   [day]: { ...prev[day], active: !prev[day].active },
    // }));
    // console.log(day);
    // setUpdateLocationData({ ...updateLocationData, oeprational_days: operationalHours });

     setOperationalHours((prev) => {
    const updated = {
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    };

    setUpdateLocationData((prevUpdate) => ({
      ...prevUpdate,
      oeprational_days: updated, // <-- use updated operationalHours
    }));

    return updated;
  });
  };
  const handleTimeChange = (day: string, field: string, value: string) => {
    setOperationalHours((prev: { [x: string]: any; }) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setLocationData({ ...locationData, oeprational_days: operationalHours });
  };
  const handleTimeChangeUpdate = (day: string, field: string, value: string) => {
    setOperationalHours((prev: { [x: string]: any; }) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setUpdateLocationData({ ...updateLocationData, oeprational_days: operationalHours });
  };
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
  const fetchLocation = async (id: Number) => {
    if (id !== 0) {
      setShowUpdateLocationDialog(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getLocation/${id}`);
        const result = await res.json();
        // console.log("Single Location: ", result);
        if (result !== null && result.data?.length > 0) {

          const timeFieldsOnly = {
          day1_time: result.data[0].day1_time,
          day2_time: result.data[0].day2_time,
          day3_time: result.data[0].day3_time,
          day4_time: result.data[0].day4_time,
          day5_time: result.data[0].day5_time,
          day6_time: result.data[0].day6_time,
          day7_time: result.data[0].day7_time,
        };

        const transformedHours = transformOperationalHours(timeFieldsOnly);

          // const transformedHours = transformOperationalHours(location);
          setOperationalHours(transformedHours);

          const location = {
            id: result.data[0].id,
            location_name: result.data[0].location_name,
            address: result.data[0].address,
            latitude: result.data[0].latitude,
            longitude: result.data[0].longitude,
            // oeprational_days: result.data[0].operational_days,
            oeprational_days: transformedHours,
            location_type: result.data[0].type,
            status: result.data[0].status,
            day1_time: result.data[0].day1_time,
            day2_time: result.data[0].day2_time,
            day3_time: result.data[0].day3_time,
            day4_time: result.data[0].day4_time,
            day5_time: result.data[0].day5_time,
            day6_time: result.data[0].day6_time,
            day7_time: result.data[0].day7_time,
          };
          setUpdateLocationData(location);
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      }
    }
  }
  // Function to transform raw data into operationalHours state
  function transformOperationalHours(data: any) {
    return daysOfWeek.reduce((acc: any, day, index) => {
      const time = data[`day${index + 1}_time`]; // e.g. "09:00-17:00"
      const [from, to] = time?.split("-") || [];

      // Normalize both `from` and `to`
      const isActive = ![from, to].some(part => part === "#" || part === "" || part === undefined);

      acc[day] = {
        active: isActive,
        from: from || "",
        to: to || ""
      };

      // console.log(acc[day]); // Debugging output
      return acc;
    }, {});
  }




  const handleSubmit = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!locationData.location_name) newErrors.location_name = "Location Name is required";
    if (!locationData.address) newErrors.address = "Address is required";
    if (!locationData.location_type) newErrors.location_type = "Type is required";
    if (!locationData.status) newErrors.status = "Status is required";
    if (!locationData.latitude || !locationData.longitude) {
      newErrors.coordinates = "Map location is required";
      toast.error("Map Location is required!");
    } 

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {

      const res = await fetch(`${import.meta.env.VITE_API_URL}/addLocation`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(locationData),
      });

      if (!res.ok) throw new Error("Failed to save location");
      setShowAddLocationDialog(false); // Close dialog
      toast.success('Location Added Successfully!');
      setLocationData({
        location_name: "",
        address: "",
        location_type: "",
        latitude: null,
        longitude: null,
        oeprational_days: "",
        day1_time: "",
        day2_time: "",
        day3_time: "",
        day4_time: "",
        day5_time: "",
        day6_time: "",
        day7_time: "",
        status: ""
      });
      fetchLocations();
      // Optionally reset form and show toast
    } catch (err) {
      console.error("Submission error:", err);
      // Show error to user
    }
  }
  const handleSubmitUpdate = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!updateLocationData.location_name) newErrors.location_name = "Location Name is required";
    if (!updateLocationData.address) newErrors.address = "Address is required";
    if (!updateLocationData.location_type) newErrors.location_type = "Type is required";
    if (!updateLocationData.status) newErrors.status = "Status is required";
    if (!updateLocationData.latitude || !updateLocationData.longitude) {
      newErrors.coordinates = "Map location is required";
      toast.error("Map Location is required!");
    } 

    setUpdateErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log("Updated Payload: ", updateLocationData);
      const updatedPayload = {
        ...updateLocationData,
        day1_time: updateLocationData.oeprational_days?.Monday?.active == true ? `${operationalHours?.Monday?.from ? operationalHours?.Monday?.from : "#"}-${operationalHours?.Monday?.to ? operationalHours?.Monday?.to : "#"}` : "#",
        day2_time: updateLocationData.oeprational_days?.Tuesday?.active == true ? `${operationalHours?.Tuesday?.from ? operationalHours?.Tuesday?.from : "#"}-${operationalHours?.Tuesday?.to ? operationalHours?.Tuesday?.to : "#"}` : "#",
        day3_time: updateLocationData.oeprational_days?.Wednesday?.active == true ? `${operationalHours?.Wednesday?.from ? operationalHours?.Wednesday?.from : "#"}-${operationalHours?.Wednesday?.to ? operationalHours?.Wednesday?.to : "#"}` : "#",
        day4_time: updateLocationData.oeprational_days?.Thursday?.active == true ? `${operationalHours?.Thursday?.from ? operationalHours?.Thursday?.from : "#"}-${operationalHours?.Thursday?.to ? operationalHours?.Thursday?.to : "#"}` : "#",
        day5_time: updateLocationData.oeprational_days?.Friday?.active == true ? `${operationalHours?.Friday?.from ? operationalHours?.Friday?.from : "#"}-${operationalHours?.Friday?.to ? operationalHours?.Friday?.to : "#"}` : "#",
        day6_time: updateLocationData.oeprational_days?.Saturday?.active == true ? `${operationalHours?.Saturday?.from ? operationalHours?.Saturday?.from : "#"}-${operationalHours?.Saturday?.to ? operationalHours?.Saturday?.to : "#"}` : "#",
        day7_time: updateLocationData.oeprational_days?.Sunday?.active == true ? `${operationalHours?.Sunday?.from ? operationalHours?.Sunday?.from : "#"}-${operationalHours?.Sunday?.to ? operationalHours?.Sunday?.to : "#"}` : "#",
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateLocation`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) throw new Error("Failed to save location");
      setShowUpdateLocationDialog(false); // Close dialog
      console.log("UPDATE LOCATION DATA: ", updatedPayload);
      toast.success('Location Updated Successfully!');
      setUpdateLocationData({
        location_name: "",
        address: "",
        location_type: "",
        latitude: null,
        longitude: null,
        oeprational_days: "",
        day1_time: "",
        day2_time: "",
        day3_time: "",
        day4_time: "",
        day5_time: "",
        day6_time: "",
        day7_time: "",
        status: ""
      });
      fetchLocations();
      // Optionally reset form and show toast
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to update location.");
      // Show error to user
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []); // fetching locations
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // location type dropdown
  useEffect(() => {
    if (updateLocationId !== 0) {
      fetchLocation(updateLocationId as number);
    }
  }, [updateLocationId]); // fetch location to update
  useEffect(() => {
    setOperationalHours(
      daysOfWeek.reduce((acc, day) => {
        acc[day] = { active: false, from: "#", to: "#" };
        return acc;
      }, {})
    );
  }, [showAddLocationDialog])


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600">Manage pickup and drop-off locations, view statistics and status.</p>
        </div>
        {/* Add Location Dialog */}
        <Dialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[90%] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.location_name}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="location-name"
                            type="text"
                            value={locationData.location_name}
                            onChange={(e) =>
                              setLocationData({ ...locationData, location_name: e.target.value })
                            }
                            placeholder="e.g. Downtown Airport"
                            className={utils.cn(errors.location_name && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.location_name}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Address</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.address}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="address"
                            type="text"
                            value={locationData.address}
                            onChange={(e) =>
                              setLocationData({ ...locationData, address: e.target.value })
                            }
                            placeholder="e.g Emery Lane 123"
                            className={utils.cn(errors.address && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.address}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
              <div className="grid mt-4 grid-cols-2 gap-4 mb-5">
                <div className="space-y-2">
                  <Label htmlFor="type">Location Type</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.location_type}>
                      <Tooltip.Trigger asChild>
                        <div className="relative" ref={dropdownRef}>
                          <Input
                            id="type"
                            placeholder="e.g. Hotel"
                            value={locationData.location_type}
                            onChange={handleInputChange}
                            className={utils.cn(errors.location_type && "border-red-500")}
                            autoComplete="off"
                          />

                          {/* Dropdown */}
                          {showDropdown && suggestions?.length > 0 && (
                            <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                              {suggestions?.map((suggestion) => (
                                <div
                                  key={suggestion.id}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSelectSuggestion(suggestion.type)}
                                >
                                  {suggestion.type}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.location_type}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.status}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Select value={locationData.status} onValueChange={(val) => setLocationData({ ...locationData, status: val })}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="InActive">InActive</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </SelectContent>
                          </Select>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.status}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
              <LocationMapPicker
                onLocationSelect={({ lat, lng }) =>
                  setLocationData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                }
              />
              {/* Show lat/lng preview */}
              <div className="mt-2 text-sm text-gray-600">
                Selected Coordinates: {locationData.latitude}, {locationData.longitude}
              </div>
              <div className="grid mt-4 grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="OperationalTime">Operational Time</Label>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          className="h-5 w-5 mt-1"
                          checked={operationalHours[day].active}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <span className="font-medium">{day}</span>
                      </label>

                      {operationalHours[day].active && (
                        <div className="mt-2 flex gap-4">
                          <div>
                            <label className="block text-sm">From</label>
                            <input
                              type="time"
                              value={operationalHours[day].from}
                              onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                              className="border rounded p-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm">To</label>
                            <input
                              type="time"
                              value={operationalHours[day].to}
                              onChange={(e) => handleTimeChange(day, "to", e.target.value)}
                              className="border rounded p-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddLocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Location Dialog */}
        <Dialog open={showUpdateLocationDialog} onOpenChange={setShowUpdateLocationDialog}>
          <DialogContent className="sm:max-w-[600px] h-[90%] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Location</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!updateErrors.location_name}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="location-name"
                            type="text"
                            value={updateLocationData?.location_name}
                            onChange={(e) =>
                              setUpdateLocationData({ ...updateLocationData, location_name: e.target.value })
                            }
                            placeholder="e.g. Downtown Airport"
                            className={utils.cn(errors.location_name && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {updateErrors.location_name}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Address</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.address}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="address"
                            type="text"
                            value={updateLocationData.address}
                            onChange={(e) =>
                              setUpdateLocationData({ ...updateLocationData, address: e.target.value })
                            }
                            placeholder="e.g Emery Lane 123"
                            className={utils.cn(errors.address && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.address}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
              <div className="grid mt-4 grid-cols-2 gap-4 mb-5">
                <div className="space-y-2">
                  <Label htmlFor="type">Location Type</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!updateErrors.location_type}>
                      <Tooltip.Trigger asChild>
                        <div className="relative" ref={dropdownRefUpdate}>
                          <Input
                            id="type"
                            placeholder="e.g. Hotel"
                            value={updateLocationData.location_type}
                            onChange={handleInputChangeUpdate}
                            className={utils.cn(updateErrors.location_type && "border-red-500")}
                            autoComplete="off"
                          />

                          {/* Dropdown */}
                          {showDropdownUpdate && suggestionsUpdate?.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                              {suggestionsUpdate?.map((suggestion) => (
                                <div
                                  key={suggestion.id}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleUpdateSelectSuggestion(suggestion.type)}
                                >
                                  {suggestion.type}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {updateErrors.location_type}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!updateErrors.status}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Select value={updateLocationData.status} onValueChange={(val) => setUpdateLocationData({ ...updateLocationData, status: val })}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="InActive">InActive</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </SelectContent>
                          </Select>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {updateErrors.status}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
              <LocationMapPicker
                onLocationSelect={({ lat, lng }) =>
                  setUpdateLocationData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                }
                initialLat={updateLocationData.latitude || 1}
                initialLng={updateLocationData.longitude || 1}
                existingMarker={
                  updateLocationData.latitude && updateLocationData.longitude
                    ? { lat: updateLocationData.latitude, lng: updateLocationData.longitude }
                    : null
                }
              />
              <div className="grid mt-4 grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="OperationalTime">Operational Time</Label>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col">
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          className="h-5 w-5 mt-1"
                          checked={operationalHours[day]?.active}
                          value={operationalHours[day]?.active}
                          onCheckedChange={() => handleDayToggleUpdate(day)}
                        />
                        <span className="font-medium">{day}</span>
                      </label>

                      {operationalHours[day].active && (
                        <div className="mt-2 flex gap-4">
                          <div>
                            <Label className="block text-sm">From</Label>
                            <input
                              type="time"
                              value={operationalHours[day].from}
                              onChange={(e) => handleTimeChangeUpdate(day, "from", e.target.value)}
                              className="border rounded p-1"
                            />
                          </div>
                          <div>
                            <Label className="block text-sm">To</Label>
                            <input
                              type="time"
                              value={operationalHours[day].to}
                              onChange={(e) => handleTimeChangeUpdate(day, "to", e.target.value)}
                              className="border rounded p-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateLocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitUpdate}>Update Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue="map" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Pickup & Drop-off Locations</CardTitle>
              {/* <TabsList> */}
              {/* <TabsTrigger value="map">Map View</TabsTrigger> */}
              {/* <TabsTrigger value="list">List View</TabsTrigger> */}
              {/* <TabsTrigger value="stats">Statistics</TabsTrigger> */}
              {/* </TabsList> */}
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === "list" && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      {/* <TableHead>Pickups</TableHead> */}
                      {/* <TableHead>Returns</TableHead> */}
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(locationList) && locationList?.map((location) => (
                      <TableRow key={location?.id}>
                        <TableCell className="font-medium">{location?.location_name}</TableCell>
                        <TableCell>
                          <div>
                            <div>{location?.address}</div>
                            {/* <div className="text-sm text-gray-500">{location.address}</div> */}
                          </div>
                        </TableCell>
                        <TableCell>{location?.type}</TableCell>
                        {/* <TableCell>{location.pickups}</TableCell> */}
                        {/* <TableCell>{location.returns}</TableCell> */}
                        <TableCell>{location?.updatedAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {statusIcon(location?.status)}
                            <Badge variant="outline" className={`px-2 py-0.5 rounded text-xs ${statusColor(location.status)}`}>
                              {location?.status.charAt(0).toUpperCase() + location?.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button onClick={() => setUpdateLocationId(location?.id)} variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}



        </CardContent>
      </Card>
    </div>
  );
};

export default Locations;
