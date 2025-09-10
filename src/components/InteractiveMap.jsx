import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const InteractiveMap = () => {
  const [disasters, setDisasters] = useState([]);
  const position = [0.3476, 32.5825]; // Default position (e.g., Kampala)

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch('https://disastermap.vercel.app/api/disasters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDisasters(data);
      } catch (error) {
        console.error("Failed to fetch disasters:", error);
      }
    };
    fetchDisasters();
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {disasters.map(disaster => (
        <Marker key={disaster.id} position={[disaster.latitude, disaster.longitude]}>
          <Popup>
            <strong>{disaster.title}</strong><br />
            Severity: {disaster.severity}<br />
            <Link to={`/disasters/${disaster.id}`}>View Details</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;
