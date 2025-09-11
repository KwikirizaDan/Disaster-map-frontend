import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import MainApp from './MainApp';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import PublicMapPage from './components/PublicMapPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import { useAuth } from './contexts/AuthContext';
import '@mantine/core/styles.css';

function App() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="bg-[var(--dark-bg)] text-white flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/verify-email/:code" element={<VerifyEmailPage />} />
          {isAuthenticated ? (
            <Route path="/*" element={<MainApp logout={logout} />} />
          ) : (
            <>
              <Route path="/" element={<PublicMapPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
