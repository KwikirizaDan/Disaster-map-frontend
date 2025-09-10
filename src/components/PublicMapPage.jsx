import React from 'react';
import { Link } from 'react-router-dom';

const PublicMapPage = () => {
  return (
    <div className="bg-[var(--main-container-bg)] rounded-xl shadow-lg w-full h-full flex overflow-hidden">
      <div className="w-full relative">
        <img alt="Map of Santander with IoT device locations" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxT9H9lKFthI49aTvCTL27XPyIEN2t0OPps_d8Jmz2wnnAMzGesXfvQSps2OMXgzFs0M4jnpWgPNcUougaDXYlKLhIPshbBx64viNTR72HrKK8KWNJmNkofdkzFn88sk8WIZhGKbmWxdmYLtFTAY-nSrHQK07ziq6Q0xZkw4J3vPoBKfn_iLXUYpRpuDD-jCZIT2OITd8hbmHsFebgtzkaN4xXornrAjeAWk2beXzzylipchr3aunFcZlqQOdCeqG2W3JJEV-Fa4M" />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link to="/login" className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Sign In
          </Link>
          <Link to="/register" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Sign Up
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#161b22]/80 text-white p-4 rounded-lg shadow-lg text-sm backdrop-blur-sm">
          <div className="flex items-center mb-2">
            <span className="material-icons text-[var(--alert-red)] mr-2">thermostat</span>
            <span>Temp.</span>
            <span className="ml-auto text-[var(--text-secondary)]">Hum.</span>
            <span className="ml-2 text-[var(--text-secondary)]">Poll.</span>
          </div>
          <div className="flex items-baseline font-semibold">
            <span className="text-lg text-[var(--alert-red)]">29°C</span>
            <span className="ml-auto text-[var(--text-secondary)]">28%</span>
            <span className="ml-4 text-[var(--text-secondary)]">60</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">LAT: 44.809823 LONG: 20.172382</p>
        </div>
        <div className="absolute top-20 right-4 flex flex-col items-center">
          <div className="text-white text-xs">33°C</div>
          <div className="w-2 h-48 my-2 rounded-full temp-gradient"></div>
          <div className="text-white text-xs">26°C</div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <div className="bg-[var(--surface-2)] rounded-lg flex">
            <button className="p-2 text-white hover:bg-gray-700 rounded-l-lg">
              <span className="material-icons">add</span>
            </button>
            <div className="border-r border-gray-600"></div>
            <button className="p-2 text-white hover:bg-gray-700 rounded-r-lg">
              <span className="material-icons">remove</span>
            </button>
          </div>
          <div className="bg-[var(--surface-2)] p-2 rounded-lg text-white"> Santander </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMapPage;
