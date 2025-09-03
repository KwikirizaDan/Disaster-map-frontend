import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, logout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} logout={logout} />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className={`${isSidebarOpen ? 'w-3/4' : 'w-full'} bg-[var(--dark-bg)] p-4 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
