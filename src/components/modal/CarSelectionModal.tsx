import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CarCard from "../ui/CheckableCarCard";

interface Car {
    id: string;
    name: string;
    model: string;
    year: number;
    image: string;
    type: string;
    fuel: string;
    transmission: string;
}

const mockCars: Car[] = [
    {
        id: "1",
        name: "BMW 3 Series",
        model: "320i",
        year: 2023,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
        type: "Sedan",
        fuel: "Gasoline",
        transmission: "Automatic"
    },
    {
        id: "2",
        name: "Mercedes C-Class",
        model: "C300",
        year: 2023,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
        type: "Sedan",
        fuel: "Gasoline",
        transmission: "Automatic"
    },
    {
        id: "3",
        name: "Audi A4",
        model: "2.0T",
        year: 2023,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
        type: "Sedan",
        fuel: "Gasoline",
        transmission: "Automatic"
    },
    {
        id: "4",
        name: "Tesla Model S",
        model: "Plaid",
        year: 2023,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop",
        type: "Electric",
        fuel: "Electric",
        transmission: "Automatic"
    },
    {
        id: "5",
        name: "Porsche 911",
        model: "Carrera",
        year: 2023,
        image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=250&fit=crop",
        type: "Sports",
        fuel: "Gasoline",
        transmission: "Manual"
    },
    {
        id: "6",
        name: "Range Rover",
        model: "Evoque",
        year: 2023,
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
        type: "SUV",
        fuel: "Gasoline",
        transmission: "Automatic"
    }
];

interface CarSelectionModalProps {
    isOpen: boolean;
    carsList: any[];
    selectedCars: any[];
    setSelectedCars: any;
    handleAssign: any;
    showAssignId?: number;
    onClose: () => void;
}

const CarSelectionModal = ({ isOpen, carsList, selectedCars, setSelectedCars, handleAssign, showAssignId, onClose }: CarSelectionModalProps) => {

    const handleCarToggle = (car: any) => {
        car = {
            ...car,
            AS_VehicleId: car?.id,
            AS_ServiceId: showAssignId
        }
        setSelectedCars(prev => {
            const list = Array.isArray(prev) ? prev : [];

            return list.find(c => c?.id === car?.id)
                ? list.filter(c => c?.id !== car?.id)
                : [...list, car];
        });

    };

    const handleUpdateService = () => {
        // Here you would typically send the selected cars to your backend
        handleAssign();
        onClose();
    };

    useEffect(() => {

    }, [carsList, selectedCars]);

    console.log(selectedCars);
    console.log("Selected cars:", selectedCars);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Assign Service
                    </DialogTitle>
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </Button> */}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {carsList.map((car?: any, index) => (
                            <CarCard
                                key={index}
                                car={car}
                                isSelected={selectedCars?.some(selected => selected.id === car.id)}
                                onToggle={() => handleCarToggle(car)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t bg-white">
                    <div className="text-sm text-gray-600">
                        {selectedCars?.length} car{selectedCars?.length !== 1 ? 's' : ''} selected
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="px-6 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateService}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
                            disabled={selectedCars?.length === 0}
                        >
                            Assign Service
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CarSelectionModal;
