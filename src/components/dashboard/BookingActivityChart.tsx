import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface BookingData {
  name: string;
  bookings: number;
  isCurrentDay: boolean;
}

const dailyData: BookingData[] = [
  { name: 'Mon', bookings: 30, isCurrentDay: false },
  { name: 'Tue', bookings: 50, isCurrentDay: false },
  { name: 'Wed', bookings: 65, isCurrentDay: false },
  { name: 'Thu', bookings: 80, isCurrentDay: false },
  { name: 'Fri', bookings: 95, isCurrentDay: true },
  { name: 'Sat', bookings: 75, isCurrentDay: false },
  { name: 'Sun', bookings: 40, isCurrentDay: false },
];

const weeklyData: BookingData[] = [
  { name: 'W1', bookings: 180, isCurrentDay: false },
  { name: 'W2', bookings: 220, isCurrentDay: false },
  { name: 'W3', bookings: 260, isCurrentDay: true },
  { name: 'W4', bookings: 210, isCurrentDay: false },
];

const monthlyData: BookingData[] = [
  { name: 'Jan', bookings: 680, isCurrentDay: false },
  { name: 'Feb', bookings: 720, isCurrentDay: false },
  { name: 'Mar', bookings: 880, isCurrentDay: false },
  { name: 'Apr', bookings: 990, isCurrentDay: false },
  { name: 'May', bookings: 1100, isCurrentDay: true },
  { name: 'Jun', bookings: 0, isCurrentDay: false },
  { name: 'Jul', bookings: 0, isCurrentDay: false },
  { name: 'Aug', bookings: 0, isCurrentDay: false },
  { name: 'Sep', bookings: 0, isCurrentDay: false },
  { name: 'Oct', bookings: 0, isCurrentDay: false },
  { name: 'Nov', bookings: 0, isCurrentDay: false },
  { name: 'Dec', bookings: 0, isCurrentDay: false },
];

type TimeRange = 'day' | 'week' | 'month';

const BookingActivityChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartData, setChartData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchBookingActivity(timeRange);
        setChartData(data);
      } catch (err) {
        console.error(err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [timeRange]);

  const getDataForTimeRange = () => {
    switch (timeRange) {
      case 'day':
        return dailyData;
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  async function fetchBookingActivity(range: TimeRange): Promise<BookingData[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getWeekMonthChart?range=${range}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking activity');
    }
    return await response.json();
  }

  return (
     <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Booking Activity</CardTitle>
          <div className="flex space-x-2">
            {(['day', 'week', 'month'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                formatter={(value) => [`${value} bookings`, '']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar
                dataKey="bookings"
                radius={[4, 4, 0, 0]}
                fill="hsl(var(--primary))"
                fillOpacity={0.9}
                barSize={timeRange === 'month' ? 15 : 30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingActivityChart;
