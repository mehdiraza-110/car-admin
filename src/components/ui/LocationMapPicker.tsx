import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng]);

  return null;
};


// Optional: Fix marker icon in Leaflet (default icon issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMarker = ({ onSelect }: { onSelect: (coords: { lat: number; lng: number }) => void }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const LocationMapPicker = ({
  onLocationSelect,
  initialLat = 40.276987,
  initialLng = 49.296249,
  existingMarker,
}: {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  initialLat?: number;
  initialLng?: number;
  existingMarker?: { lat: number; lng: number } | null;
}) => {
  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={12}
      scrollWheelZoom
      style={{ height: "300px", width: "100%", borderRadius: "8px", zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {existingMarker && <Marker position={[existingMarker?.lat, existingMarker?.lng]} />}
      <LocationMarker onSelect={onLocationSelect} />
      <RecenterMap lat={initialLat} lng={initialLng} />
    </MapContainer>
  );
};


export default LocationMapPicker;