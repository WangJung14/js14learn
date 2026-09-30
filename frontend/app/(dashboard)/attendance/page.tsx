'use client';

import React, { useEffect, useState } from 'react';
import {
  Clock,
  Flame,
  Trophy,
  CalendarCheck,
  Hourglass,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { attendanceApi } from '@/lib/api';
import { AttendanceStatsData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AttendanceWidget } from '@/components/attendance/attendance-widget';
import { AttendanceCalendar } from '@/components/attendance/attendance-calendar';

export default function AttendancePage() {
  const [statsData, setStatsData] = useState<AttendanceStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAttendanceStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getStats();
      setStatsData(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load attendance statistics.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendanceStats();
  }, []);

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    if (!minutes || minutes <= 0) return 'Active session';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm max-w-5xl mx-auto space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error || 'Unable to load attendance page data.'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadAttendanceStats()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Loading
        </Button>
      </div>
    );
  }

  const { today, statistics, recentRecords } = statsData;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <Clock className="w-7 h-7 text-indigo-400" />
            <span>Attendance & Study Habits</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your daily participation, study sessions, and learning consistency.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadAttendanceStats()}
          className="self-start sm:self-auto border-slate-800 text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </Button>
      </div>

      {/* 1. Today's Study Presence Card */}
      <AttendanceWidget initialData={today} onUpdate={() => void loadAttendanceStats()} />

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center space-x-3 border-slate-800">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Streak
            </p>
            <p className="text-xl font-extrabold text-slate-100 font-mono">
              {statistics.currentStreak} Days
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-slate-800">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl flex-shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Longest Streak
            </p>
            <p className="text-xl font-extrabold text-slate-100 font-mono">
              {statistics.longestStreak} Days
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-slate-800">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl flex-shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Attended
            </p>
            <p className="text-xl font-extrabold text-slate-100 font-mono">
              {statistics.totalAttendanceDays} Days
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-slate-800">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl flex-shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Study Time
            </p>
            <p className="text-xl font-extrabold text-slate-100 font-mono">
              {formatDuration(statistics.totalStudyMinutes)}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 border-slate-800 col-span-2 lg:col-span-1">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Avg Daily Time
            </p>
            <p className="text-xl font-extrabold text-slate-100 font-mono">
              {formatDuration(statistics.averageStudyMinutes)}
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Monthly Calendar Visualization */}
      <AttendanceCalendar records={recentRecords} />

      {/* 4. Recent Attendance History Table */}
      <Card className="border-slate-800">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Recent Attendance Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {recentRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No study attendance records found yet. Start learning today!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-in Time</th>
                    <th className="py-3 px-4">Check-out Time</th>
                    <th className="py-3 px-4 text-right">Study Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {recentRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-900/50 transition-colors text-slate-200"
                    >
                      <td className="py-3.5 px-4 font-bold text-indigo-400">{record.date}</td>
                      <td className="py-3.5 px-4">{formatTime(record.checkedInAt)}</td>
                      <td className="py-3.5 px-4">
                        {record.checkedOutAt ? (
                          formatTime(record.checkedOutAt)
                        ) : (
                          <span className="text-emerald-400 font-semibold animate-pulse">
                            Studying now...
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                        {formatDuration(record.durationMinutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
