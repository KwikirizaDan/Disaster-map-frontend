import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getJwt } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const AuthDisasterDetails = () => {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [relatedDisasters, setRelatedDisasters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        setIsLoading(true);
        const token = getJwt();

        // Fetch the specific disaster
        const disasterResponse = await axios.get(
          `http://127.0.0.1:5000/api/disasters/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Convert string coordinates to numbers if needed
        const disasterData = disasterResponse.data;
        if (
          disasterData.latitude &&
          typeof disasterData.latitude === "string"
        ) {
          disasterData.latitude = parseFloat(disasterData.latitude);
        }
        if (
          disasterData.longitude &&
          typeof disasterData.longitude === "string"
        ) {
          disasterData.longitude = parseFloat(disasterData.longitude);
        }

        setDisaster(disasterData);

        // Fetch related disasters (same type or location)
        const allDisastersResponse = await axios.get(
          "http://127.0.0.1:5000/api/disasters",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const related = allDisastersResponse.data
          .filter(
            (d) =>
              d.id !== id &&
              (d.type === disasterData.type ||
                d.location_name === disasterData.location_name)
          )
          .slice(0, 3); // Limit to 3 related disasters

        setRelatedDisasters(related);
      } catch (err) {
        console.error("Error fetching disaster:", err);
        setError("Failed to load disaster details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisasterData();
  }, [id]);

  // Format coordinates safely
  const formatCoordinates = (lat, lng) => {
    if (lat == null || lng == null) return "Not available";

    const latNum = typeof lat === "string" ? parseFloat(lat) : lat;
    const lngNum = typeof lng === "string" ? parseFloat(lng) : lng;

    if (isNaN(latNum) || isNaN(lngNum)) return "Invalid coordinates";

    return `${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Safely get coordinates for the map - only call this after disaster data is loaded
  const getMapCoordinates = () => {
    if (!disaster || !disaster.latitude || !disaster.longitude) return null;

    const lat =
      typeof disaster.latitude === "string"
        ? parseFloat(disaster.latitude)
        : disaster.latitude;

    const lng =
      typeof disaster.longitude === "string"
        ? parseFloat(disaster.longitude)
        : disaster.longitude;

    if (isNaN(lat) || isNaN(lng)) return null;

    return [lat, lng];
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error || !disaster) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl">{error || "Disaster not found"}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 block">
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  // Only call getMapCoordinates after we've confirmed disaster data is available
  const mapCoordinates = getMapCoordinates();

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Map
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Disaster Details</h1>
          <div></div> {/* Empty div for spacing */}
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {disaster.title}
                </h2>
                <p className="mt-2 text-gray-600">{disaster.description}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  disaster.status
                )}`}
              >
                {disaster.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {disaster.type || "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-lg font-semibold">
                  {disaster.location_name || "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Reported On
                </h3>
                <p className="mt-1 text-lg font-semibold">
                  {formatDate(disaster.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Details and Map */}
            <div className="space-y-8 lg:col-span-2">
              {/* Map Section */}
              {mapCoordinates && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-xl font-bold mb-4">Location</h3>
                  <div className="h-80 rounded-md overflow-hidden">
                    <MapContainer
                      center={mapCoordinates}
                      zoom={10}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={mapCoordinates}>
                        <Popup>
                          <div>
                            <h3 className="font-bold">{disaster.title}</h3>
                            <p className="text-sm capitalize">
                              {disaster.type}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Coordinates:{" "}
                    {formatCoordinates(disaster.latitude, disaster.longitude)}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-bold mb-4">
                  Additional Information
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Severity
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {disaster.severity || "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Affected Area
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {disaster.affected_area
                        ? `${disaster.affected_area} km²`
                        : "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reported By
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {disaster.reported_by || "Unknown"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(disaster.updated_at)}
                    </dd>
                  </div>
                </dl>

                {disaster.notes && (
                  <div className="mt-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Additional Notes
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {disaster.notes}
                    </dd>
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Images</h3>
                <div className="grid grid-cols-1 gap-4">
                  <img
                    src={
                      disaster.image_url && disaster.image_url.trim() !== ""
                        ? disaster.image_url
                        : "https://via.placeholder.com/600x400?text=No+Image+Available"
                    }
                    alt="Disaster"
                    className="w-full rounded-md object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Timeline and Related Disasters */}
            <div className="lg:col-span-1 space-y-8">
              {/* Timeline */}
              <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Timeline</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    <li className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Disaster reported
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={disaster.created_at}>
                              {formatDate(disaster.created_at)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </li>

                    {disaster.updated_at &&
                      disaster.updated_at !== disaster.created_at && (
                        <li className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                                <svg
                                  className="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Last updated
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={disaster.updated_at}>
                                  {formatDate(disaster.updated_at)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                    <li className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center ring-8 ring-white">
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between py-6 space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Current status
                            </p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {disaster.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Related Disasters */}
              {relatedDisasters.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-xl font-bold mb-4">Related Disasters</h3>
                  <ul className="divide-y divide-gray-200">
                    {relatedDisasters.map((related) => (
                      <li key={related.id} className="py-4">
                        <Link
                          to={`/disasters/details/${related.id}`}
                          className="block hover:bg-gray-50 rounded-md p-2 -m-2"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {related.title}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {related.type} • {related.location_name}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                              related.status
                            )}`}
                          >
                            {related.status}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthDisasterDetails;
