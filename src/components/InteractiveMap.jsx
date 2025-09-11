import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

// This component renders an interactive map with markers for each disaster.
const InteractiveMap = () => {
  const [disasters, setDisasters] = useState([]); // State to hold the list of disasters
  const position = [0.3476, 32.5825]; // Default map center position (e.g., Kampala)

  // Fetch all disasters when the component mounts
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/disasters');
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
    // MapContainer sets up the map view
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      {/* TileLayer provides the map imagery from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Map over the disasters and create a Marker for each one */}
      {disasters.map(disaster => (
        <Marker key={disaster.id} position={[disaster.latitude, disaster.longitude]}>
          {/* Popup that appears when a marker is clicked */}
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
