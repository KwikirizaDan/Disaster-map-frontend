import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/disasters');
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

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error: {error.message}</div>;

  const disasterTypes = disasters.reduce((acc, disaster) => {
    acc[disaster.type] = (acc[disaster.type] || 0) + 1;
    return acc;
  }, {});

  const disasterSeverity = disasters.reduce((acc, disaster) => {
    acc[disaster.severity] = (acc[disaster.severity] || 0) + 1;
    return acc;
  }, {});

  const typeData = {
    labels: Object.keys(disasterTypes),
    datasets: [
      {
        label: '# of Disasters by Type',
        data: Object.values(disasterTypes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const severityData = {
    labels: Object.keys(disasterSeverity),
    datasets: [
      {
        label: '# of Disasters by Severity',
        data: Object.values(disasterSeverity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--surface-2)] p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Disasters by Type</h2>
          <Bar data={typeData} />
        </div>
        <div className="bg-[var(--surface-2)] p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Disasters by Severity</h2>
          <Pie data={severityData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
