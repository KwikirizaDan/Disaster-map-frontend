import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { devices } from '../api/mockData';

const ViewDetailsPage = () => {
  const { id } = useParams();
  const device = devices.find(d => d.id === parseInt(id));

  if (!device) {
    return (
      <div className="p-6 text-white text-center">
        <h1 className="text-2xl font-bold">Device not found</h1>
        <Link to="/devices" className="text-[var(--accent-blue)] hover:underline mt-4 inline-block">Back to Devices</Link>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Device Details: {device.name}</h1>
        <Link to="/devices" className="text-sm text-[var(--accent-blue)] hover:underline">Back to list</Link>
      </div>
      <div className="bg-[var(--main-container-bg)] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--surface-2)] p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">General Information</h3>
            <p><span className="font-medium text-[var(--text-secondary)]">ID:</span> {device.id}</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Name:</span> {device.name}</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Type:</span> {device.type}</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Location:</span> {device.location}</p>
          </div>
          <div className="bg-[var(--surface-2)] p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Status & Readings</h3>
            <p><span className="font-medium text-[var(--text-secondary)]">Status:</span>
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                device.status === 'Active' ? 'bg-green-100 text-green-800' :
                device.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
              }`}>
                {device.status}
              </span>
            </p>
            <p><span className="font-medium text-[var(--text-secondary)]">Battery:</span> {device.battery}%</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Temperature:</span> {device.temp}°C</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Humidity:</span> {device.humidity}%</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Air Pollution:</span> {device.pollution}</p>
          </div>
          <div className="md:col-span-2 bg-[var(--surface-2)] p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Location Details</h3>
            <p><span className="font-medium text-[var(--text-secondary)]">Latitude:</span> {device.lat}</p>
            <p><span className="font-medium text-[var(--text-secondary)]">Longitude:</span> {device.lng}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPage;
