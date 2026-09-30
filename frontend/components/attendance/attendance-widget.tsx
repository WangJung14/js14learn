'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { attendanceApi } from '@/lib/api';
import { TodayAttendanceData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceWidgetProps {
  compact?: boolean;
  initialData?: TodayAttendanceData | null;
  onUpdate?: (data: TodayAttendanceData) => void;
}

export function AttendanceWidget({
  compact = false,
  initialData = null,
  onUpdate,
}: AttendanceWidgetProps) {
  const [data, setData] = useState<TodayAttendanceData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceApi.getTodayAttendance();
      setData(res);
      if (onUpdate) onUpdate(res);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load today attendance.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onUpdate]);

  useEffect(() => {
    if (!initialData) {
      let active = true;
      const load = async () => {
        try {
          const res = await attendanceApi.getTodayAttendance();
          if (active) {
            setData(res);
            if (onUpdate) onUpdate(res);
          }
        } catch (err: unknown) {
          if (active) {
            const message =
              err instanceof Error ? err.message : 'Failed to load today attendance.';
            setError(message);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };
      void load();
      return () => {
        active = false;
      };
    }
  }, [initialData, onUpdate]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await attendanceApi.checkIn();
      await fetchAttendance();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to check in.';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await attendanceApi.checkOut();
      await fetchAttendance();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to check out.';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (loading) {
    return (
      <Card className={compact ? 'border-slate-800' : 'border-slate-800/80 bg-slate-900/60'}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardContent className="p-4 flex items-center justify-between text-xs text-rose-400">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error || 'Unable to load attendance data.'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchAttendance()}
            className="text-xs border-rose-500/40 hover:bg-rose-500/20"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { isCheckedIn, attendance } = data;
  const isCheckedOut = Boolean(attendance?.checkedOutAt);

  return (
    <Card className={compact ? 'border-slate-800' : 'border-slate-800/80 bg-slate-900/60'}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-lg font-bold text-slate-100">
            Today&apos;s Study Presence
          </CardTitle>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => void fetchAttendance()}
          title="Refresh Attendance"
          className="p-1.5 h-7 w-7 text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        {!isCheckedIn ? (
          /* STATE 1: NOT CHECKED IN */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Not Checked In Yet</span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                Start a lesson or exercise to record today&apos;s study presence.
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
              <Link href="/roadmap" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" className="w-full sm:w-auto shadow-md">
                  <BookOpen className="w-4 h-4 mr-2" /> Start Learning
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleCheckIn()}
                isLoading={actionLoading}
                className="text-xs border-slate-700"
              >
                Check In Now
              </Button>
            </div>
          </div>
        ) : !isCheckedOut ? (
          /* STATE 2: CHECKED IN / STUDYING NOW */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Studying Now</span>
              </div>
              <p className="text-sm font-medium text-slate-100">
                Session started at <span className="font-mono text-indigo-300 font-bold">{formatTime(attendance?.checkedInAt)}</span>
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleCheckOut()}
              isLoading={actionLoading}
              className="border-rose-500/40 text-rose-400 hover:bg-rose-500/20 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Check Out
            </Button>
          </div>
        ) : (
          /* STATE 3: CHECKED OUT */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Study Session Complete</span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {formatTime(attendance?.checkedInAt)} → {formatTime(attendance?.checkedOutAt)}
              </p>
            </div>

            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center flex-shrink-0 w-full sm:w-auto">
              <p className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">Total Duration</p>
              <p className="text-lg font-bold text-slate-100 font-mono">
                {formatDuration(attendance?.durationMinutes || 0)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
