import React from 'react';
import './LiveThreatMap.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LiveThreatMap = () => {
  const position = [20, 0]; // Default map position
  const sampleThreats = [
    { id: 1, position: [51.505, -0.09], info: 'DDoS Attack' },
    { id: 2, position: [48.8566, 2.3522], info: 'Web Attack' },
    { id: 3, position: [40.7128, -74.0060], info: 'Intruder' },
  ];

  const pulsingIcon = new L.divIcon({
    className: 'pulse-marker',
    iconSize: [20, 20]
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-80 bg-custom-darker p-6 flex flex-col">
        <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider">Attack Types</h2>
        </div>
        <div className="relative mb-4">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
                className="w-full bg-custom-dark border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search" type="text" />
        </div>
        <div className="space-y-4">
            <div className="flex items-center">
                <input defaultChecked
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500 rounded"
                    type="checkbox" />
                <span className="ml-3">Web Attackers</span>
            </div>
            <div className="flex items-center">
                <input defaultChecked
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 rounded"
                    type="checkbox" />
                <span className="ml-3">DDoS Attackers</span>
            </div>
            <div className="flex items-center">
                <input defaultChecked
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500 rounded"
                    type="checkbox" />
                <span className="ml-3">Intruders</span>
            </div>
            <div className="flex items-center">
                <input defaultChecked
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500 rounded"
                    type="checkbox" />
                <span className="ml-3">Scanners</span>
            </div>
            <div className="flex items-center">
                <input defaultChecked
                    className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-gray-400 focus:ring-gray-400 rounded"
                    type="checkbox" />
                <span className="ml-3">Anonymizers</span>
            </div>
        </div>
        <div className="mt-auto flex space-x-2">
            <button className="bg-gray-700 p-2 rounded-md hover:bg-gray-600">
                <span className="material-icons">share</span>
            </button>
            <button className="bg-gray-700 p-2 rounded-md hover:bg-gray-600">
                <span className="material-icons">link</span>
            </button>
        </div>
    </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-custom-darker p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img alt="Radware logo" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTXeMfwb3XWetzADXeYThQv3EpCoItnEvyAyI318wrRtO4nQ_3tqxexDXSj3Q2idqdFhufhHr6mmXxEH8kY8Mg31svkFE8aKUM_zBka79-R3HfndqTBiTajjfh1TYMDVclvYU2i0cbXkxIdmgq6x7LwoLdFtFQoBEr7vUYqRu5JnLpSaZn_hq73IiLt6wFAg6rfCpOtP0yV4sH29ELnFJXBGSqfBKayp_k0MN87AQloTQAzHBuffQ1I59n2-naJiB2rxqNlVWlPzZ6" />
            <div>
              <h1 className="text-xl font-bold">Live Threat Map</h1>
              <p className="text-sm text-gray-400">Powered by Radware's Threat Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="border border-custom-red text-custom-red px-4 py-2 rounded-md font-semibold hover:bg-custom-red hover:text-white transition-colors">READ 2025 THREAT REPORT</button>
            <button className="bg-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-600">UNDER ATTACK</button>
            <button className="bg-custom-red px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors">CONTACT SALES</button>
          </div>
        </header>
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col relative">
            <MapContainer center={position} zoom={2} style={{ height: '100%', width: '100%', backgroundColor: '#0a0e1a' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {sampleThreats.map(threat => (
                <Marker key={threat.id} position={threat.position} icon={pulsingIcon} />
              ))}
            </MapContainer>
          </div>
        </div>
        <footer className="bg-custom-darker text-xs text-gray-400 p-2 flex justify-between items-center">
          <span>© Copyright 2025 Radware Ltd. - All Rights Reserved</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">What is the Radware Live Threat Map?</a>
            <a href="#" className="hover:text-white">Contact Us</a>
            <a href="#" className="hover:text-white">Cookie Preferences</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LiveThreatMap;
