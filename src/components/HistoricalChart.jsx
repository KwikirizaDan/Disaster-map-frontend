import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HistoricalChart = () => {
  const data = {
    labels: ['-24h', '-20h', '-16h', '-12h', '-8h', '-4h', 'Now'],
    datasets: [{
      label: 'Temperature',
      data: [27, 27.5, 28, 29, 28.5, 28, 29],
      borderColor: 'var(--alert-red)',
      backgroundColor: 'rgba(248, 81, 73, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'var(--text-secondary)',
          callback: function(value, index, values) {
            return value + '°C';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-secondary)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default HistoricalChart;
