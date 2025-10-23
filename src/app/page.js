"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const metadata = {
  title: "Disaster Map",
  description: "A live map of disasters happening around the world.",
};

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        redirect('/disasters');
      } else {
        redirect('/livemap');
      }
    }
  }, [isAuthenticated, loading]);

  return <div>Loading...</div>;
}
