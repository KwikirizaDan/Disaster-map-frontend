import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import NonAuthHeader from "./NonAuthHeader";

// Custom marker with radar ping effect
const AnimatedMarker = ({ position, disaster, onClick }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    setTimeout(() => setActive(false), 2000);
    onClick(disaster);
  };

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

  // Create custom HTML element for the marker with radar effect
  const createCustomIcon = () => {
    return divIcon({
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
  };

  const icon = createCustomIcon();

  return (
    <>
      <Marker
        position={position}
        icon={icon}
        eventHandlers={{ click: handleClick }}
      >
        <Popup>
          <h3 className="font-bold">{disaster.title}</h3>
          <p className="text-sm capitalize">{disaster.type}</p>
          <Link
            to={`/disaster/details/${disaster.id}`}
            className="text-blue-600 hover:underline text-sm mt-2 block"
          >
            View Details
          </Link>
        </Popup>
      </Marker>

      {/* Ping ladder animation when clicked */}
      {active && (
        <div
          className="absolute"
          style={{
            left: `${position[1]}px`,
            top: `${position[0]}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {[0, 400, 800].map((delay, i) => (
            <div
              key={i}
              className="absolute w-16 h-16 rounded-full opacity-75"
              style={{
                backgroundColor: color,
                animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) ${delay}ms infinite`,
              }}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};

// Fly to a disaster on selection
const FlyToDisaster = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 8, {
        duration: 1.5,
      });
    }
  }, [target, map]);
  return null;
};

// Search suggestions component
const SearchSuggestions = ({
  suggestions,
  onSelect,
  searchQuery,
  isLoading,
}) => {
  if (!searchQuery || searchQuery.length < 2) return null;

  if (isLoading) {
    return (
      <div className="absolute z-[1001] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="p-2 text-center text-gray-500">
          <div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mx-auto"></div>
          <p className="text-sm mt-1">Searching...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && searchQuery.length >= 2) {
    return (
      <div className="absolute z-[1001] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="p-3 text-center text-gray-500">
          No disasters found matching "{searchQuery}"
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-[1001] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((disaster, index) => (
        <div
          key={disaster.id}
          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(disaster)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{disaster.title}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {disaster.type}
              </p>
              <p className="text-xs text-gray-500">{disaster.location_name}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                disaster.status === "active"
                  ? "bg-red-100 text-red-800"
                  : disaster.status === "warning"
                  ? "bg-orange-100 text-orange-800"
                  : disaster.status === "resolved"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {disaster.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DisasterHeatMap = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [showTypes, setShowTypes] = useState(true);
  const [showAreas, setShowAreas] = useState(true);

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

  const handleMarkerClick = (disaster) => {
    setSelectedDisaster(disaster);
    setShowSuggestions(false);
  };

  // Filter disasters for search
  const filteredDisasters = useMemo(() => {
    if (!searchQuery) return disasters;

    const q = searchQuery.toLowerCase();
    return disasters.filter((d) => {
      return (
        d.title?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q) ||
        d.location_name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    });
  }, [disasters, searchQuery]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return filteredDisasters.slice(0, 5); // Show top 5 results
  }, [filteredDisasters, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length >= 2);
    setIsSearching(e.target.value.length >= 2);
  };

  // Handle search suggestion selection
  const handleSuggestionSelect = (disaster) => {
    setSelectedDisaster(disaster);
    setSearchQuery(disaster.title);
    setShowSuggestions(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    setSelectedDisaster(null);
  };

  // Sidebar stats
  const typeCounts = disasters.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});
  const areaCounts = disasters.reduce((acc, d) => {
    const loc = d.location_name || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const topAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalDisasters = disasters.length || 1;

  // Uganda bounds
  const ugandaBounds = [
    [-1.5, 29.5], // Southwest
    [4.5, 35.0], // Northeast
  ];
  const center = [1.3733, 32.2903]; // Uganda centroid

  return (
    <div className="bg-gray-50 min-h-screen">
      <NonAuthHeader />
      <main className="flex h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          {/* Search in sidebar */}
          <div className="mb-6 relative">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input w-full rounded-md border bg-white py-2 pl-10 pr-10 shadow-sm"
                placeholder="Search disasters..."
                type="text"
                onFocus={() =>
                  searchQuery.length >= 2 && setShowSuggestions(true)
                }
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && (
              <SearchSuggestions
                suggestions={searchSuggestions}
                onSelect={handleSuggestionSelect}
                searchQuery={searchQuery}
                isLoading={isSearching}
              />
            )}
          </div>

          {/* Search results summary */}
          {searchQuery && (
            <div className="mb-6 p-3 bg-blue-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">
                  {filteredDisasters.length} result
                  {filteredDisasters.length !== 1 ? "s" : ""} found
                </span>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
          <a
            class="flex items-center p-2 text-sm font-medium rounded-md bg-yellow-200 text-primary border-l-4 border-primary"
            href="#"
          >
            <span class="material-icons mr-3">cases</span>
            Cases
            <span class="ml-auto bg-yellow-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalDisasters}
            </span>
          </a>

          {/* Most Disasters */}
          <div className="mb-6 mt-6">
            <button
              onClick={() => setShowTypes(!showTypes)}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="">Most Disasters</h3>
              <span className="text-gray-500">{showTypes ? "−" : "+"}</span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showTypes ? "max-h-96 mt-4" : "max-h-0"
              }`}
            >
              {topTypes.map(([type, count], i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{type}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-mid h-2.5">
                    <div
                      className="h-2.5 rounded-mid bg-blue-500"
                      style={{ width: `${(count / totalDisasters) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Affected Areas */}
          <div>
            <button
              onClick={() => setShowAreas(!showAreas)}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-bold">Most Affected Areas</h3>
              <span className="text-gray-500">{showAreas ? "−" : "+"}</span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showAreas ? "max-h-96 mt-4" : "max-h-0"
              }`}
            >
              {topAreas.map(([area, count], i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{area}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-green-500"
                      style={{ width: `${(count / totalDisasters) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
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
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredDisasters.map(
                (d) =>
                  d.latitude &&
                  d.longitude && (
                    <AnimatedMarker
                      key={d.id}
                      position={[d.latitude, d.longitude]}
                      disaster={d}
                      onClick={handleMarkerClick}
                    />
                  )
              )}
              {selectedDisaster && <FlyToDisaster target={selectedDisaster} />}
            </MapContainer>
          )}

          {/* Search Box on map */}
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input w-full rounded-md border bg-white py-3 pl-10 pr-10 shadow-md"
                placeholder="Search by location, disaster type, or description..."
                type="text"
                onFocus={() =>
                  searchQuery.length >= 2 && setShowSuggestions(true)
                }
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && (
              <SearchSuggestions
                suggestions={searchSuggestions}
                onSelect={handleSuggestionSelect}
                searchQuery={searchQuery}
                isLoading={isSearching}
              />
            )}
          </div>

          {/* Selected disaster info */}
          {selectedDisaster && (
            <aside
              className="fixed top-[76px] right-0 h-[calc(100%-76px)] w-96 
             bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md 
             p-4 overflow-y-auto z-[1000] animate-slideInRight 
             shadow-xl border-l border-border-light dark:border-border-dark 
             scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400 
             dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedDisaster.title}
                </h2>
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="ml-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Region Tabs */}
              <div className="flex space-x-1 p-1 bg-white rounded-md border border-border-light mb-4">
                <button className="flex-1 py-1 text-center text-sm rounded-md text-gray-600 hover:bg-gray-100">
                  Africa
                </button>
                <button className="flex-1 py-1 text-center text-sm rounded-md bg-primary text-black">
                  United States
                </button>
                <button className="flex-1 py-1 text-center text-sm rounded-md text-gray-600 hover:bg-gray-100">
                  United Kingdom
                </button>
              </div>

              <div className="space-y-4">
                {/* Location */}
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                      Location
                    </label>
                    <span className="font-semibold text-text-light dark:text-text-dark">
                      {selectedDisaster.location_name}
                    </span>
                  </div>
                </div>

                {/* Disaster Type */}
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                      Type
                    </label>
                    <span className="font-semibold capitalize">
                      {selectedDisaster.type}
                    </span>
                  </div>
                </div>

                {/* Last Recorded Event */}
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <h4 className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    Last Recorded Event
                  </h4>
                  <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base">
                          {selectedDisaster.title}
                        </h3>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          {selectedDisaster.description?.slice(0, 50)}...
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-md font-bold text-sm ${
                          selectedDisaster.status === "active"
                            ? "bg-red-500 text-white"
                            : selectedDisaster.status === "warning"
                            ? "bg-orange-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {selectedDisaster.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Population */}
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="material-icons text-blue-500">groups</span>
                    <h3 className="font-semibold">
                      Estimated Population Affected
                    </h3>
                  </div>
                  <p className="text-2xl font-bold">3.09 million</p>
                </div>

                {/* Risk Alert */}
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-500 p-4 rounded-lg flex items-start space-x-3">
                  <span className="material-icons text-red-500 mt-1">
                    warning
                  </span>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300">
                      High-Risk Alert
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      60% Heavy rain in Area
                    </p>
                  </div>
                </div>

                {/* Risk Index */}
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark px-1 mt-1">
                      <span>Lowest index</span>
                      <span>Highest index</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with View More button */}
              <div className="mt-6">
                <Link
                  to={`/disaster/details/${selectedDisaster.id}`}
                  className="block w-full text-center bg-primary text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  View More
                </Link>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Radar ping effect for markers */}
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
        
        /* Click ping animation */
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}
      </style>
    </div>
  );
};

export default DisasterHeatMap;
