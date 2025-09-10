import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeLinkClass = "text-[var(--tab-active-text)] font-semibold border-b-2 border-[var(--tab-active-border)] pb-1";
  const inactiveLinkClass = "text-[var(--tab-inactive-text)] hover:text-white";

  return (
    <header className="bg-[var(--main-container-bg)] text-[var(--text-primary)] border-b border-[var(--border-color)]">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <button onClick={toggleSidebar} className="text-white md:hidden">
              <span className="material-icons">menu</span>
            </button>
            <span className="material-icons text-[var(--accent-green)] text-3xl">public</span>
            <h1 className="text-xl font-bold text-white">EnviroMon</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Dashboard</NavLink>
            <NavLink to="/alerts" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Alerts</NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Reports</NavLink>
            <NavLink to="/disasters" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>Disasters</NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative">
            <span className="material-icons text-[var(--text-secondary)] hover:text-white">notifications</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
              <img alt="User avatar" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoFpERwYVYCiFsQPRROIvgY5LI0nSSG5zxmpSFDdkuFJkr6Pt0aJoiSpRoKne8T30RLxjrqane-vt5SBMI48H1rZrIiczEi8awezP90dSKBAcrgirKDfwdnJiH1IXr88-nT_hlGqP8Nt3lkXoffth-PzrI4xpvH7_flZh-KrfPBn5Qo2YkYn6vn9t8RVZHJdoxuZG1fmgmVtBSzaI2QmpNV9B28iQFR7JH0VvYHQl4uI4f0U6mzUOKCIGKuYMmTpN6KKMGeZKl0DQ" />
              <span className="text-sm font-medium text-white hidden sm:inline">{user?.name || 'User'}</span>
              <span className="material-icons text-sm text-[var(--text-secondary)] hidden sm:inline">expand_more</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--main-container-bg)] rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-2)]">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-2)]">Settings</a>
                <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-[var(--alert-red)] hover:bg-[var(--surface-2)]">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
