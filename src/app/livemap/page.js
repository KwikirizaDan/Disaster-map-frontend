"use client";

import LiveDisasterMap from '@/components/LiveDisasterMap';
import NonAuthHeader from '@/components/NonAuthHeader';

export const metadata = {
  title: "Live Disaster Map",
  description: "View a live map of disasters happening around the world.",
};

export default function LiveMapPage() {
  return (
    <>
      <NonAuthHeader />
      <LiveDisasterMap />
    </>
  );
}
