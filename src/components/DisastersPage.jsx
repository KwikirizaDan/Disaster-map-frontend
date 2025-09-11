import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DisastersPage = () => {
  const { isAdmin, isReporter, token } = useAuth();
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisasters();
  }, []);

  const handleExport = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Disasters');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'disasters.xlsx');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this disaster?')) {
      return;
    }

    try {
      const response = await fetch(`https://disastermap.vercel.app/api/disasters/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete disaster');
      }

      setDisasters(disasters.filter((d) => d.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Disasters</h1>
      <div className="flex gap-2 mb-4">
        {(isAdmin() || isReporter()) && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/disasters/new')}
          >
            Add Disaster
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleExport(disasters)}
        >
          Export All Data
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-100 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Severity</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Casualties</th>
              <th scope="col" className="px-6 py-3">Damage Est.</th>
              <th scope="col" className="px-6 py-3">Reported At</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disasters.map((disaster) => (
              <tr key={disaster.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{disaster.title}</td>
                <td className="px-6 py-4">{disaster.type}</td>
                <td className="px-6 py-4">{disaster.status}</td>
                <td className="px-6 py-4">{disaster.severity}</td>
                <td className="px-6 py-4">{disaster.location_name}</td>
                <td className="px-6 py-4">{disaster.casualties}</td>
                <td className="px-6 py-4">{disaster.damage_estimate}</td>
                <td className="px-6 py-4">{new Date(disaster.reported_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    className="font-medium text-blue-500 hover:underline"
                    onClick={() => navigate(`/disasters/edit/${disaster.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-red-500 hover:underline"
                    onClick={() => handleDelete(disaster.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisastersPage;
