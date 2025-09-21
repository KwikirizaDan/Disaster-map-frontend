import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthHeader = () => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-10 py-3 bg-white">
      {/* Left side: Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="size-8 text-[var(--primary-500)]">
            <img 
              src="/DMU-LOG.svg" 
              alt="Disaster Map Uganda Logo" 
              className="h-8 w-8"
            />
          </div>
          <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
            Disaster Map Uganda
          </h2>
        </div>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-gray-900 font-semibold text-sm leading-normal'
                : 'text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal'
            }
          >
            Datagrid
          </NavLink>
          <NavLink
            to="/cards"
            className={({ isActive }) =>
              isActive
                ? 'text-gray-900 font-semibold text-sm leading-normal'
                : 'text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal'
            }
          >
            Cards
          </NavLink>
        </nav>
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            style={{
              backgroundImage: `url(${user?.avatarUrl || 'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg'})`,
            }}
            aria-label="Profile menu"
            aria-expanded={isProfileMenuOpen}
          ></button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Profile Settings
              </NavLink>
              <NavLink
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                Account Settings
              </NavLink>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;