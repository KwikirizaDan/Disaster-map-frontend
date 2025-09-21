import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublicDisasterCards = () => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/disasters", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setDisasters(data);
      } else {
        throw new Error("Failed to fetch disasters");
      }
    } catch (error) {
      console.error("Error fetching disasters:", error);
      toast.error("Failed to load disasters");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/disasters/details/${id}`);
  };

  // Get a placeholder image based on disaster type
  const getPlaceholderImage = (disasterType) => {
    const type = disasterType ? disasterType.toLowerCase() : 'default';
    
    const placeholderImages = {
      flood: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      fire: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      earthquake: 'https://images.unsplash.com/photo-1562259924-2e2c16f370d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      storm: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      landslide: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      drought: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      default: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    };

    return placeholderImages[type] || placeholderImages.default;
  };

  // Filter disasters based on search term
  const filteredDisasters = disasters.filter((disaster) =>
    disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disaster.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (disaster.type && disaster.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const severityClass = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const severityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const statusClass = {
    reported: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  const statusMap = {
    reported: "Reported",
    in_progress: "In Progress",
    resolved: "Resolved",
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading disasters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Disaster Information</h1>
            <p className="text-gray-600 mt-1">Public disaster data and alerts</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search disasters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              search
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredDisasters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">
              search_off
            </span>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No disasters found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "No disaster data available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDisasters.map((disaster) => (
              <div key={disaster.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Landscape Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={disaster.image_url || getPlaceholderImage(disaster.type)} 
                    alt={disaster.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(disaster.type);
                    }}
                  />
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{disaster.title}</h3>
                    <span className="material-symbols-outlined text-gray-500">title</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="material-symbols-outlined mr-2 text-gray-500">location_on</span>
                    <p className="text-gray-600">{disaster.location_name}</p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="material-symbols-outlined mr-2 text-gray-500">event</span>
                    <p className="text-gray-600">{new Date(disaster.updated_at).toLocaleDateString()}</p>
                  </div>
                  
                  {disaster.type && (
                    <div className="flex items-center mb-3">
                      <span className="material-symbols-outlined mr-2 text-gray-500">category</span>
                      <p className="text-gray-600 capitalize">{disaster.type}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {disaster.severity && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityClass[disaster.severity] || "bg-gray-100 text-gray-800"}`}>
                        {severityMap[disaster.severity] || disaster.severity}
                      </span>
                    )}
                    {disaster.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass[disaster.status] || "bg-gray-100 text-gray-800"}`}>
                        {statusMap[disaster.status] || disaster.status}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleViewDetails(disaster.id)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition mt-3"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">visibility</span>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDisasterCards;