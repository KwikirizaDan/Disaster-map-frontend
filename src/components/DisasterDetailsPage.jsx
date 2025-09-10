import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DisasterDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, deleteDisaster } = useAuth();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const response = await fetch(`https://disastermap.vercel.app/api/disasters/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDisaster(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisaster();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error.message}</div>;
  }

  if (!disaster) {
    return <div className="text-white">Disaster not found.</div>;
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this disaster?')) {
      const result = await deleteDisaster(id);
      if (result.success) {
        navigate('/disasters');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{disaster.title}</h1>
        <div>
          {(isAdmin() || user?.id === disaster.reporter_id) && (
            <Link to={`/disasters/${id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mr-2">
              Edit
            </Link>
          )}
          {isAdmin() && (
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mr-2">
              Delete
            </button>
          )}
          <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Back
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div><strong>ID:</strong> {disaster.id}</div>
        <div><strong>Type:</strong> {disaster.type}</div>
        <div><strong>Status:</strong> {disaster.status}</div>
        <div><strong>Severity:</strong> {disaster.severity}</div>
        <div><strong>Location:</strong> {disaster.location_name} ({disaster.latitude}, {disaster.longitude})</div>
        <div><strong>Reported At:</strong> {new Date(disaster.reported_at).toLocaleString()}</div>
        <div><strong>Description:</strong> <p className="whitespace-pre-wrap">{disaster.description}</p></div>
        <div><strong>Casualties:</strong> {disaster.casualties ?? 'N/A'}</div>
        <div><strong>Damage Estimate:</strong> ${disaster.damage_estimate ? parseFloat(disaster.damage_estimate).toLocaleString() : 'N/A'}</div>
        <div><strong>Resources Needed:</strong> {disaster.resources_needed || 'N/A'}</div>
        <div><strong>Negative Effects:</strong> {disaster.negative_effects || 'N/A'}</div>
        <div><strong>Potential Solutions:</strong> {disaster.potential_solutions || 'N/A'}</div>
        {disaster.image_url && (
          <div>
            <strong>Image:</strong>
            <img src={disaster.image_url} alt={disaster.title} className="mt-2 rounded-lg max-w-md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterDetailsPage;
