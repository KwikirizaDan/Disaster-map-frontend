"use client";

import Dashboard from "@/components/Dashboard";
import NonAuthHeader from "@/components/NonAuthHeader";

export const metadata = {
  title: "Disaster Dashboard",
  description: "View statistics and trends about disasters.",
};

export default function DashboardPage() {
  return (
    <>
      <NonAuthHeader />
      <div className="p-8">
        <Dashboard />
      </div>
    </>
  );
}
