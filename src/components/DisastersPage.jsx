import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'reported_at', direction: 'descending' });

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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedDisasters = useMemo(() => {
    let sortableItems = [...disasters];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [disasters, sortConfig]);

  const filteredDisasters = useMemo(() => {
    return sortedDisasters.filter(disaster =>
      (disaster.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (disaster.location_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (disaster.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [sortedDisasters, searchTerm]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDisasters);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Disasters');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'disasters.xlsx');
  };

  const getSortIndicator = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Disasters</h1>
        <input
          type="text"
          placeholder="Search by title, location, or type..."
          className="bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 w-1/3 text-white"
          onChange={e => setSearchTerm(e.target.value)}
        />
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
      <div className="overflow-auto">
        <table className="min-w-full bg-[var(--surface-2)] text-white">
          <thead>
            <tr className="bg-[var(--surface-1)]">
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('id')}>ID{getSortIndicator('id')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('title')}>Title{getSortIndicator('title')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('type')}>Type{getSortIndicator('type')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('severity')}>Severity{getSortIndicator('severity')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('location_name')}>Location{getSortIndicator('location_name')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('casualties')}>Casualties{getSortIndicator('casualties')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('damage_estimate')}>Damage Est.{getSortIndicator('damage_estimate')}</th>
              <th className="py-2 px-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => requestSort('reported_at')}>Reported At{getSortIndicator('reported_at')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisasters.map((disaster) => (
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
