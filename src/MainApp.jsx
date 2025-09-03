import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TablePage from './components/TablePage';
import ReportsPage from './components/ReportsPage';
import AddDevicePage from './components/AddDevicePage';
import ViewDetailsPage from './components/ViewDetailsPage';

const MainApp = ({ logout }) => {
  return (
    <Layout logout={logout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<TablePage />} />
        <Route path="/devices/new" element={<AddDevicePage />} />
        <Route path="/devices/:id" element={<ViewDetailsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        {/* Fallback route for any other path within the main app */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
};

export default MainApp;
