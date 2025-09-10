import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ReportsPage from './components/ReportsPage';
import DisastersPage from './components/DisastersPage';
import CreateDisasterPage from './components/CreateDisasterPage';
import DisasterDetailsPage from './components/DisasterDetailsPage';
import EditDisasterPage from './components/EditDisasterPage';
import ProtectedRoute from './components/ProtectedRoute';

const MainApp = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/disasters" element={<DisastersPage />} />
        <Route path="/disasters/:id" element={<DisasterDetailsPage />} />
        <Route
          path="/disasters/:id/edit"
          element={
            <ProtectedRoute roles={['admin', 'reporter']}>
              <EditDisasterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disasters/new"
          element={
            <ProtectedRoute roles={['admin', 'reporter']}>
              <CreateDisasterPage />
            </ProtectedRoute>
          }
        />
        {/* Fallback route for any other path within the main app */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
};

export default MainApp;
