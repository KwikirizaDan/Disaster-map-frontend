import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TablePage from './components/TablePage';
import ReportsPage from './components/ReportsPage';
import AddDevicePage from './components/AddDevicePage';
import ViewDetailsPage from './components/ViewDetailsPage';
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
        <Route path="/devices" element={<TablePage />} />
        <Route path="/devices/new" element={<AddDevicePage />} />
        <Route path="/devices/:id" element={<ViewDetailsPage />} />
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
