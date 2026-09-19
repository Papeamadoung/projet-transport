'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige un bug connu d'icônes manquantes avec react-leaflet + Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface TripMapProps {
  departureLat: number;
  departureLng: number;
  arrivalLat: number;
  arrivalLng: number;
  departureName: string;
  arrivalName: string;
}

export default function TripMap({
  departureLat,
  departureLng,
  arrivalLat,
  arrivalLng,
  departureName,
  arrivalName,
}: TripMapProps) {
  const center: [number, number] = [
    (departureLat + arrivalLat) / 2,
    (departureLng + arrivalLng) / 2,
  ];

  const positions: [number, number][] = [
    [departureLat, departureLng],
    [arrivalLat, arrivalLng],
  ];

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[departureLat, departureLng]}>
          <Popup>{departureName}</Popup>
        </Marker>
        <Marker position={[arrivalLat, arrivalLng]}>
          <Popup>{arrivalName}</Popup>
        </Marker>
        <Polyline positions={positions} pathOptions={{ color: '#2563eb', dashArray: '6 6' }} />
      </MapContainer>
    </div>
  );
}