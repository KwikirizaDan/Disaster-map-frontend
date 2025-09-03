import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { devices } from '../api/mockData';
import L from 'leaflet';

const Map = () => {
  const position = [43.4623, -3.8099]; // Santander coordinates

  const createCustomIcon = (device) => {
    let iconClassName = 'bg-blue-500'; // Default color
    if (device.status === 'Active') {
      iconClassName = 'bg-green-500 pulse';
    } else if (device.status === 'Inactive') {
      iconClassName = 'bg-gray-500';
    } else if (device.status === 'Error') {
      iconClassName = 'bg-red-500';
    }

    return L.divIcon({
      html: `<span class="relative flex h-3 w-3">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${iconClassName} opacity-75"></span>
               <span class="relative inline-flex rounded-full h-3 w-3 ${iconClassName}"></span>
             </span>`,
      className: 'bg-transparent',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {devices.map(device => (
        <Marker key={device.id} position={[device.lat, device.lng]} icon={createCustomIcon(device)}>
          <Popup>
            <b>{device.name}</b><br />
            Status: {device.status}<br />
            Temp: {device.temp}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
