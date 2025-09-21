import React, { useState, useEffect } from 'react';
import NonAuthHeader from './NonAuthHeader';

const Dashboard = () => {
  const [disasterData, setDisasterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/disasters');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDisasterData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <>
    <div className="bg-gray-50 text-gray-900">
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 px-10 py-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">Disaster Statistics
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Explore detailed statistical data on various disasters, including historical trends, impact
                  analyses, and affected populations.
                </p>
              </div>
              <section>
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight mb-4">Historical Trends
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Number of Reported Incidents Over
                          Time</p>
                        <p className="text-gray-900 text-3xl font-bold mt-1">12,345</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <span className="material-symbols-outlined text-base">trending_up</span>
                        <span>+15%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <svg className="w-full h-48" fill="none" preserveAspectRatio="none"
                        viewBox="-3 0 478 150" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                          fill="url(#paint0_linear_1131_5935_new)"></path>
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                          stroke="var(--primary-500)" strokeLinecap="round" strokeWidth="2"></path>
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse"
                            id="paint0_linear_1131_5935_new" x1="236" x2="236" y1="1" y2="149">
                            <stop stopColor="var(--primary-500)" stopOpacity="0.3"></stop>
                            <stop offset="1" stopColor="var(--primary-500)" stopOpacity="0">
                            </stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Types of Disasters</p>
                        <p className="text-gray-900 text-3xl font-bold mt-1">5,678</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                        <span className="material-symbols-outlined text-base">trending_down</span>
                        <span>-5%</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-5 gap-4 items-end justify-items-center">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '10%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Earthquake</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '20%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Flood</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '90%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Wildfire</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '20%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Hurricane</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '40%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Tornado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mt-8">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight mb-4">Impact Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Affected Populations by Disaster
                          Type</p>
                        <p className="text-gray-900 text-3xl font-bold mt-1">2,345,678</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <span className="material-symbols-outlined text-base">trending_up</span>
                        <span>+10%</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
                      <p className="text-gray-600 text-xs">Earthquake</p>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[var(--primary-500)] h-2.5 rounded-full" style={{ width: '50%' }}>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">Flood</p>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[var(--primary-500)] h-2.5 rounded-full" style={{ width: '80%' }}>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">Wildfire</p>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[var(--primary-500)] h-2.5 rounded-full" style={{ width: '10%' }}>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">Hurricane</p>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[var(--primary-500)] h-2.5 rounded-full" style={{ width: '50%' }}>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs">Tornado</p>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[var(--primary-500)] h-2.5 rounded-full" style={{ width: '20%' }}>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Casualties by Disaster Type</p>
                        <p className="text-gray-900 text-3xl font-bold mt-1">12,345</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                        <span className="material-symbols-outlined text-base">trending_down</span>
                        <span>-2%</span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-5 gap-4 items-end justify-items-center">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '40%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Earthquake</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '20%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Flood</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '10%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Wildfire</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm" style={{ height: '30%' }}>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Hurricane</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full bg-gray-100 rounded-sm h-32 flex items-end">
                          <div className="bg-[var(--primary-500)] w-full rounded-sm"
                            style={{ height: '100%' }}></div>
                        </div>
                        <p className="text-gray-600 text-xs text-center">Tornado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mt-8">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight mb-4">Additional Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="rounded-md border border-gray-200 bg-white p-6">
                    <p className="text-gray-600 text-sm font-medium">Total Incidents Reported</p>
                    <p className="text-gray-900 text-2xl font-bold mt-2">25,678</p>
                    <p className="text-green-600 text-sm font-medium mt-1">+5%</p>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-6">
                    <p className="text-gray-600 text-sm font-medium">Total Population Affected</p>
                    <p className="text-gray-900 text-2xl font-bold mt-2">5,678,901</p>
                    <p className="text-red-600 text-sm font-medium mt-1">-3%</p>
                  </div>
                  <div className="rounded-md border border-gray-200 bg-white p-6">
                    <p className="text-gray-600 text-sm font-medium">Average Response Time</p>
                    <p className="text-gray-900 text-2xl font-bold mt-2">48 Hours</p>
                    <p className="text-green-600 text-sm font-medium mt-1">+2%</p>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;