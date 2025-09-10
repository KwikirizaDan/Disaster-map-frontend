import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const showSidebar = location.pathname === '/';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow overflow-hidden">
        {showSidebar && <Sidebar isSidebarOpen={isSidebarOpen} />}
        <main className={`${(showSidebar && isSidebarOpen) ? 'w-3/4' : 'w-full'} bg-[var(--dark-bg)] p-4 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
