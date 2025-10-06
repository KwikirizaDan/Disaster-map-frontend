import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthHeader from './components/AuthHeader';
import NonAuthHeader from './components/NonAuthHeader';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import Dashboard from './components/Dashboard';
import DisasterGrid from './components/DisasterGrid';
import LiveDisasterMap from './components/LiveDisasterMap';
import LoadingSpinner from './components/LoadingSpinner';
import ReportDisaster from './components/ReportDisaster';
import EditDisaster from './components/EditDisaster';
import DisasterDetails from './components/DisasterDetails';
import AuthDisasterDetails from './components/AuthDisasterDetails';
import Docs from './components/Docs';
import DisasterCards from './components/DisasterCards';
import PublicDisasterCards from './components/PublicDisasterCards';
import ResetPasswordPage from './components/ResetPasswordPage';
import ConfirmationCodePage from './components/ConfirmationCodePage';
import EmailVerifiedPage from './components/EmailVerifiedPage';
import Disasters from './components/Disasters';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Main App Layout with Auth Header
function MainAppLayout({ children }) {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}

// Public Layout with NonAuth Header
function PublicLayout({ children }) {
  return (
    <>
      <NonAuthHeader />
      {children}
    </>
  );
}

// Main App Component
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes with NonAuthHeader */}
        <Route 
          path="/login" 
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } 
        />

      
        <Route 
          path="/register" 
          element={
            <PublicLayout>
              <RegistrationPage />
            </PublicLayout>
          } 
        />

        
        <Route 
          path="/disaster/cards" 
          element={
            <PublicLayout>
              <PublicDisasterCards />
            </PublicLayout>
          } 
        />

        <Route 
          path="/resetpassword" 
          element={
            <PublicLayout>
              <ResetPasswordPage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/confirm-email" 
          element={
            <PublicLayout>
              <ConfirmationCodePage />
            </PublicLayout>
          } 
        />

        <Route 
          path="/verify-email/:code" 
          element={
            <PublicLayout>
              <EmailVerifiedPage/>
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/docs" 
          element={
            <PublicLayout>
              <Docs />
            </PublicLayout>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <PublicLayout>
              <Dashboard />
            </PublicLayout>
          } 
        />


        <Route 
          path="/diz" 
          element={
            <PublicLayout>
              <Disasters />
            </PublicLayout>
          } 
        />

        <Route 
          path="/verify-email/:code" 
          element={<VerifyEmailPage />} 
        />

         <Route 
          path="/disaster/details/:id" 
          element={
            <PublicLayout>
              <DisasterDetails />
            </PublicLayout>
          } 
        />
        
        {/* Protected routes with AuthHeader */}
        <Route 
          path="/disasters" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <DisasterGrid />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />
       
        <Route 
          path="/disasters/new" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <ReportDisaster />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />

         { 
        <Route 
          path="/disasters/edit/:id" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <EditDisaster />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />
         }

        <Route 
          path="/disasters/details/:id" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <AuthDisasterDetails />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/cards" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <DisasterCards />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/data" 
          element={
            <ProtectedRoute>
              <MainAppLayout>
                <DisasterGrid />
              </MainAppLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Map page - public but shows different header based on auth status */}
        <Route 
          path="/livemap" 
          element={<LiveDisasterMap />} 
        />
        
        {/* Home page - redirect based on auth status */}
        <Route 
          path="/" 
          element={<HomeRedirect />} 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Home redirect component
function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/disasters" replace />;
  } else {
    return <Navigate to="/livemap" replace />;
  }
}

// Export the app wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}