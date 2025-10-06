import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import NonAuthHeader from "./NonAuthHeader";

// Custom marker with radar ping effect
const AnimatedMarker = ({ position, disaster, onClick }) => {
  const getColor = (status) => {
    switch (status) {
      case "active":
        return "red";
      case "warning":
        return "orange";
      case "resolved":
        return "green";
      default:
        return "gray";
    }
  };

  const color = getColor(disaster.status);

  const createCustomIcon = () =>
    divIcon({
      html: `
        <div class="radar-marker" style="border-color: ${color};">
          <div class="radar-ping" style="background-color: ${color};"></div>
          <div class="radar-dot" style="background-color: ${color};"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: "",
    });

  return (
    <Marker
      position={position}
      icon={createCustomIcon()}
      eventHandlers={{ click: () => onClick(disaster) }}
    >
      <Popup>
        <h3 className="font-bold">{disaster.title}</h3>
        <p className="text-sm capitalize">{disaster.type}</p>
      </Popup>
    </Marker>
  );
};

// Fly to a disaster when selected
const FlyToDisaster = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 8, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
};

const Disasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch disasters
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:5000/api/disasters");
        if (!response.ok) throw new Error("Failed to fetch disaster data");
        const data = await response.json();
        setDisasters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDisasters();
  }, []);

  // Listen to scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Uganda bounds
  const ugandaBounds = [
    [-1.5, 29.5],
    [4.5, 35.0],
  ];
  const center = [1.3733, 32.2903];

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "shadow-md bg-white/90 backdrop-blur" : "bg-white"
        }`}
      >
        <NonAuthHeader />
      </div>

      <main className="flex h-[calc(100vh-76px)] relative">
        {/* Sidebar Overlay */}
        {showSidebar && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowSidebar(false)}
            />
            <aside className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto z-50 animate-slideIn">
              <button
                className="mb-4 bg-gray-200 px-3 py-1 rounded"
                onClick={() => setShowSidebar(false)}
              >
                Close Menu
              </button>
              <nav className="space-y-2">
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  Overview
                </a>
                <a
                  href="#"
                  className="block p-2 rounded bg-yellow-200 font-semibold"
                >
                  Cases
                </a>
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  My Organization
                </a>
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  Reports
                </a>
              </nav>
            </aside>
          </>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          {!showSidebar && (
            <button
              className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow z-50"
              onClick={() => setShowSidebar(true)}
            >
              Open Menu
            </button>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={7}
              style={{ height: "100%", width: "100%" }}
              maxBounds={ugandaBounds}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {disasters.map(
                (d) =>
                  d.latitude &&
                  d.longitude && (
                    <AnimatedMarker
                      key={d.id}
                      position={[d.latitude, d.longitude]}
                      disaster={d}
                      onClick={setSelectedDisaster}
                    />
                  )
              )}
              {selectedDisaster && <FlyToDisaster target={selectedDisaster} />}
            </MapContainer>
          )}

          {/* Disaster Modal (Right Drawer) */}
          {selectedDisaster && (
            <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto animate-slideInRight">
              <button
                className="mb-4 text-gray-500 hover:text-black"
                onClick={() => setSelectedDisaster(null)}
              >
                Close
              </button>
              <h2 className="text-xl font-bold mb-2">{selectedDisaster.title}</h2>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                {selectedDisaster.type}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                {selectedDisaster.location_name}
              </p>
              <p className="text-gray-700">{selectedDisaster.description}</p>
              <div className="mt-4">
                <Link
                  to={`/disaster/details/${selectedDisaster.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Animations & radar styles */}
      <style>
        {`
        .radar-marker {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px currentColor;
        }
        .radar-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          z-index: 2;
        }
        .radar-ping {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          opacity: 0;
          z-index: 1;
          animation: radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes radarPing {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          80%, 100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
          }
        }
        @keyframes slideIn {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}
      </style>
    </div>
  );
};

export default Disasters;
