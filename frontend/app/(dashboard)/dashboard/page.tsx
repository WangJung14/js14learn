'use client';

import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { DashboardData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroBanner } from '@/components/dashboard/hero-banner';
import { CurrentLessonCard } from '@/components/dashboard/current-lesson-card';
import { OverallCompletionCard } from '@/components/dashboard/overall-completion-card';
import { StatisticsGrid } from '@/components/dashboard/statistics-grid';
import { RecentGroupActivity } from '@/components/dashboard/recent-group-activity';
import { AttendanceWidget } from '@/components/attendance/attendance-widget';
import { StudyDayChecklist } from '@/components/checklists/study-day-checklist';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await dashboardApi.getDashboardData();
        setData(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard statistics.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm max-w-7xl mx-auto shadow-lg">
        {error || 'Unable to load dashboard.'}
      </div>
    );
  }

  const { user, progress, currentDay, statistics, recentActivity } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Hero Banner */}
      <HeroBanner user={user} />

      {/* 2. Main Dashboard Grid: Current Lesson Focus (2 cols) + Overall Completion (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CurrentLessonCard currentDay={currentDay} />
        </div>
        <div className="lg:col-span-1">
          <OverallCompletionCard progress={progress} />
        </div>
      </div>

      {/* 3. Secondary Grid: Today's Study Presence + Today's Study Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceWidget compact initialData={data.todayAttendance} />
        <StudyDayChecklist compact title="Today's Study Checklist" initialData={data.todayChecklist} />
      </div>

      {/* 4. Statistics 4-Card Grid */}
      <StatisticsGrid statistics={statistics} />

      {/* 5. Recent Group Activity Stream */}
      <RecentGroupActivity recentActivity={recentActivity} />
    </div>
  );
}
