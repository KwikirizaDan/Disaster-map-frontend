import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainApp from './MainApp';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state

  // Mock login/logout functions
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? <MainApp logout={logout} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
