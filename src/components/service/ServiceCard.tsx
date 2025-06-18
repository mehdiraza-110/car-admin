import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExtraService } from "@/lib/types";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";

// Utility to get icon dynamically from its names
const getIconComponent = (iconName: string) => {
  return MdIcons[iconName] || FaIcons[iconName] || MdIcons.MdHelp; // fallback
};

interface ServiceCardProps {
  service: ExtraService;
  setShowAssignId?: any;
  serviceId: number;
  onChange?: (id: number, enabled: boolean) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, setShowAssignId, serviceId, onChange }) => {
  const handleToggle = (checked: boolean) => {
    if (onChange) {
      onChange(service.id, checked);
    }
  };

  const Icon = getIconComponent(service.icon);
  
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            // service.iconBgColor
            "bg-green-200"
          )}>
            <div className={cn(
  "h-10 w-10 rounded-full flex items-center justify-center",
  service.iconBgColor || "bg-green-200"
)}>
  {Icon && <Icon className="text-xl" style={{ color: service.iconColor || "#000" }} />}
</div>
          </div>
          <Switch checked={service.is_active} onCheckedChange={handleToggle} />
        </div>
        <h3 className="text-base font-medium text-gray-900 hover:cursor-pointer" onClick={() => setShowAssignId(serviceId)}>{service.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{service.short_bio}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">AED {service.amount}</span>
          {service.badge && (
            <Badge variant="outline" className={cn(
              "px-2 py-1 text-xs rounded-full",
              // service.badgeColor
              "bg-red-200"
            )}>
              {service.badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
