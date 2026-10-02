'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code2, ArrowRight } from 'lucide-react';
import { studyDaysApi, attendanceApi } from '@/lib/api';
import { StudyDay } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StudyDayChecklist } from '@/components/checklists/study-day-checklist';
import { LessonContentRenderer } from '@/components/lessons/lesson-content-renderer';

export default function StudyDayDetailPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = use(params);

  const [day, setDay] = useState<StudyDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDay() {
      try {
        const result = await studyDaysApi.getById(dayId);
        setDay(result);
        // Automatic attendance check-in for learning context
        attendanceApi.checkIn().catch(() => {});
      } catch (err: any) {
        setError(err.message || 'Failed to load study day details.');
      } finally {
        setLoading(false);
      }
    }
    loadDay();
  }, [dayId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !day) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm max-w-4xl mx-auto space-y-4">
        <p>{error || 'Study day not found.'}</p>
        <Link href="/roadmap">
          <Button variant="outline" size="sm">Back to Roadmap</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/roadmap"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Study Roadmap</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
            DAY {String(day.dayNumber).padStart(2, '0')}
          </span>
          <Badge variant={day.progressStatus || 'LOCKED'} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{day.title}</h1>
        <p className="text-sm text-slate-400 leading-relaxed">{day.description}</p>
      </div>

      {/* Rich Interactive Lesson Content Document */}
      <LessonContentRenderer
        content={day.content}
        title={day.title}
        dayNumber={day.dayNumber}
        showTocSidebar={true}
      />

      {/* Study Checklist Section */}
      <StudyDayChecklist studyDayId={dayId} />

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Day Exercises</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {day.exercises?.length || 0} exercises assigned
          </span>
        </div>

        {!day.exercises || day.exercises.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            No exercises assigned for this day yet.
          </Card>
        ) : (
          <div className="space-y-3">
            {day.exercises.map((ex, index) => (
              <Link key={ex.id} href={`/exercises/${ex.id}`} className="block group">
                <Card className="p-5 border-slate-800/80 hover:border-indigo-500/50 transition-all bg-slate-900/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <span className="text-xs font-mono font-bold text-slate-500 pt-1">
                        #{index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {ex.title}
                          </h3>
                          <Badge variant={ex.difficulty} />
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{ex.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2 sm:pt-0">
                      <Button size="sm" variant="outline" className="group-hover:border-indigo-500/40">
                        Solve Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
