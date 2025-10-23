"use client";

import AuthHeader from '@/components/AuthHeader';
import DisasterGrid from '@/components/DisasterGrid';
import { AuthProvider } from '@/contexts/AuthContext';

export default function DisastersPage() {
  return (
    <AuthProvider>
      <AuthHeader />
      <DisasterGrid />
    </AuthProvider>
  );
}
