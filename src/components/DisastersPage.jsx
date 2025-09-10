import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../contexts/AuthContext';

const DisastersPage = () => {
  const { isAdmin, isReporter } = useAuth();
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(disasters);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Disasters');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'disasters.xlsx');
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Disasters</h1>
        <div>
          {(isAdmin() || isReporter()) && (
            <Link to="/disasters/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mr-2">
              Create Disaster
            </Link>
          )}
          <button
            onClick={handleExport}
            className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Export to Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--surface-2)] text-white">
          <thead>
            <tr className="bg-[var(--surface-1)]">
              <th className="py-2 px-4 border-b border-[var(--border-color)]">ID</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Title</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Type</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Status</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Severity</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Location</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Casualties</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Damage Est.</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)]">Reported At</th>
            </tr>
          </thead>
          <tbody>
            {disasters.map((disaster) => (
              <tr key={disaster.id} onClick={() => navigate(`/disasters/${disaster.id}`)} className="hover:bg-[var(--surface-1)] cursor-pointer">
                <td className="py-2 px-4 border-b border-[var(--border-color)] text-sm">{disaster.id}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{disaster.title}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{disaster.type}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{disaster.status}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{disaster.severity}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{disaster.location_name}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)] text-center">{disaster.casualties ?? 'N/A'}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)] text-right">{disaster.damage_estimate}</td>
                <td className="py-2 px-4 border-b border-[var(--border-color)]">{new Date(disaster.reported_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisastersPage;
