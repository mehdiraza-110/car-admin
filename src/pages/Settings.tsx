import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building,
  CreditCard,
  Bell,
  Lock,
  Users2,
  Shield,
  HelpCircle,
  Languages,
  BellRing,
  Mail,
  Smartphone,
  Clock,
  PaintBucket,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";

const Settings = () => {
  type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  bio: string;
  timezone: string;
  is_active: boolean;
  avatarURL: string;
};
  // const [notificationSettings, setNotificationSettings] = useState({
  //   emailBookings: true,
  //   emailReports: true,
  //   emailMarketing: false,
  //   smsBookings: true,
  //   smsReminders: true,
  //   smsMarketing: false,
  //   pushNewFeatures: true,
  //   pushStatusUpdates: true,
  // });
  const [profile, setProfile] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    language: "en",
    timezone: "america_new_york",
    avatarURL: ""
  });
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "", // e.g. "Admin"
  });
  const roles = ["admin", "manager", "agent", "viewer"]; // Could be fetched from API
  const [teamMembers, setTeamMembers] = useState([]);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleInfo, setRoleInfo] = useState({ roleId: null, roleName: "", permissions: [] });
  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: false,
    emailReports: false,
    emailMarketing: false,
    pushNewFeatures: false,
    pushStatusUpdates: false,
  });

  const [name, setName] = useState("BADU Car Rentals");
  const [website, setWebsite] = useState("https://www.luxedrive.com");
  const [phone, setPhone] = useState("+1 (555) 987-6543");
  const [address, setAddress] = useState("123 Business Ave");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [zip, setZip] = useState("10001");
  const [country, setCountry] = useState("us");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyData, setCompanyData] = useState({
    name: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    state_province: "",
    zip_postal_code: "",
    country_code: "",
    logo_url: "",
  });
  const [countries, setCountries] = useState([]);
  const fetchCountries = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
      const data = await res.json();

      const sortedCountries = data
        .map((country) => ({
          name: country.name.common,
          code: country.cca2?.toLowerCase(), // e.g., "us"
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

      setCountries(sortedCountries);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };
  useEffect(() => {
    fetchCountries();
  }, []);

  const { user } = useAuth();
  const userId = user?.id;

  const fetchCompanyProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company-profile`);
      const data = await res.json();

      if (data.success) {
        console.log("COMPANY: ", data.profile);
        setCompanyData(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch company profile:", error);
    }
  };
  useEffect(() => {
    fetchCompanyProfile();
  }, []);


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // create preview URL
    }
  };


  const fetchNotificationSettings = async (userId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/notification-settings/${userId}`);
    const data = await res.json();
    if (data?.success) {
      setNotificationSettings(data.settings);
    }
  } catch (err) {
    console.error("Failed to fetch notification settings", err);
  }
};
  useEffect(() => {
    fetchNotificationSettings(userId);
  }, []);

  const fetchProfile = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include"
    });
    const data = await res.json();
    if (data?.user) {
      setProfile({
        id: data.user.id || 0,
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        passwordHash: data.user.passwordHash || "",
        bio: data.user.bio || "",
        is_active: data.user.is_active || false,
        timezone: data.user.timezone || "america_new_york",
        avatarURL: data.user.avatarURL || ""
      });
      setCurrentPassword(data.user.passwordHash);
    }
  };

  const fetchMembers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/getAllMembers`);
    const data = await res.json();
    setTeamMembers(data?.data);
    console.log("MEMBERS: ", data?.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  setUploadingAvatar(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/uploadAvatar`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();
    if (res.ok && data?.avatarURL) {
      setProfile((prev) => ({
        ...prev,
        avatarURL: data.avatarURL
      }));
      toast.success("Avatar updated!");
      console.log("new avatart URL: ", data.avatarURL);
    } else {
      toast.error("Avatar upload failed");
    }
  } catch (err) {
    toast.error("Upload error");
  } finally {
    setUploadingAvatar(false);
  }
};

const handleProfileSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/updateUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(profile)
  });

  const data = await res.json();
  if (res.ok) {
    toast.success("Profile updated successfully!");
  } else {
    toast.error(data?.message || "Failed to update profile");
  }
};
const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Password update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
};
const handleAddMember = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/addTeamMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });

    if (!res.ok) throw new Error("Failed to add member");

    fetchMembers();

    setIsAddModalOpen(false);
    setNewMember({ name: "", email: "", passwordHash: "", role: "" });
  } catch (error) {
    console.error("Error adding member:", error);
  }
};

const fetchPermissions = async (userId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/getRolePermissions/${userId}`);
    const data = await res.json();
    console.log("Permissions: ", data);
    if(data?.status == 401) {
      toast.error("")
      return;
    }
    setRoleInfo(data);
    setPermissionModalOpen(true);
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  }
};

const updatePermissions = async () => {
  try {
    const selectedRoutes = roleInfo.permissions
      .filter(p => p.assigned)
      .map(p => p.route);

    await fetch(`${import.meta.env.VITE_API_URL}/updateRolePermissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleId: roleInfo.roleId,
        routes: selectedRoutes,
      }),
    });

    setPermissionModalOpen(false);
    toast.success('Permissions updated!');
  } catch (error) {
    console.error("Failed to update permissions:", error);
    toast.error('Permissions couldnt be updated!');
  }
};

 const handleNotificationChange = async (key) => {
  const updatedSettings = {
    ...notificationSettings,
    [key]: !notificationSettings[key],
  };

  setNotificationSettings(updatedSettings); // instant UI feedback

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/notification-settings/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSettings),
    });
  } catch (err) {
    console.error("Failed to update notification settings", err);
  }
};

const handleSubmitCompany = async () => {
  const formData = new FormData();
  formData.append("name", companyData.name);
  formData.append("website", companyData.website);
  formData.append("phone", companyData.phone);
  formData.append("address", companyData.address);
  formData.append("city", companyData.city);
  formData.append("state", companyData.state_province);
  formData.append("zip", companyData.zip_postal_code);
  formData.append("country", companyData.country_code);

  if (logoFile) {
    formData.append("logo", logoFile); // name must match multer field
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/company-profile`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    toast.success("Company profile updated!");
  } else {
    toast.error("Failed to update profile.");
  }
};



  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {isAddModalOpen && (
        <AddTeamMemberModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddMember}
          member={newMember}
          setMember={setNewMember}
          roles={roles}
        />
      )}
      <PermissionsModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        roleInfo={roleInfo}
        setRoleInfo={setRoleInfo}
        onSave={updatePermissions}
      />


      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:space-x-1 h-auto p-1">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="billing"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger> */}
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Users2 className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="integrations"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <Shield className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger> */}
          {/* <TabsTrigger
            value="help"
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </TabsTrigger> */}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={profile.avatarURL ? profile.avatarURL : "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"}
                          alt="John Smith"
                        />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Smith"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@example.com"
                        value={profile.email}
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </div>
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Timezome</Label>
                      <Input
                        id="timezone"
                        placeholder="Timezone"
                        value={profile.timezone}
                        onChange={(e) =>
                          setProfile({ ...profile, timezone: e.target.value })
                        }
                      />
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              {/* <Button variant="outline">Cancel</Button> */}
              <Button onClick={handleProfileSubmit}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Manage your company details and business profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-24 w-24 rounded border flex items-center justify-center bg-gray-50 overflow-hidden">
                        {logoFile ? (
                          <img
                            src={URL.createObjectURL(logoFile)}
                            alt="Logo preview"
                            className="h-full w-full object-contain"
                          />
                        ) : companyData.logo_url ? (
                          <img
                            src={companyData.logo_url}
                            alt="Company logo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-primary font-heading font-bold">BADU</span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="logo-upload">Change Logo</label>
                      </Button>

                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="flex-grow space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        placeholder="BADU Car Rentals"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-website">Website</Label>
                      <Input
                        id="company-website"
                        placeholder="https://www.luxedrive.com"
                        value={companyData.website}
                        onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Business Phone</Label>
                      <Input
                        id="company-phone"
                        placeholder="+1 (555) 987-6543"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Business Address</Label>
                    <Input
                      id="company-address"
                      placeholder="123 Business Ave"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-city">City</Label>
                      <Input
                        id="company-city"
                        placeholder="New York"
                        value={companyData.city}
                        onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-state">State/Province</Label>
                      <Input
                        id="company-state"
                        placeholder="NY"
                        value={companyData.state_province}
                        onChange={(e) => setCompanyData({ ...companyData, state_province: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-zip">ZIP/Postal Code</Label>
                      <Input
                        id="company-zip"
                        placeholder="10001"
                        value={companyData.zip_postal_code}
                        onChange={(e) => setCompanyData({ ...companyData, zip_postal_code: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-country">Country</Label>
                      <Select value={companyData.country_code}
                       onValueChange={(value) => setCompanyData({ ...companyData, country_code: value })}>
                      <SelectTrigger id="company-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button onClick={handleSubmitCompany}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        {/* <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Premium Plan
                      </p>
                      <p className="text-sm text-gray-600">
                        Your plan renews on August 15, 2023
                      </p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm text-gray-500">Fleet Size</p>
                      <p className="font-semibold">50 vehicles</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm text-gray-500">Storage</p>
                      <p className="font-semibold">230 GB / 500 GB</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm text-gray-500">Team Members</p>
                      <p className="font-semibold">10 users</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="p-4 border rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 04/24</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium">
                      <div>Date</div>
                      <div>Description</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm">
                      <div>Jul 15, 2023</div>
                      <div>Premium Plan - Monthly</div>
                      <div>$199.00</div>
                      <div className="text-green-600">Paid</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm">
                      <div>Jun 15, 2023</div>
                      <div>Premium Plan - Monthly</div>
                      <div>$199.00</div>
                      <div className="text-green-600">Paid</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm">
                      <div>May 15, 2023</div>
                      <div>Premium Plan - Monthly</div>
                      <div>$199.00</div>
                      <div className="text-green-600">Paid</div>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 p-0 h-auto">
                    View All Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-500" />
                    Email Notifications
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Booking confirmations and updates
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive emails when bookings are created or modified
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailBookings}
                      onCheckedChange={() =>
                        handleNotificationChange("emailBookings")
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Reports and analytics</p>
                      <p className="text-sm text-gray-500">
                        Receive scheduled reports via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailReports}
                      onCheckedChange={() =>
                        handleNotificationChange("emailReports")
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Marketing and promotional emails
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailMarketing}
                      onCheckedChange={() =>
                        handleNotificationChange("emailMarketing")
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <BellRing className="h-5 w-5 mr-2 text-gray-500" />
                    Push Notifications
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">New features and updates</p>
                      <p className="text-sm text-gray-500">
                        Be notified when we release new features
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNewFeatures}
                      onCheckedChange={() =>
                        handleNotificationChange("pushNewFeatures")
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Status updates</p>
                      <p className="text-sm text-gray-500">
                        Receive push notifications for status changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushStatusUpdates}
                      onCheckedChange={() =>
                        handleNotificationChange("pushStatusUpdates")
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and access settings.
                </CardDescription>
              </CardHeader>
             <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      // onChange={(e) => setCurrentPassword(e.target.value)}
                      readOnly={true}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-gray-500"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-gray-500"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-gray-500"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Button className="mt-2" onClick={updatePassword}>
                    Update Password
                  </Button>
                </div>
              </div>
             </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team and their access permissions.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>Add Team Member</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium">
                    <div className="col-span-2">Name</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {Array.isArray(teamMembers) && teamMembers?.map((member, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 p-4 border-b"
                    >
                      <div className="col-span-2 flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={member.avatar ? member.avatar : "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"}
                          alt="John Smith"
                        />
                          <AvatarFallback>
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.firstName}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">{member.roles}</div>
                      <div className="flex items-center">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {member.is_active == 1 ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUserId(member.user_id); // or member.id based on your data
                            fetchPermissions(member.user_id);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <PaintBucket className="h-5 w-5 mr-2 text-gray-500" />
                    Theme Settings
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 transition-all hover:border-primary">
                      <div className="w-full h-24 bg-white rounded mb-2 flex items-center justify-center border">
                        <span className="text-sm font-medium">Light Mode</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="theme-light">Light Theme</Label>
                        <input
                          type="radio"
                          id="theme-light"
                          name="theme"
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 transition-all hover:border-primary">
                      <div className="w-full h-24 bg-gray-900 rounded mb-2 flex items-center justify-center border">
                        <span className="text-sm font-medium text-white">
                          Dark Mode
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="theme-dark">Dark Theme</Label>
                        <input
                          type="radio"
                          id="theme-dark"
                          name="theme"
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 transition-all hover:border-primary">
                      <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 rounded mb-2 flex items-center justify-center border">
                        <span className="text-sm font-medium">
                          System Default
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="theme-system">System Preference</Label>
                        <input
                          type="radio"
                          id="theme-system"
                          name="theme"
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <Languages className="h-5 w-5 mr-2 text-gray-500" />
                    Language & Format
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="america_new_york">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_new_york">
                            America/New York
                          </SelectItem>
                          <SelectItem value="america_los_angeles">
                            America/Los Angeles
                          </SelectItem>
                          <SelectItem value="america_chicago">
                            America/Chicago
                          </SelectItem>
                          <SelectItem value="europe_london">
                            Europe/London
                          </SelectItem>
                          <SelectItem value="asia_tokyo">Asia/Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    Display Settings
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-gray-500">
                        Show more content with less spacing
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Show Quick Actions</p>
                      <p className="text-sm text-gray-500">
                        Display quick action buttons for common tasks
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p className="text-sm text-gray-500">
                        Enable animations throughout the interface
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help & Support */}
        {/* <TabsContent value="help">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Help Center</CardTitle>
                <CardDescription>
                  Find resources and support for using the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search the knowledge base..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="p-2 bg-blue-50 rounded-full w-fit mb-4">
                        <Book className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Documentation
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Comprehensive guides and API documentation to help you
                        get the most out of the platform.
                      </p>
                      <Button variant="link" className="p-0 h-auto">
                        View Documentation
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="p-2 bg-purple-50 rounded-full w-fit mb-4">
                        <VideoIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Video Tutorials
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Watch step-by-step video tutorials to learn how to use
                        all features.
                      </p>
                      <Button variant="link" className="p-0 h-auto">
                        Watch Tutorials
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="p-2 bg-green-50 rounded-full w-fit mb-4">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Community Forums
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Connect with other users, share ideas, and get help from
                        the community.
                      </p>
                      <Button variant="link" className="p-0 h-auto">
                        Join the Discussion
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="p-2 bg-amber-50 rounded-full w-fit mb-4">
                        <Headphones className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Customer Support
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Get help from our support team. We're here to assist you
                        with any issues.
                      </p>
                      <Button variant="link" className="p-0 h-auto">
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        How do I add a new vehicle to my fleet?
                      </h4>
                      <p className="text-sm text-gray-500">
                        To add a new vehicle, navigate to the Car Fleet page and
                        click the "Add Vehicle" button. Fill in the vehicle
                        details and click "Save".
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        How can I generate reports?
                      </h4>
                      <p className="text-sm text-gray-500">
                        Go to the Reports section where you can select from
                        various predefined reports or create custom ones based
                        on your needs.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        How do I set up online payments?
                      </h4>
                      <p className="text-sm text-gray-500">
                        To configure payment options, go to Settings {"->"}{" "}
                        Billing and connect your payment processor through the
                        integrations available.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full mr-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email Support</p>
                        <p className="text-sm text-gray-500">
                          support@luxedrive.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full mr-3">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone Support</p>
                        <p className="text-sm text-gray-500">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Live Chat</p>
                        <p className="text-sm text-gray-500">Available 24/7</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Start a Conversation</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Dashboard</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">API Services</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Payment Processing</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Notifications</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Operational
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Last updated: July 31, 2023 at 14:32 UTC
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent> */}

        {/* Integrations */}
        {/* <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage third-party integrations and connected services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-4">
                        <svg
                          className="h-8 w-8 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3346 12.0001C19.3346 16.0501 16.0513 19.3334 12.0013 19.3334C7.95132 19.3334 4.66797 16.0501 4.66797 12.0001C4.66797 7.95008 7.95132 4.66675 12.0013 4.66675C16.0513 4.66675 19.3346 7.95008 19.3346 12.0001Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 14.8167L9.18848 9.19342"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 9.19342L9.18848 14.8167"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-gray-500">
                          Payment processing
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Connected
                      </span>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-4">
                        <svg
                          className="h-8 w-8 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3346 12.0001C19.3346 16.0501 16.0513 19.3334 12.0013 19.3334C7.95132 19.3334 4.66797 16.0501 4.66797 12.0001C4.66797 7.95008 7.95132 4.66675 12.0013 4.66675C16.0513 4.66675 19.3346 7.95008 19.3346 12.0001Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 14.8167L9.18848 9.19342"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 9.19342L9.18848 14.8167"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google Maps</p>
                        <p className="text-sm text-gray-500">
                          Location services
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Connected
                      </span>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-4">
                        <svg
                          className="h-8 w-8 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3346 12.0001C19.3346 16.0501 16.0513 19.3334 12.0013 19.3334C7.95132 19.3334 4.66797 16.0501 4.66797 12.0001C4.66797 7.95008 7.95132 4.66675 12.0013 4.66675C16.0513 4.66675 19.3346 7.95008 19.3346 12.0001Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 14.8167L9.18848 9.19342"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 9.19342L9.18848 14.8167"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Mailchimp</p>
                        <p className="text-sm text-gray-500">Email marketing</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-4">
                        <svg
                          className="h-8 w-8 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3346 12.0001C19.3346 16.0501 16.0513 19.3334 12.0013 19.3334C7.95132 19.3334 4.66797 16.0501 4.66797 12.0001C4.66797 7.95008 7.95132 4.66675 12.0013 4.66675C16.0513 4.66675 19.3346 7.95008 19.3346 12.0001Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 14.8167L9.18848 9.19342"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.8118 9.19342L9.18848 14.8167"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-gray-500">
                          Team communication
                        </p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Manage your API keys and access credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Public API Key</h3>
                      <p className="text-sm text-gray-500">
                        Used for client-side API calls
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                  </div>
                  <div className="flex">
                    <Input
                      value="pk_test_51NRT4VXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      readOnly
                      className="rounded-r-none border-r-0"
                    />
                    <Button variant="outline" className="rounded-l-none">
                      Copy
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Secret API Key</h3>
                      <p className="text-sm text-gray-500">
                        Used for server-side API calls
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                  </div>
                  <div className="flex">
                    <Input
                      value="sk_test_51NRT4VXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      type="password"
                      readOnly
                      className="rounded-r-none border-r-0"
                    />
                    <Button variant="outline" className="rounded-l-none">
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-red-500">
                    Keep this key secure! Don't share it publicly.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">API Usage</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Requests this month</span>
                        <span className="font-medium">23,578 / 50,000</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: "47%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Rate limit</span>
                        <span className="font-medium">100 req/min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          {/* </div> */}
        {/* </TabsContent>  */}
      </Tabs>
    </div>
  );
};

import {
  Book,
  VideoIcon,
  MessageSquare,
  Headphones,
  Phone,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const AddTeamMemberModal = ({ open, onClose, onSave, member, setMember, roles }) => {
  const [roleList, setRoleList] = useState<any[]>([]);
  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getRoles`);
      const result = await res.json();
      setRoleList(result?.data);
      console.log(result);
    } catch (err) {
      console.error("Failed to fetch roles.", err);
      toast.error("Failed to fetch roles.");
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="John Doe"
              value={member.name}
              onChange={(e) => setMember({ ...member, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              placeholder="john@example.com"
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              placeholder="*****"
              value={member.passwordHash}
              onChange={(e) => setMember({ ...member, passwordHash: e.target.value })}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={member.roles}
              onValueChange={(value) => setMember({ ...member, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roleList?.map((role) => (
                  <SelectItem key={role?.id} value={role?.name}>
                    {role?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={onSave} disabled={!member.name || !member.email || !member.role}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PermissionsModal = ({ open, onClose, roleInfo, setRoleInfo, onSave }) => {
  const toggleRoute = (route) => {
    setRoleInfo(prev => ({
      ...prev,
      permissions: prev.permissions.map(p =>
        p.route === route ? { ...p, assigned: !p.assigned } : p
      )
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Role Permissions</DialogTitle>
          <DialogDescription>Role: {roleInfo.roleName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded p-4">
          {roleInfo.permissions.map((perm) => (
            <div key={perm.route} className="flex items-center justify-between">
              <span>{perm.route}</span>
              <input
                type="checkbox"
                checked={perm.assigned}
                onChange={() => toggleRoute(perm.route)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default Settings;
