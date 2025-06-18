import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import CarTable from "@/components/car/CarTable";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cars } from "@/lib/data";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as utils from "../lib/utils"; // classNames helper
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";

const Cars = () => {
  const [showAddCarDialog, setShowAddCarDialog] = useState(false);
  const [showUpdateCarDialog, setShowUpdateCarDialog] = useState(false);
  const [carList, setCarList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const [carStatusFilter, setCarStatusFilter] = useState("all");
  const [carCategoryFilter, setCarCategoryFilter] = useState("all");
  const [carSortBy, setCarSortBy] = useState("newest");
  const [isUpdating, setIsUpdating] = useState(false);


  const [vehicleData, setVehicleData] = useState({
    name: "",
    license: "",
    category: 0,
    status: "",
    description: "",
    short_bio: "",
    fleet: 0,
    year: 0,
    gearbox: "",
    trasmission_type: "",
    max_passengers: 0,
    max_luggage: "",
    mileage: 0,
    fuel: "",
    fuel_usage: "",
    engine_capacity: "",
    Doors: 0,
    colors: "",
    feature1_heading: "",
    feature2_heading: "",
    feature3_heading: "",
    feature4_heading: "",
    feature1_desc: "",
    feature2_desc: "",
    feature3_desc: "",
    feature4_desc: "",
    pricePerDay: "",
    pricePerWeek: "",
    securityDeposit: "",
    pricePerMonth: "",
  });

  const [updateVehicleID, setUpdateVehicleID] = useState(0);
  const [updateVehicleData, setUpdateVehicleData] = useState({
    model: "",
    license_plate: "",
    category: 0,
    categoryId: 0,
    status: "",
    description: "",
    short_bio: "",
    avail_fleets: 0,
    year: 0,
    gearbox: "",
    trasmission_type: "",
    max_passengers: 0,
    max_luggage: "",
    day_mileage: 0,
    fuel: "",
    fuel_usage: "",
    engine_capacity: "",
    Doors: 0,
    colors: "",
    feature1_heading: "",
    feature2_heading: "",
    feature3_heading: "",
    feature4_heading: "",
    feature1_desc: "",
    feature2_desc: "",
    feature3_desc: "",
    feature4_desc: "",
    daily_rate: "",
    weeky_rate: "",
    security_desposit: "",
    monthly_rate: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [updateErrors, setUpdateErrors] = useState<any>({});
  const [images, setImages] = useState<File[]>([]);

  // Amenities #1
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Amenities #2
  const [suggestions2, setSuggestions2] = useState<string[]>([]);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [typingTimeout2, setTypingTimeout2] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef2 = useRef<HTMLDivElement | null>(null);

  // Amenities #3
  const [suggestions3, setSuggestions3] = useState<string[]>([]);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [typingTimeout3, setTypingTimeout3] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef3 = useRef<HTMLDivElement | null>(null);

  // Amenities #4
  const [suggestions4, setSuggestions4] = useState<string[]>([]);
  const [showDropdown4, setShowDropdown4] = useState(false);
  const [typingTimeout4, setTypingTimeout4] = useState<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef4 = useRef<HTMLDivElement | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);


  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarAmenities`);
      const result = await res.json();
      console.log("AMENITIES: ", result);
      const features = result?.data?.flatMap(item => [
        item.feature1_heading,
        item.feature2_heading,
        item.feature3_heading,
        item.feature4_heading,
      ])
      const uniqueFeatures = [...new Set(features)] as any; // Remove Duplicates
      setSuggestions(uniqueFeatures);
      setSuggestions(features || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };
  const fetchSuggestions2 = async (query: string) => {
    if (!query) return setSuggestions2([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarAmenities`);
      const result = await res.json();
      console.log("AMENITIES: ", result);
      const features = result?.data?.flatMap(item => [
        item.feature1_heading,
        item.feature2_heading,
        item.feature3_heading,
        item.feature4_heading,
      ])
      const uniqueFeatures = [...new Set(features)] as any; // Remove Duplicates
      setSuggestions2(uniqueFeatures);
      setSuggestions2(features || []);
      setShowDropdown2(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };
  const fetchSuggestions3 = async (query: string) => {
    if (!query) return setSuggestions3([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarAmenities`);
      const result = await res.json();
      console.log("AMENITIES: ", result);
      const features = result?.data?.flatMap(item => [
        item.feature1_heading,
        item.feature2_heading,
        item.feature3_heading,
        item.feature4_heading,
      ])
      const uniqueFeatures = [...new Set(features)] as any; // Remove Duplicates
      setSuggestions3(uniqueFeatures);
      setSuggestions3(features || []);
      setShowDropdown3(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };
  const fetchSuggestions4 = async (query: string) => {
    if (!query) return setSuggestions4([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCarAmenities`);
      const result = await res.json();
      console.log("AMENITIES: ", result);
      const features = result?.data?.flatMap(item => [
        item.feature1_heading,
        item.feature2_heading,
        item.feature3_heading,
        item.feature4_heading,
      ])
      const uniqueFeatures = [...new Set(features)] as any; // Remove Duplicates
      setSuggestions4(uniqueFeatures);
      setSuggestions4(features || []);
      setShowDropdown4(true);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleData({ ...vehicleData, feature1_heading: value });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 400); // 400ms debounce

    setTypingTimeout(timeout);
  };
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleData({ ...vehicleData, feature2_heading: value });

    if (typingTimeout2) clearTimeout(typingTimeout2);

    const timeout = setTimeout(() => {
      fetchSuggestions2(value);
    }, 400); // 400ms debounce

    setTypingTimeout2(timeout);
  };
  const handleInputChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleData({ ...vehicleData, feature3_heading: value });

    if (typingTimeout3) clearTimeout(typingTimeout3);

    const timeout = setTimeout(() => {
      fetchSuggestions3(value);
    }, 400); // 400ms debounce

    setTypingTimeout3(timeout);
  };
  const handleInputChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleData({ ...vehicleData, feature4_heading: value });

    if (typingTimeout4) clearTimeout(typingTimeout4);

    const timeout = setTimeout(() => {
      fetchSuggestions4(value);
    }, 400); // 400ms debounce

    setTypingTimeout4(timeout);
  };

  const handleSelectSuggestion = (text: string) => {
    setVehicleData({ ...vehicleData, feature1_heading: text });
    setShowDropdown(false);
  };
  const handleSelectSuggestion2 = (text: string) => {
    setVehicleData({ ...vehicleData, feature2_heading: text });
    setShowDropdown2(false);
  };
  const handleSelectSuggestion3 = (text: string) => {
    setVehicleData({ ...vehicleData, feature3_heading: text });
    setShowDropdown3(false);
  };
  const handleSelectSuggestion4 = (text: string) => {
    setVehicleData({ ...vehicleData, feature4_heading: text });
    setShowDropdown4(false);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdateVehicleData({ ...updateVehicleData, feature1_heading: value });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 400); // 400ms debounce

    setTypingTimeout(timeout);
  };
  const handleUpdateChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdateVehicleData({ ...updateVehicleData, feature2_heading: value });

    if (typingTimeout2) clearTimeout(typingTimeout2);

    const timeout = setTimeout(() => {
      fetchSuggestions2(value);
    }, 400); // 400ms debounce

    setTypingTimeout2(timeout);
  };
  const handleUpdateChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdateVehicleData({ ...updateVehicleData, feature3_heading: value });

    if (typingTimeout3) clearTimeout(typingTimeout3);

    const timeout = setTimeout(() => {
      fetchSuggestions3(value);
    }, 400); // 400ms debounce

    setTypingTimeout3(timeout);
  };
  const handleUpdateChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpdateVehicleData({ ...updateVehicleData, feature4_heading: value });

    if (typingTimeout4) clearTimeout(typingTimeout4);

    const timeout = setTimeout(() => {
      fetchSuggestions4(value);
    }, 400); // 400ms debounce

    setTypingTimeout4(timeout);
  };

  const handleUpdateSuggestion = (text: string) => {
    setUpdateVehicleData({ ...updateVehicleData, feature1_heading: text });
    setShowDropdown(false);
  };
  const handleUpdateSuggestion2 = (text: string) => {
    setUpdateVehicleData({ ...updateVehicleData, feature2_heading: text });
    setShowDropdown2(false);
  };
  const handleUpdateSuggestion3 = (text: string) => {
    setUpdateVehicleData({ ...updateVehicleData, feature3_heading: text });
    setShowDropdown3(false);
  };
  const handleUpdateSuggestion4 = (text: string) => {
    setUpdateVehicleData({ ...updateVehicleData, feature4_heading: text });
    setShowDropdown4(false);
  };

  const fetchCar = async (id: number) => {
    console.log("MODAL TRIGGERED: ", id);
    if (id !== 0) {
      const car = await fetch(`${import.meta.env.VITE_API_URL}/getCar/${id}`);
      const res = await car.json();
      setUpdateVehicleData(res.data[0]);
      console.log("Update Vehicle Data: ", res);
    }
  }
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Amenities 1
  useEffect(() => {
    const handleClickOutside2 = (event: MouseEvent) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target as Node)) {
        setShowDropdown2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside2);
    return () => document.removeEventListener("mousedown", handleClickOutside2);
  }, []); // Amenities 2
  useEffect(() => {
    const handleClickOutside3 = (event: MouseEvent) => {
      if (dropdownRef3.current && !dropdownRef3.current.contains(event.target as Node)) {
        setShowDropdown3(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside3);
    return () => document.removeEventListener("mousedown", handleClickOutside3);
  }, []); // Amenities 3
  useEffect(() => {
    const handleClickOutside4 = (event: MouseEvent) => {
      if (dropdownRef4.current && !dropdownRef4.current.contains(event.target as Node)) {
        setShowDropdown4(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside4);
    return () => document.removeEventListener("mousedown", handleClickOutside4);
  }, []); // Amenities 4
  useEffect(() => {
    fetchCar(updateVehicleID);
  }, [updateVehicleID]); // Fetching Car to Update

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    setImages((prevImages) => {
      const remainingSlots = 5 - prevImages.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      // Add new previews as well
      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

      return [...prevImages, ...filesToAdd];
    });
  };
  const handleFileChangeForUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    setImages((prevImages) => {
      const remainingSlots = 5 - prevImages.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      // Add new previews as well
      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

      return [...prevImages, ...filesToAdd];
    });
  };
  const getCarsList = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getCarsList`);
    const data = await response.json();
    console.log("CARLIST: ", data);
    setCarList(data?.data);
  }
  const filteredCars = useMemo(() => {
    let base = Array.isArray(carList) ? [...carList] : [];

    // Status filter
    if (carStatusFilter !== "all") {
      base = base.filter(car => car?.status === carStatusFilter);
    }

    // Category filter
    if (carCategoryFilter !== "all") {
      base = base.filter(car => car?.category === carCategoryFilter);
    }

    // Search filter
    if (carSearchTerm.trim()) {
      const term = carSearchTerm.toLowerCase();
      base = base.filter(car =>
        [car?.make, car?.model, car?.licensePlate, car?.ownerName]
          .some(field => field?.toLowerCase().includes(term))
      );
    }

    // Sorting
    switch (carSortBy) {
      // case "newest":
      //   base.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      //   break;
      // case "oldest":
      //   base.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      //   break;
      case "price_high":
        base.sort((a, b) => b.daily_rate - a.daily_rate);
        break;
      case "price_low":
        base.sort((a, b) => a.daily_rate - b.daily_rate);
        break;
      // case "rating":
      //   base.sort((a, b) => b.rating - a.rating);
      //   break;
      default:
        break;
    }

    return base;
  }, [carList, carSearchTerm, carStatusFilter, carCategoryFilter, carSortBy]);
  const carCounts = useMemo(() => {
    const total = carList?.length || 0;

    let available = 0;
    let booked = 0;
    let maintenance = 0;

    if (Array.isArray(carList)) {
      for (const car of carList) {
        switch (car.status) {
          case "Available":
            available++;
            break;
          case "Booked":
            booked++;
            break;
          case "Maintenance":
            maintenance++;
            break;
          default:
            break;
        }
      }
    }

    return { total, available, booked, maintenance };
  }, [carList]);


  const getCategoryList = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getCategories`);
    const data = await response.json();
    console.log("CATEGORIES: ", data);
    setCategoryList(data?.data);
  }
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPreviews((prev) => {
      // revoke the object URL
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  useEffect(() => {
    getCarsList();
    getCategoryList();
  }, []); // Fetching Car List & Category List on Component Load

  const handleSubmit = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!vehicleData.name) newErrors.name = "Vehicle name is required";
    if (!vehicleData.license) newErrors.license = "License is required";
    if (!vehicleData.category) newErrors.category = "Category is required";
    if (!vehicleData.status) newErrors.status = "Status is required";
    if (!vehicleData.description) newErrors.description = "Description is required";
    if (!vehicleData.short_bio) newErrors.short_bio = "Bio is required";
    if (!vehicleData.fleet) newErrors.fleet = "Fleet is required";
    if (!vehicleData.year) newErrors.year = "Year is required";
    if (!vehicleData.gearbox) newErrors.gearbox = "Gearbox is required";
    if (!vehicleData.trasmission_type) newErrors.trasmission_type = "Transmission Type is required";
    if (!vehicleData.max_passengers) newErrors.max_passengers = "Max Passengers is required";
    if (!vehicleData.max_luggage) newErrors.max_luggage = "Max Luggage is required";
    if (!vehicleData.mileage) newErrors.milage = "Milage is required";
    if (!vehicleData.fuel) newErrors.fuel = "Fuel is required";
    if (!vehicleData.fuel_usage) newErrors.fuel_usage = "Fuel Usage is required";
    if (!vehicleData.engine_capacity) newErrors.engine_capacity = "Engine Capacity is required";
    if (!vehicleData.Doors) newErrors.Doors = "Doors are required";
    if (!vehicleData.colors) newErrors.colors = "Colors are required";
    if (!vehicleData.feature1_heading) newErrors.feature1_heading = "Amenity #1 is required";
    if (!vehicleData.feature2_heading) newErrors.feature2_heading = "Amenity #2 is required";
    if (!vehicleData.feature3_heading) newErrors.feature3_heading = "Amenity #3 is required";
    if (!vehicleData.feature4_heading) newErrors.feature4_heading = "Amenity #4 is required";
    if (!vehicleData.feature1_desc) newErrors.feature1_desc = "Description #1 is required";
    if (!vehicleData.feature2_desc) newErrors.feature2_desc = "Description #2 is required";
    if (!vehicleData.feature3_desc) newErrors.feature3_desc = "Description #3 is required";
    if (!vehicleData.feature4_desc) newErrors.feature4_desc = "Description #4 is required";
    if (!vehicleData.pricePerDay) newErrors.pricePerDay = "Price per day is required";
    if (!vehicleData.pricePerWeek) newErrors.pricePerWeek = "Price per week is required";
    if (!vehicleData.securityDeposit) newErrors.securityDeposit = "Security deposit is required";
    if (!vehicleData.pricePerMonth) newErrors.pricePerMonth = "Price per month is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Construct form data
    const formData = new FormData();
    Object.entries(vehicleData).forEach(([key, value]) => {
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      formData.append(key, formattedValue);
      // formData.append(key, value);
    });
    images.forEach(file => formData.append("images", file));

    try {
      console.log("POST DATA: ", formData);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addCar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setVehicleData({
        name: "",
        license: "",
        category: 0,
        status: "",
        description: "",
        short_bio: "",
        fleet: 0,
        year: 0,
        gearbox: "",
        trasmission_type: "",
        max_passengers: 0,
        max_luggage: "",
        mileage: 0,
        fuel: "",
        fuel_usage: "",
        engine_capacity: "",
        Doors: 0,
        colors: "",
        feature1_heading: "",
        feature2_heading: "",
        feature3_heading: "",
        feature4_heading: "",
        feature1_desc: "",
        feature2_desc: "",
        feature3_desc: "",
        feature4_desc: "",
        pricePerDay: "",
        pricePerWeek: "",
        securityDeposit: "",
        pricePerMonth: "",
      });

      if (!res.ok) throw new Error("Failed to save vehicle");
      setShowAddCarDialog(false); // Close dialog
      toast.success("Car Added Successfully!");
      setPreviews([]);
      setImages([]);
      getCarsList();
      // Optionally reset form and show toast
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to add car!");
      // Show error to user
    }
  };
  const handleUpdate = async () => {
    const newErrors: any = {};

    // Basic validation
    if (!updateVehicleData.model) newErrors.name = "Vehicle name is required";
    if (!updateVehicleData.license_plate) newErrors.license = "License is required";
    if (!updateVehicleData.category) newErrors.category = "Category is required";
    if (!updateVehicleData.status) newErrors.status = "Status is required";
    if (!updateVehicleData.description) newErrors.description = "Description is required";
    if (!updateVehicleData.short_bio) newErrors.short_bio = "Bio is required";
    if (!updateVehicleData.avail_fleets) newErrors.avail_fleets = "Fleet is required";
    if (!updateVehicleData.year) newErrors.year = "Year is required";
    if (!updateVehicleData.gearbox) newErrors.gearbox = "Gearbox is required";
    if (!updateVehicleData.trasmission_type) newErrors.trasmission_type = "Transmission Type is required";
    if (!updateVehicleData.max_passengers) newErrors.max_passengers = "Max Passengers is required";
    if (!updateVehicleData.max_luggage) newErrors.max_luggage = "Max Luggage is required";
    if (!updateVehicleData.day_mileage) newErrors.day_mileage = "Milage is required";
    if (!updateVehicleData.fuel) newErrors.fuel = "Fuel is required";
    if (!updateVehicleData.fuel_usage) newErrors.fuel_usage = "Fuel Usage is required";
    if (!updateVehicleData.engine_capacity) newErrors.engine_capacity = "Engine Capacity is required";
    if (!updateVehicleData.Doors) newErrors.Doors = "Doors are required";
    if (!updateVehicleData.colors) newErrors.colors = "Colors are required";
    if (!updateVehicleData.feature1_heading) newErrors.feature1_heading = "Amenity #1 is required";
    if (!updateVehicleData.feature2_heading) newErrors.feature2_heading = "Amenity #2 is required";
    if (!updateVehicleData.feature3_heading) newErrors.feature3_heading = "Amenity #3 is required";
    if (!updateVehicleData.feature4_heading) newErrors.feature4_heading = "Amenity #4 is required";
    if (!updateVehicleData.feature1_desc) newErrors.feature1_desc = "Description #1 is required";
    if (!updateVehicleData.feature2_desc) newErrors.feature2_desc = "Description #2 is required";
    if (!updateVehicleData.feature3_desc) newErrors.feature3_desc = "Description #3 is required";
    if (!updateVehicleData.feature4_desc) newErrors.feature4_desc = "Description #4 is required";
    if (!updateVehicleData.daily_rate) newErrors.pricePerDay = "Price per day is required";
    if (!updateVehicleData.weeky_rate) newErrors.pricePerWeek = "Price per week is required";
    if (!updateVehicleData.security_desposit) newErrors.securityDeposit = "Security deposit is required";
    if (!updateVehicleData.monthly_rate) newErrors.pricePerMonth = "Price per month is required";

    setUpdateErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Construct form data
    const formData = new FormData();
    Object.entries(updateVehicleData).forEach(([key, value]) => {
      // formData.append(key, value);
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      formData.append(key, formattedValue);
    });
    images.forEach(file => formData.append("images", file));

    try {
      setIsUpdating(true);
      console.log("POST DATA: ", formData);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateCar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setUpdateVehicleData({
        model: "",
        license_plate: "",
        category: 0,
        categoryId: 0,
        status: "",
        description: "",
        short_bio: "",
        avail_fleets: 0,
        year: 0,
        gearbox: "",
        trasmission_type: "",
        max_passengers: 0,
        max_luggage: "",
        day_mileage: 0,
        fuel: "",
        fuel_usage: "",
        engine_capacity: "",
        Doors: 0,
        colors: "",
        feature1_heading: "",
        feature2_heading: "",
        feature3_heading: "",
        feature4_heading: "",
        feature1_desc: "",
        feature2_desc: "",
        feature3_desc: "",
        feature4_desc: "",
        daily_rate: "",
        weeky_rate: "",
        security_desposit: "",
        monthly_rate: "",
      });

      if (!res.ok) throw new Error("Failed to save vehicle");
      setShowUpdateCarDialog(false); // Close dialog
      getCarsList();
      getCategoryList();
      toast.success("Car Updated Successfully!");
      // Optionally reset form and show toast
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to update car!");
      // Show error to user
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Car Fleet Management</h1>
          <p className="text-gray-600">Manage your vehicles, track status, and add new cars to your fleet.</p>
        </div>
        {/* ADD CAR DIALOG */}
        <Dialog open={showAddCarDialog} onOpenChange={setShowAddCarDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-name">Vehicle Name</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.name}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="vehicle-name"
                              placeholder="e.g. BMW M4"
                              value={vehicleData.name}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, name: e.target.value })
                              }
                              className={utils.cn(errors.name && "border-red-500")}
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
                  <div className="space-y-2">
                    <Label htmlFor="license">License Plate</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.license}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="license"
                              placeholder="e.g. ABC 123"
                              value={vehicleData.license}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, license: e.target.value })
                              }
                              className={utils.cn(errors.license && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.license}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.category}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Select value={vehicleData.category as any} onValueChange={(val) => setVehicleData({ ...vehicleData, category: val as any })}>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(categoryList) && categoryList?.map(car => (
                                  <SelectItem key={car.category} value={car.id}>{car.category}</SelectItem>
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
                          {errors.category}
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
                            <Select value={vehicleData.status} onValueChange={(val) => setVehicleData({ ...vehicleData, status: val })}>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="Booked">Booked</SelectItem>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Bio</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.short_bio}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="description"
                              placeholder="e.g. Short Bio"
                              value={vehicleData.short_bio}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, short_bio: e.target.value })
                              }
                              className={utils.cn(errors.short_bio && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.short_bio}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Available Fleet</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.fleet}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="description"
                              type="number"
                              placeholder="0"
                              value={vehicleData.fleet}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, fleet: e.target.value as any })
                              }
                              className={utils.cn(errors.fleet && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.fleet}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.description}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="description"
                            placeholder="e.g. Car Details"
                            value={vehicleData.description}
                            onChange={(e) =>
                              setVehicleData({ ...vehicleData, description: e.target.value })
                            }
                            className={utils.cn(errors.description && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.description}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.year}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="year"
                              type="number"
                              placeholder="e.g. 2015"
                              value={vehicleData.year}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, year: e.target.value as any })
                              }
                              className={utils.cn(errors.year && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.year}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gearbox">Gearbox</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.gearbox}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="gearbox"
                              placeholder="e.g. Gearbox"
                              value={vehicleData.gearbox}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, gearbox: e.target.value })
                              }
                              className={utils.cn(errors.gearbox && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.gearbox}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Transmission Type</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!errors.trasmission_type}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="doors"
                            placeholder="e.g. Automatic"
                            value={vehicleData.trasmission_type}
                            onChange={(e) =>
                              setVehicleData({ ...vehicleData, trasmission_type: e.target.value })
                            }
                            className={utils.cn(errors.colors && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {errors.trasmission_type}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-passengers">Max Passengers</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.max_passengers}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="max-passengers"
                              placeholder="e.g. Automatic"
                              type="number"
                              value={vehicleData.max_passengers}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, max_passengers: e.target.value as any })
                              }
                              className={utils.cn(errors.max_passengers && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.max_passengers}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-luggage">Max Luggage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.max_luggage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="max-luggage"
                              placeholder="e.g. 400 L"
                              value={vehicleData.max_luggage}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, max_luggage: e.target.value })
                              }
                              className={utils.cn(errors.max_luggage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.max_luggage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.mileage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="mileage"
                              type="number"
                              placeholder="e.g. 100"
                              value={vehicleData.mileage}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, mileage: e.target.value as any })
                              }
                              className={utils.cn(errors.mileage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.mileage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.fuel}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="fuel"
                              placeholder="e.g. Petrol"
                              value={vehicleData.fuel}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, fuel: e.target.value })
                              }
                              className={utils.cn(errors.fuel && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.fuel}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuel-usage">Fuel Usage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.mileage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="fuel-usage"
                              placeholder="e.g. 0-100km/h"
                              value={vehicleData.fuel_usage}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, fuel_usage: e.target.value })
                              }
                              className={utils.cn(errors.fuel_usage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.fuel_usage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-capacity">Engine Capacity</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.engine_capacity}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="engine-capacity"
                              placeholder="e.g. 280km/h"
                              value={vehicleData.engine_capacity}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, engine_capacity: e.target.value })
                              }
                              className={utils.cn(errors.engine_capacity && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.engine_capacity}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.Doors}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="doors"
                              placeholder="e.g. 5"
                              type="number"
                              value={vehicleData.Doors}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, Doors: e.target.value as any })
                              }
                              className={utils.cn(errors.Doors && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.Doors}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doors">Colors</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.colors}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="doors"
                              placeholder="e.g. White, Black"
                              value={vehicleData.colors}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, colors: e.target.value })
                              }
                              className={utils.cn(errors.colors && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.colors}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="information" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amenity1">Amenity #1</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature1_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef}>
                            <Input
                              id="amenity1"
                              placeholder="e.g. Camera"
                              value={vehicleData.feature1_heading}
                              onChange={handleInputChange}
                              className={utils.cn(errors.feature1_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown && suggestions?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                  >
                                    {suggestion}
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
                          {errors.feature1_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenity2">Amenity #2</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature2_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef2}>
                            <Input
                              id="amenity2"
                              placeholder="e.g. A/C"
                              value={vehicleData.feature2_heading}
                              onChange={handleInputChange2}
                              className={utils.cn(errors.feature2_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown2 && suggestions2?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions2?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectSuggestion2(suggestion)}
                                  >
                                    {suggestion}
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
                          {errors.feature2_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature1_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={vehicleData.feature1_desc}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, feature1_desc: e.target.value })
                              }
                              className={utils.cn(errors.feature1_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.feature1_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature2_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={vehicleData.feature2_desc}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, feature2_desc: e.target.value })
                              }
                              className={utils.cn(errors.feature2_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.feature2_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amenity3">Amenity #3</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature3_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef3}>
                            <Input
                              id="amenity3"
                              placeholder="e.g. Seat Tabs"
                              value={vehicleData.feature3_heading}
                              onChange={handleInputChange3}
                              className={utils.cn(errors.feature3_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown3 && suggestions3?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions3?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectSuggestion3(suggestion)}
                                  >
                                    {suggestion}
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
                          {errors.feature3_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenity4">Amenity #4</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature4_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef4}>
                            <Input
                              id="amenity4"
                              placeholder="e.g. Sun Roof"
                              value={vehicleData.feature4_heading}
                              onChange={handleInputChange4}
                              className={utils.cn(errors.feature4_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown4 && suggestions4?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions3?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectSuggestion4(suggestion)}
                                  >
                                    {suggestion}
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
                          {errors.feature4_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature3_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={vehicleData.feature3_desc}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, feature3_desc: e.target.value })
                              }
                              className={utils.cn(errors.feature3_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.feature3_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.feature4_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={vehicleData.feature4_desc}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, feature4_desc: e.target.value })
                              }
                              className={utils.cn(errors.feature4_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.feature4_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-per-day">Price Per Day (AED)</Label>
                    {/* <Input
                      id="price-per-day"
                      placeholder="0.00"
                      value={vehicleData.pricePerDay}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.pricePerDay}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-day"
                              placeholder="0.00"
                              type="number"
                              value={vehicleData.pricePerDay}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, pricePerDay: e.target.value })
                              }
                              className={utils.cn(errors.pricePerDay && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.pricePerDay}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    {/* <Input id="price-per-day" type="number" placeholder="0.00" /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-per-week">Price Per Week (AED)</Label>
                    {/* <Input
                      id="price-per-week"
                      placeholder="0.00"
                      value={vehicleData.pricePerWeek}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.pricePerWeek}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-week"
                              type="number"
                              placeholder="0.00"
                              value={vehicleData.pricePerWeek}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, pricePerWeek: e.target.value })
                              }
                              className={utils.cn(errors.pricePerWeek && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.pricePerWeek}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    {/* <Input id="price-per-week" type="number" placeholder="0.00" /> */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="security-deposit">Security Deposit (AED)</Label>
                    {/* <Input id="security-deposit" type="number" placeholder="0.00" /> */}
                    {/* <Input
                      id="security-deposit"
                      placeholder="0.00"
                      value={vehicleData.securityDeposit}
                      onChange={(e) => setVehicleData({ ...vehicleData, securityDeposit: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.securityDeposit}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="security-deposit"
                              placeholder="0.00"
                              type="number"
                              value={vehicleData.securityDeposit}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, securityDeposit: e.target.value })
                              }
                              className={utils.cn(errors.securityDeposit && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.securityDeposit}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-per-month">Price Per Month (AED)</Label>
                    {/* <Input id="price-per-month" type="number" placeholder="0.00" /> */}
                    {/* <Input
                      id="vehicle-name"
                      placeholder="price-per-month"
                      value={vehicleData.pricePerMonth}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!errors.pricePerMonth}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-month"
                              placeholder="0.00"
                              type="number"
                              value={vehicleData.pricePerMonth}
                              onChange={(e) =>
                                setVehicleData({ ...vehicleData, pricePerMonth: e.target.value })
                              }
                              className={utils.cn(errors.pricePerMonth && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {errors.pricePerMonth}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="space-y-4 pt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />

                <div
                  onClick={() => previews.length < 5 && fileInputRef.current?.click()}
                  className={utils.cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    previews.length < 5
                      ? "cursor-pointer border-gray-300 hover:border-gray-400"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                  )}
                >
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

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-900 transition"
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddCarDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Vehicle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* UPDATE CAR DIALOG */}
        <Dialog open={showUpdateCarDialog} onOpenChange={setShowUpdateCarDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Vehicle</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-name">Vehicle Name</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.model}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="vehicle-name"
                              placeholder="e.g. BMW M4"
                              value={updateVehicleData.model}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, model: e.target.value })
                              }
                              className={utils.cn(updateErrors.model && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.model}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">License Plate</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.license_plate}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="license"
                              placeholder="e.g. ABC 123"
                              value={updateVehicleData.license_plate}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, license_plate: e.target.value })
                              }
                              className={utils.cn(errors.license && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.license_plate}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.categoryId}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Select value={updateVehicleData.categoryId as any} onValueChange={(val) => {
                              setUpdateVehicleData({ ...updateVehicleData, category: val as any })
                              setUpdateVehicleData({ ...updateVehicleData, categoryId: val as any })
                            }}>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(categoryList) && categoryList?.map(car => (
                                  <SelectItem key={car.category} value={car.id}>{car.category}</SelectItem>
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
                          {updateErrors.categoryId}
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
                            <Select value={updateVehicleData.status} onValueChange={(val) => setUpdateVehicleData({ ...updateVehicleData, status: val })}>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="Booked">Booked</SelectItem>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Bio</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.short_bio}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="description"
                              placeholder="e.g. Short Bio"
                              value={updateVehicleData.short_bio}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, short_bio: e.target.value })
                              }
                              className={utils.cn(updateErrors.short_bio && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.short_bio}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Available Fleet</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.avail_fleets}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="description"
                              type="number"
                              placeholder="0"
                              value={updateVehicleData.avail_fleets}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, avail_fleets: e.target.value as any })
                              }
                              className={utils.cn(updateErrors.avail_fleets && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.avail_fleets}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!updateErrors.description}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="description"
                            placeholder="e.g. Car Details"
                            value={updateVehicleData.description}
                            onChange={(e) =>
                              setUpdateVehicleData({ ...updateVehicleData, description: e.target.value })
                            }
                            className={utils.cn(updateErrors.description && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {updateErrors.description}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.year}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="year"
                              type="number"
                              placeholder="e.g. 2015"
                              value={updateVehicleData.year}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, year: e.target.value as any })
                              }
                              className={utils.cn(updateErrors.year && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.year}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gearbox">Gearbox</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.gearbox}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="gearbox"
                              placeholder="e.g. Gearbox"
                              value={updateVehicleData.gearbox}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, gearbox: e.target.value })
                              }
                              className={utils.cn(updateErrors.gearbox && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.gearbox}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Transmission Type</Label>
                  <Tooltip.Provider>
                    <Tooltip.Root open={!!updateErrors.trasmission_type}>
                      <Tooltip.Trigger asChild>
                        <div>
                          <Input
                            id="doors"
                            placeholder="e.g. Automatic"
                            value={updateVehicleData.trasmission_type}
                            onChange={(e) =>
                              setUpdateVehicleData({ ...updateVehicleData, trasmission_type: e.target.value })
                            }
                            className={utils.cn(updateErrors.colors && "border-red-500")}
                          />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        align="start"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                      >
                        {updateErrors.trasmission_type}
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-passengers">Max Passengers</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.max_passengers}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="max-passengers"
                              placeholder="e.g. Automatic"
                              type="number"
                              value={updateVehicleData.max_passengers}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, max_passengers: e.target.value as any })
                              }
                              className={utils.cn(updateErrors.max_passengers && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.max_passengers}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-luggage">Max Luggage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.max_luggage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="max-luggage"
                              placeholder="e.g. 400 L"
                              value={updateVehicleData.max_luggage}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, max_luggage: e.target.value })
                              }
                              className={utils.cn(updateErrors.max_luggage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.max_luggage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.day_mileage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="mileage"
                              type="number"
                              placeholder="e.g. 100"
                              value={updateVehicleData.day_mileage}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, day_mileage: e.target.value as any })
                              }
                              className={utils.cn(updateErrors.day_mileage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.day_mileage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.fuel}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="fuel"
                              placeholder="e.g. Petrol"
                              value={updateVehicleData.fuel}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, fuel: e.target.value })
                              }
                              className={utils.cn(updateErrors.fuel && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.fuel}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuel-usage">Fuel Usage</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.fuel_usage}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="fuel-usage"
                              placeholder="e.g. 0-100km/h"
                              value={updateVehicleData.fuel_usage}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, fuel_usage: e.target.value })
                              }
                              className={utils.cn(updateErrors.fuel_usage && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.fuel_usage}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine-capacity">Engine Capacity</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.engine_capacity}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="engine-capacity"
                              placeholder="e.g. 280km/h"
                              value={updateVehicleData.engine_capacity}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, engine_capacity: e.target.value })
                              }
                              className={utils.cn(updateErrors.engine_capacity && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.engine_capacity}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.Doors}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="doors"
                              placeholder="e.g. 5"
                              type="number"
                              value={updateVehicleData.Doors}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, Doors: e.target.value as any })
                              }
                              className={utils.cn(updateErrors.Doors && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.Doors}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doors">Colors</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.colors}>
                        <Tooltip.Trigger asChild>
                          <div>
                            <Input
                              id="doors"
                              placeholder="e.g. White, Black"
                              value={updateVehicleData.colors}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, colors: e.target.value })
                              }
                              className={utils.cn(updateErrors.colors && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.colors}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="information" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amenity1">Amenity #1</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature1_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef}>
                            <Input
                              id="amenity1"
                              placeholder="e.g. Camera"
                              value={updateVehicleData.feature1_heading}
                              onChange={handleUpdateChange}
                              className={utils.cn(updateErrors.feature1_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown && suggestions?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleUpdateSuggestion(suggestion)}
                                  >
                                    {suggestion}
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
                          {updateErrors.feature1_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenity2">Amenity #2</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature2_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef2}>
                            <Input
                              id="amenity2"
                              placeholder="e.g. A/C"
                              value={updateVehicleData.feature2_heading}
                              onChange={handleUpdateChange2}
                              className={utils.cn(updateErrors.feature2_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown2 && suggestions2?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions2?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleUpdateSuggestion2(suggestion)}
                                  >
                                    {suggestion}
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
                          {updateErrors.feature2_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature1_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={updateVehicleData.feature1_desc}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, feature1_desc: e.target.value })
                              }
                              className={utils.cn(updateErrors.feature1_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.feature1_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature2_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={updateVehicleData.feature2_desc}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, feature2_desc: e.target.value })
                              }
                              className={utils.cn(updateErrors.feature2_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.feature2_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amenity3">Amenity #3</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature3_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef3}>
                            <Input
                              id="amenity3"
                              placeholder="e.g. Seat Tabs"
                              value={updateVehicleData.feature3_heading}
                              onChange={handleUpdateChange3}
                              className={utils.cn(updateErrors.feature3_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown3 && suggestions3?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions3?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleUpdateSuggestion3(suggestion)}
                                  >
                                    {suggestion}
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
                          {updateErrors.feature3_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenity4">Amenity #4</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature4_heading}>
                        <Tooltip.Trigger asChild>
                          <div className="relative" ref={dropdownRef4}>
                            <Input
                              id="amenity4"
                              placeholder="e.g. Sun Roof"
                              value={updateVehicleData.feature4_heading}
                              onChange={handleUpdateChange4}
                              className={utils.cn(updateErrors.feature4_heading && "border-red-500")}
                              autoComplete="off"
                            />

                            {/* Dropdown */}
                            {showDropdown4 && suggestions4?.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                                {suggestions3?.map((suggestion, idx) => (
                                  <div
                                    key={idx}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleUpdateSuggestion4(suggestion)}
                                  >
                                    {suggestion}
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
                          {updateErrors.feature4_heading}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature3_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={updateVehicleData.feature3_desc}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, feature3_desc: e.target.value })
                              }
                              className={utils.cn(updateErrors.feature3_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.feature3_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.feature4_desc}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="description"
                              placeholder="Description"
                              value={updateVehicleData.feature4_desc}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, feature4_desc: e.target.value })
                              }
                              className={utils.cn(updateErrors.feature4_desc && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.feature4_desc}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-per-day">Price Per Day (AED)</Label>
                    {/* <Input
                      id="price-per-day"
                      placeholder="0.00"
                      value={vehicleData.pricePerDay}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.pricePerDay}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-day"
                              placeholder="0.00"
                              value={updateVehicleData.daily_rate}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, daily_rate: e.target.value })
                              }
                              className={utils.cn(updateErrors.daily_rate && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.daily_rate}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    {/* <Input id="price-per-day" type="number" placeholder="0.00" /> */}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-per-week">Price Per Week (AED)</Label>
                    {/* <Input
                      id="price-per-week"
                      placeholder="0.00"
                      value={vehicleData.pricePerWeek}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.weeky_rate}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-week"
                              placeholder="0.00"
                              value={updateVehicleData.weeky_rate}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, weeky_rate: e.target.value })
                              }
                              className={utils.cn(updateErrors.weeky_rate && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.weeky_rate}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    {/* <Input id="price-per-week" type="number" placeholder="0.00" /> */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="security-deposit">Security Deposit (AED)</Label>
                    {/* <Input id="security-deposit" type="number" placeholder="0.00" /> */}
                    {/* <Input
                      id="security-deposit"
                      placeholder="0.00"
                      value={vehicleData.securityDeposit}
                      onChange={(e) => setVehicleData({ ...vehicleData, securityDeposit: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.security_desposit}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="security-deposit"
                              placeholder="0.00"
                              value={updateVehicleData.security_desposit}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, security_desposit: e.target.value })
                              }
                              className={utils.cn(updateErrors.security_desposit && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.security_desposit}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-per-month">Price Per Month (AED)</Label>
                    {/* <Input id="price-per-month" type="number" placeholder="0.00" /> */}
                    {/* <Input
                      id="vehicle-name"
                      placeholder="price-per-month"
                      value={vehicleData.pricePerMonth}
                      onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                    /> */}
                    <Tooltip.Provider>
                      <Tooltip.Root open={!!updateErrors.monthly_rate}>
                        <Tooltip.Trigger asChild>
                          <div>
                            {/* <Label htmlFor="vehicle-name">Vehicle Name</Label> */}
                            <Input
                              id="price-per-month"
                              placeholder="0.00"
                              value={updateVehicleData.monthly_rate}
                              onChange={(e) =>
                                setUpdateVehicleData({ ...updateVehicleData, monthly_rate: e.target.value })
                              }
                              className={utils.cn(updateErrors.monthly_rate && "border-red-500")}
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="top"
                          align="start"
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
                        >
                          {updateErrors.monthly_rate}
                          <Tooltip.Arrow className="fill-red-600" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="space-y-4 pt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  className="hidden"
                  multiple
                  onChange={handleFileChangeForUpdate}
                />

                <div
                  onClick={() => previews.length < 5 && fileInputRef.current?.click()}
                  className={utils.cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    previews.length < 5
                      ? "cursor-pointer border-gray-300 hover:border-gray-400"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                  )}
                >
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

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-900 transition"
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateCarDialog(false)}>
                Cancel
              </Button>
              {/* <Button onClick={handleUpdate}>Update Vehicle</Button> */}
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  'Update Vehicle'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge
            variant="outline"
            className={`cursor-pointer px-3 py-1 rounded-full ${
              carStatusFilter === "all" ? "bg-gray-100 text-gray-800" : "bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
            }`}
            onClick={() => setCarStatusFilter("all")}
          >
            All Vehicles ({carCounts.total})
          </Badge>
          <Badge className="cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-600" 
          onClick={() => setCarStatusFilter("Available")}>Available ({carCounts.available})</Badge>
          <Badge className="cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-600" 
          onClick={() => setCarStatusFilter("Booked")}>Booked ({carCounts.booked})</Badge>
          <Badge className="cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-600" 
          onClick={() => setCarStatusFilter("Maintenance")}>Maintenance ({carCounts.maintenance})</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              className="pl-10"
              placeholder="Search vehicles by name, license plate, etc."
              value={carSearchTerm}
              onChange={(e) => setCarSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select onValueChange={setCarCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="MPV">MPV</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setCarStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setCarSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem> */}
                <SelectItem value="all">Price: All</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                {/* <SelectItem value="rating">Rating</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Car Gallery */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Car Gallery</h2>
                <button onClick={() => setOpenModal(false)} className="text-gray-500 hover:text-black">
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.filter(Boolean).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Car ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <CarTable showHeader={false} setOpenModal={setOpenModal} setSelectedImages={setSelectedImages} carList={filteredCars} setShowUpdateCarDialog={setShowUpdateCarDialog} setUpdateVehicleID={setUpdateVehicleID} />
      </div>
    </div>
  );
};



export default Cars;
