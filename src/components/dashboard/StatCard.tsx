import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendData } from "@/lib/types";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor: string;
  iconBgColor: string;
  trend: TrendData;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  trend
}) => {
  // const isPositive = trend.direction === 'up';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBgColor)}>
            <span className={iconColor}>
              {icon}
            </span>
          </div>
        </div>
        {/* <div className="mt-4 flex items-center">
          <span className={cn(
            "text-sm font-medium flex items-center", 
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? (
              <FaArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <FaArrowDown className="mr-1 h-3 w-3" />
            )}
            {trend.value}
          </span>
          <span className="text-gray-500 text-sm ml-2">{trend.timeframe}</span>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default StatCard;
