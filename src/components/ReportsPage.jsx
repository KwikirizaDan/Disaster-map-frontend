import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);


// This component will display interactive charts and data visualizations for disasters.
const ReportsPage = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch('https://disastermap.vercel.app/api/disasters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDisasters(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisasters();
  }, []);

  // Process data for charts, memoized to prevent re-calculation on every render
  const chartData = useMemo(() => {
    if (!disasters.length) {
      return {
        byType: { labels: [], datasets: [] },
        bySeverity: { labels: [], datasets: [] },
        overTime: { labels: [], datasets: [] },
      };
    }

    // Data for Disasters by Type chart
    const types = disasters.reduce((acc, disaster) => {
      acc[disaster.type] = (acc[disaster.type] || 0) + 1;
      return acc;
    }, {});
    const byType = {
      labels: Object.keys(types),
      datasets: [{
        label: 'Disasters by Type',
        data: Object.values(types),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }],
    };

    // Data for Disasters by Severity chart
    const severities = disasters.reduce((acc, disaster) => {
      acc[disaster.severity] = (acc[disaster.severity] || 0) + 1;
      return acc;
    }, {});
    const bySeverity = {
      labels: Object.keys(severities),
      datasets: [{
        label: 'Disasters by Severity',
        data: Object.values(severities),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      }],
    };

    // Data for Disasters over Time chart
    const byMonth = disasters.reduce((acc, disaster) => {
      const month = new Date(disaster.reported_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const sortedMonths = Object.keys(byMonth).sort((a, b) => new Date(a) - new Date(b));
    const overTime = {
      labels: sortedMonths,
      datasets: [{
        label: 'Disasters per Month',
        data: sortedMonths.map(month => byMonth[month]),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.6)',
        tension: 0.1,
      }],
    };

    return { byType, bySeverity, overTime };
  }, [disasters]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(disasters);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Disasters');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'disasters_report.xlsx');
  };

  if (loading) return <div className="text-white">Loading report data...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard & Reports</h1>
        <button
          onClick={handleExport}
          className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Export Raw Data
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--surface-2)] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Disasters by Type</h2>
          <Bar data={chartData.byType} />
        </div>
        <div className="bg-[var(--surface-2)] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Disasters by Severity</h2>
          <Pie data={chartData.bySeverity} />
        </div>
        <div className="bg-[var(--surface-2)] p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Disasters over Time</h2>
          <Line data={chartData.overTime} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
