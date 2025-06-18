import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

type LocationType = 'pickup' | 'return';

interface LocationData {
  id: number;
  latitude: number;
  longitude: number;
  pickup_count: number;
  dropoff_count: number;
}
const LocationMap = () => {
  const [locationType, setLocationType] = useState<LocationType>('pickup');
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/getLocationStatDashboard`) 
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Error fetching location data:", err));
  }, []);

  const filtered = Array.isArray(locations) ? locations?.filter(loc =>
    locationType === "pickup" ? loc.pickup_count > 0 : loc.dropoff_count > 0
  ) : [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-0 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Pickup & Return Locations</CardTitle>
          <div className="flex space-x-2 mb-1">
            <Button
              variant={locationType === 'pickup' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setLocationType('pickup')}
            >
              Pickup
            </Button>
            <Button
              variant={locationType === 'return' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setLocationType('return')}
            >
              Return
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <MapContainer
          center={[5, 9]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-96 rounded-b-lg z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                {locationType === "pickup"
                  ? `Pickup Count: ${loc.pickup_count}`
                  : `Dropoff Count: ${loc.dropoff_count}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default LocationMap;