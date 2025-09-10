import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';

const PublicMapPage = () => {
  return (
    <div className="w-full h-full relative">
      <InteractiveMap />
      <div className="absolute top-4 right-4 flex space-x-2 z-[1000]">
        <Link to="/login" className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Sign In
        </Link>
        <Link to="/register" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default PublicMapPage;
