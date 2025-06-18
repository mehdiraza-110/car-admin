import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Car {
    id: string;
    name: string;
    model: string;
    year: number;
    image_1: string;
    category: string;
    type: string;
    fuel: string;
    status: string;
    transmission: string;
}

interface CarCardProps {
    car: Car;
    isSelected: boolean;
    onToggle: () => void;
}

const CheckableCarCard = ({ car, isSelected, onToggle }: CarCardProps) => {
    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            onClick={onToggle}
        >
            <CardContent className="p-0">
                <div className="relative">
                    <img
                        src={car.image_1}
                        alt={car.model}
                        className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                        <Checkbox
                            checked={isSelected}
                            onChange={onToggle}
                            className="bg-white border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-800">
                            {car.model}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {car.year}
                        </span>
                    </div>

                    <p className="text-gray-600 font-medium">{car.model}</p>

                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {car.category}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {car.fuel}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {car.status}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CheckableCarCard;