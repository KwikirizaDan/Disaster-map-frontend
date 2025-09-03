import React from 'react';
import HistoricalChart from './HistoricalChart';

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`bg-[var(--sidebar-bg)] text-[var(--text-primary)] p-6 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-1/4' : 'w-0'} overflow-hidden`}>
      <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Parameters</h2>
          <button className="text-[var(--text-secondary)] hover:text-white">
            <span className="material-icons">filter_list</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-[var(--surface-2)] p-4 rounded-lg border-l-4 border-[var(--alert-red)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons text-[var(--alert-red)] mr-3">thermostat</span>
                <span className="font-medium text-white">Temperature</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-[var(--alert-red)]">29<span className="text-2xl align-top">°C</span></p>
              <div className="flex items-center text-yellow-500 text-xs font-medium">
                <span className="material-icons text-base mr-1">warning_amber</span>
                <span>Above Average</span>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Last reading is 5°C higher than usual</p>
          </div>
          <div className="bg-[var(--surface-1)] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons text-[var(--text-secondary)] mr-3">water_drop</span>
                <span className="font-medium text-[var(--text-primary)]">Humidity</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="bg-[var(--surface-1)] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons text-[var(--text-secondary)] mr-3">air</span>
                <span className="font-medium text-[var(--text-primary)]">Air Pollution</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="bg-[var(--surface-1)] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons text-[var(--text-secondary)] mr-3">waves</span>
                <span className="font-medium text-[var(--text-primary)]">Water Level</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-[var(--border-color)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Historical Data</h3>
            <div className="flex items-center space-x-2">
              <button className="text-[var(--text-secondary)] text-sm flex items-center hover:underline">
                <span className="material-icons text-sm mr-1">compare_arrows</span> Compare
              </button>
              <button className="text-[var(--accent-blue)] text-sm flex items-center hover:underline">
                <span className="material-icons text-sm mr-1">calendar_today</span> Last 24h
              </button>
            </div>
          </div>
          <div className="relative h-40">
            <HistoricalChart />
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <button className="flex items-center text-[var(--text-secondary)] hover:text-white">
          <span className="material-icons">settings</span>
          <span className="ml-2">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
