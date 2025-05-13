import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box } from '@mui/material';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define all station locations
const stations = [
  { id: 'victoria', name: 'Victoria Station', lat: 51.4965, lng: -0.1447 },
  { id: 'green-park', name: 'Green Park', lat: 51.5067, lng: -0.1428 },
  { id: 'oxford-circus', name: 'Oxford Circus', lat: 51.5154, lng: -0.1755 },
  { id: 'kings-cross', name: 'King\'s Cross', lat: 51.5320, lng: -0.1233 },
  { id: 'waterloo', name: 'Waterloo', lat: 51.5033, lng: -0.1145 },
  { id: 'bank', name: 'Bank', lat: 51.5134, lng: -0.0886 },
  { id: 'paddington', name: 'Paddington', lat: 51.5154, lng: -0.1755 },
  { id: 'baker-street', name: 'Baker Street', lat: 51.5226, lng: -0.1571 },
  { id: 'camden-town', name: 'Camden Town', lat: 51.5392, lng: -0.1426 },
  { id: 'hammersmith', name: 'Hammersmith', lat: 51.4927, lng: -0.2229 }
];

const Map: React.FC = () => {
  const [busPosition, setBusPosition] = useState(stations[0]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [center] = useState<[number, number]>([51.505, -0.09]); // London coordinates

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.01;
      if (progress >= 1) {
        progress = 0;
        // Move to next station
        setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
      }

      const currentStation = stations[currentStationIndex];
      const nextStation = stations[(currentStationIndex + 1) % stations.length];

      // Calculate new position using linear interpolation
      const newLat = currentStation.lat + (nextStation.lat - currentStation.lat) * progress;
      const newLng = currentStation.lng + (nextStation.lng - currentStation.lng) * progress;

      setBusPosition({ ...currentStation, lat: newLat, lng: newLng });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [currentStationIndex]);

  return (
    <Box sx={{ height: '500px', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Station Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
          >
            <Popup>
              <div>
                <strong>{station.name}</strong>
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Bus as a red dot */}
        <CircleMarker
          center={[busPosition.lat, busPosition.lng]}
          radius={8}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
        >
          <Popup>
            <div>
              <strong>Bus 38</strong><br />
              <strong>Current Location:</strong> {busPosition.name}<br />
              <strong>Next Stop:</strong> {stations[(currentStationIndex + 1) % stations.length].name}
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </Box>
  );
};

export default Map; 