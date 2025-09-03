import React from 'react';

const AddDevicePage = () => {
  const handleAddDevice = (e) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    alert('Device added (simulation)!');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Add New Device</h1>
      <div className="bg-[var(--main-container-bg)] rounded-lg p-6">
        <form onSubmit={handleAddDevice}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-[var(--text-secondary)]">Device Name</label>
              <input type="text" id="deviceName" name="deviceName" placeholder="e.g., Sensor-X1" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-[var(--text-secondary)]">Device Type</label>
              <select id="deviceType" name="deviceType" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Air Pollution</option>
                <option>Water Level</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[var(--text-secondary)]">Location</label>
              <input type="text" id="location" name="location" placeholder="e.g., Santander" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Initial Status</label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="status" value="Active" className="form-radio text-indigo-600 bg-[var(--surface-2)] border-[var(--border-color)]" defaultChecked />
                  <span className="ml-2">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="status" value="Inactive" className="form-radio text-indigo-600 bg-[var(--surface-2)] border-[var(--border-color)]" />
                  <span className="ml-2">Inactive</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-[var(--border-color)] pt-6">
            <button type="submit" className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDevicePage;
