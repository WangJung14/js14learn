'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Map,
  CheckCircle2,
  FileCode,
  Flame,
  ArrowRight,
  Activity as ActivityIcon,
  BookOpen,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { DashboardData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await dashboardApi.getDashboardData();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 col-span-2" />
          <Skeleton className="h-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
        {error || 'Unable to load dashboard.'}
      </div>
    );
  }

  const { user, progress, currentDay, statistics, recentActivity } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Hello, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep pushing forward with your JavaScript study group.
          </p>
        </div>
        <Link href="/roadmap">
          <Button variant="primary" className="shadow-lg shadow-indigo-600/20">
            View Roadmap <Map className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Main Grid: Current Day Hero + Overall Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Day Card */}
        <Card className="lg:col-span-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none">
            <BookOpen className="w-40 h-40" />
          </div>
          <CardHeader>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Current Lesson Focus</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-slate-100 pt-1">
              {currentDay ? `Day ${String(currentDay.dayNumber).padStart(2, '0')} — ${currentDay.title}` : 'All Days Completed! 🎉'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {currentDay ? currentDay.description : 'You have completed all 14 study days in the JavaScript curriculum!'}
            </p>

            {currentDay && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href={`/roadmap/${currentDay.id}`}>
                  <Button variant="primary" size="lg" className="shadow-lg shadow-indigo-600/30">
                    Continue Learning <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-xs text-slate-400 font-mono">
                  {currentDay.exerciseCount} exercises to complete
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Progress Card */}
        <Card className="flex flex-col justify-between space-y-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Overall Completion</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center py-2 space-y-2">
              <span className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                {progress.percentage}%
              </span>
              <p className="text-xs text-slate-400">Roadmap Completion</p>
            </div>

            <ProgressBar value={progress.percentage} />

            <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-slate-800">
              <div>
                <p className="text-lg font-bold text-slate-100">{progress.completedDays} / {progress.totalDays}</p>
                <p className="text-[11px] text-slate-400">Completed Days</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-100">{progress.completedExercises} / {progress.totalExercises}</p>
                <p className="text-[11px] text-slate-400">Approved Exercises</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Completed Days</p>
            <p className="text-xl font-bold text-slate-100">{statistics.completedDays} / {statistics.totalDays}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Approved Exercises</p>
            <p className="text-xl font-bold text-slate-100">{statistics.completedExercises} / {statistics.totalExercises}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Submissions</p>
            <p className="text-xl font-bold text-slate-100">{statistics.totalSubmissions}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Current Streak</p>
            <p className="text-xl font-bold text-slate-100">{statistics.streakDays} Days</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity Stream */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <ActivityIcon className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg font-bold">Recent Group Activity</CardTitle>
          </div>
          <Link href="/activity" className="text-xs text-indigo-400 hover:underline font-medium flex items-center space-x-1">
            <span>View All Activity</span>
            <span>→</span>
          </Link>
        </CardHeader>

        <CardContent className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No recent group activity logged yet.</p>
          ) : (
            recentActivity.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img
                    src={
                      act.user?.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        act.user?.name || 'User',
                      )}`
                    }
                    alt={act.user?.name || 'User'}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{act.message}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{formatTimeAgo(act.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
