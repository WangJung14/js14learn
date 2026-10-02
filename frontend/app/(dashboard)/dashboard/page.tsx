'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  RefreshCw,
  Users,
  Compass,
  ArrowRight,
  CheckSquare,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { DashboardData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardApi.getDashboardData();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load dashboard statistics. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
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
      <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-100">Something went wrong</h2>
          <p className="text-sm text-slate-400">
            {error || "We couldn't load your dashboard data right now."}
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Button
            onClick={() => loadDashboard()}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  const { user, progress, currentDay, statistics, recentActivity } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* 1. Hero / Welcome Banner */}
      <HeroBanner user={user} />

      {/* 2. Main Progress & Current Day Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CurrentLessonCard currentDay={currentDay} />
        </div>
        <div className="lg:col-span-1">
          <OverallCompletionCard progress={progress} />
        </div>
      </div>

      {/* 3. Daily Study Presence & Checklist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceWidget compact initialData={data.todayAttendance} />
        <StudyDayChecklist compact title="Today's Study Checklist" initialData={data.todayChecklist} />
      </div>

      {/* 4. Quick Actions & Study Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (1 col) */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5">
            <Link
              href="/roadmap"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Compass className="w-4 h-4" />
                </div>
                <span>Full Learning Roadmap</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/attendance"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span>Attendance History</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/groups"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>Group Realtime Chat</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </CardContent>
        </Card>

        {/* Study Groups Highlight Card (2 cols) */}
        <Card className="lg:col-span-2 border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 shadow-xl flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-100">Study Groups</CardTitle>
                <p className="text-xs text-slate-400">Collaborate, practice coding, and share answers with peers</p>
              </div>
            </div>
            <Link
              href="/groups"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>View All Groups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-md text-left">
              <p className="text-sm font-semibold text-slate-200">
                Learn faster together with peers & mentors
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join an active JavaScript study group to participate in team challenges, review peer code, and exchange instant feedback.
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Link href="/groups" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto text-xs font-semibold">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  <span>Join / Open Groups</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Statistics Grid */}
      <StatisticsGrid statistics={statistics} />

      {/* 6. Recent Group Activity */}
      <RecentGroupActivity recentActivity={recentActivity} />
    </div>
  );
}
