import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainApp from './MainApp';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import LiveThreatMap from './components/LiveThreatMap';
import VerifyEmailPage from './components/VerifyEmailPage';
import { useAuth } from './contexts/AuthContext';

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
    <Router>
      <Routes>
        <Route path="/" element={<LiveThreatMap />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/verify-email/:code" element={<VerifyEmailPage />} />

        {isAuthenticated && (
          <Route path="/app/*" element={<MainApp logout={logout} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
