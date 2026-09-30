'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map, ArrowRight, Lock, CheckCircle2, Clock } from 'lucide-react';
import { studyDaysApi, progressApi } from '@/lib/api';
import { StudyDay, ProgressSummary } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudyRoadmapPage() {
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const [daysData, progressData] = await Promise.all([
          studyDaysApi.getAll(),
          progressApi.getProgress(),
        ]);
        setStudyDays(daysData);
        setProgress(progressData);
      } catch (err: any) {
        setError(err.message || 'Failed to load study roadmap.');
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Map className="w-4 h-4" />
          <span>Curriculum Plan</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          14-Day JavaScript Study Roadmap
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Follow our carefully structured curriculum day by day to master core JavaScript concepts and build real projects.
        </p>
      </div>

      {/* Progress Card */}
      {progress && (
        <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400">Total Completion</span>
              <p className="text-2xl font-bold text-slate-100">
                {progress.completedDays} of {progress.totalDays} Days Completed
              </p>
            </div>
            <div className="w-full sm:w-64">
              <ProgressBar value={progress.percentage} showLabel />
            </div>
          </div>
        </Card>
      )}

      {/* 14-Day Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-800/80">
        {studyDays.map((day) => {
          const status = day.progressStatus || 'LOCKED';
          const isCompleted = status === 'COMPLETED';
          const isInProgress = status === 'IN_PROGRESS';

          return (
            <Link key={day.id} href={`/roadmap/${day.id}`} className="block group">
              <Card
                className={`transition-all duration-200 hover:border-indigo-500/60 relative ${
                  isInProgress
                    ? 'border-indigo-500/50 bg-indigo-950/10 shadow-lg shadow-indigo-600/10'
                    : isCompleted
                      ? 'border-emerald-500/30 bg-slate-900/90'
                      : 'border-slate-800/80 bg-slate-950/60 opacity-80'
                }`}
              >
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {/* Status Icon Indicator */}
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 mt-1 sm:mt-0 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isInProgress
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          DAY {String(day.dayNumber).padStart(2, '0')}
                        </span>
                        <Badge variant={status} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {day.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{day.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                      {day.exerciseCount || 0} exercises
                    </span>
                    <div className="p-2 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-600/10 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
