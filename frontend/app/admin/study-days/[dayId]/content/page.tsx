'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { studyDaysApi } from '@/lib/api';
import { StudyDay } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AdminLessonEditor } from '@/components/lessons/admin-lesson-editor';

export default function AdminStudyDayContentPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const { dayId } = use(params);

  const [studyDay, setStudyDay] = useState<StudyDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadDay = useCallback(async () => {
    try {
      const data = await studyDaysApi.getById(dayId);
      setStudyDay(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load study day.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dayId]);

  useEffect(() => {
    loadDay();
  }, [loadDay]);

  const handleSaveContent = async (newContent: string) => {
    if (!studyDay) return;
    setSaving(true);
    try {
      await studyDaysApi.update(studyDay.id, {
        content: newContent,
      });
      setStudyDay((prev) => (prev ? { ...prev, content: newContent } : null));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !studyDay) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm max-w-7xl mx-auto space-y-4">
        <p>{error || 'Study day not found.'}</p>
        <Link href="/admin/study-days">
          <Button variant="outline" size="sm">
            Back to Study Days
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link
            href="/admin/study-days"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Study Days List</span>
          </Link>
          <div className="flex items-center space-x-3 pt-1">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
              DAY {String(studyDay.dayNumber).padStart(2, '0')}
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {studyDay.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/roadmap/${studyDay.id}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              <span>Open Student View</span>
            </Button>
          </Link>
          <Link href={`/admin/checklists?studyDayId=${studyDay.id}`}>
            <Button variant="outline" size="sm" className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              <span>Checklist Items</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Lesson Content Editor with Live Preview */}
      <AdminLessonEditor
        initialContent={studyDay.content}
        lessonTitle={studyDay.title}
        dayNumber={studyDay.dayNumber}
        onSave={handleSaveContent}
        isSaving={saving}
      />
    </div>
  );
}
