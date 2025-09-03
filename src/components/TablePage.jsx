import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { devices as mockDevices } from '../api/mockData';
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';

const TablePage = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    setDevices(mockDevices);
  }, []);

  const sortedDevices = useMemo(() => {
    let sortableDevices = [...devices];
    if (sortConfig.key !== null) {
      sortableDevices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDevices;
  }, [devices, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredDevices = sortedDevices.filter(device =>
    Object.values(device).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCsv = () => {
    const headers = Object.keys(filteredDevices[0]);
    const csvContent = [
      headers.join(','),
      ...filteredDevices.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'devices.csv');
  };

  const exportToXlsx = () => {
    const worksheet = utils.json_to_sheet(filteredDevices);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Devices');
    writeFile(workbook, 'devices.xlsx');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Device Management</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search devices..."
          className="bg-[var(--surface-2)] border border-[var(--border--color)] rounded-lg px-4 py-2 w-1/3"
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center">
          <Link to="/devices/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mr-2">
            Add Device
          </Link>
          <button onClick={exportToXlsx} className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2">
            Export to Excel
          </button>
          <button onClick={exportToCsv} className="bg-[var(--accent-green)] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
            Export to CSV
          </button>
        </div>
      </div>
      <div className="bg-[var(--main-container-bg)] rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--surface-2)]">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('name')}>
                Device Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('type')}>
                Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('location')}>
                Location {sortConfig.key === 'location' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('battery')}>
                Battery {sortConfig.key === 'battery' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('temp')}>
                Temp. {sortConfig.key === 'temp' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map(device => (
              <tr key={device.id} className="bg-[var(--main-container-bg)] border-b border-[var(--border-color)] hover:bg-[var(--surface-1)]">
                <td className="px-6 py-4 font-medium text-white">{device.name}</td>
                <td className="px-6 py-4">{device.type}</td>
                <td className="px-6 py-4">{device.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    device.status === 'Active' ? 'bg-green-100 text-green-800' :
                    device.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4">{device.battery}%</td>
                <td className="px-6 py-4">{device.temp}°C</td>
                <td className="px-6 py-4">
                  <Link to={`/devices/${device.id}`} className="text-[var(--accent-blue)] hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;
