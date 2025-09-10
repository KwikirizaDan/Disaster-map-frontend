import React, { useState, useEffect } from 'react';
import { reports as mockReports } from '../api/mockData';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a report generation process
    alert('Generating report...');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="bg-[var(--main-container-bg)] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
        <form onSubmit={handleGenerateReport}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-[var(--text-secondary)]">Report Type</label>
              <select id="reportType" name="reportType" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Air Pollution</option>
                <option>All Devices</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-[var(--text-secondary)]">From</label>
              <input type="date" id="dateFrom" name="dateFrom" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-[var(--text-secondary)]">To</label>
              <input type="date" id="dateTo" name="dateTo" className="mt-1 block w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              Generate Report
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[var(--main-container-bg)] rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--surface-2)]">
            <tr>
              <th scope="col" className="px-6 py-3">Report Title</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Date Generated</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="bg-[var(--main-container-bg)] border-b border-[var(--border-color)] hover:bg-[var(--surface-1)]">
                <td className="px-6 py-4 font-medium text-white">{report.title}</td>
                <td className="px-6 py-4">{report.type}</td>
                <td className="px-6 py-4">{report.dateGenerated}</td>
                <td className="px-6 py-4">
                  <a href={report.downloadUrl} className="text-[var(--accent-blue)] hover:underline">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
