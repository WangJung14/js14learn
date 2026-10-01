'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/skeleton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner />
        <p className="text-sm text-slate-400 font-mono">Loading JS Study Hub session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Full Visibility Page Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed opacity-95 pointer-events-none z-0"
        style={{ backgroundImage: `url('/assets/images/background1.jpg')` }}
      />
      {/* Subtle Dark Radial Vignette for contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70 pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 relative z-10">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
