'use client';

import React, { useEffect, useState, use } from 'react';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { studyDaysApi } from '@/lib/api';
import { StudyDay } from '@/types';
import { ChecklistManager } from '@/components/admin/checklist-manager';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminChecklistsPage({
  searchParams,
}: {
  searchParams?: Promise<{ studyDayId?: string }>;
}) {
  const resolvedParams = searchParams ? use(searchParams) : undefined;
  const initialStudyDayId = resolvedParams?.studyDayId || '';

  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>(initialStudyDayId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudyDays = async () => {
      try {
        const data = await studyDaysApi.getAll();
        setStudyDays(data);
        if (data.length > 0 && !selectedDayId) {
          setSelectedDayId(data[0].id);
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to load study days.');
      } finally {
        setLoading(false);
      }
    };
    void loadStudyDays();
  }, [selectedDayId]);

  const selectedDay = studyDays.find((d) => d.id === selectedDayId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/study-days"
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Study Days
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            <span>Admin Checklist Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure checklist tasks, types, order, and exercise links per study day
          </p>
        </div>

        {/* Study Day Selector */}
        {studyDays.length > 0 && (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
            <label className="text-xs font-medium text-slate-300">Select Study Day:</label>
            <select
              value={selectedDayId}
              onChange={(e) => setSelectedDayId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-indigo-400 font-semibold text-xs rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {studyDays.map((day) => (
                <option key={day.id} value={day.id}>
                  Day {day.dayNumber}: {day.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {selectedDayId ? (
        <ChecklistManager
          studyDayId={selectedDayId}
          studyDayTitle={selectedDay ? `Day ${selectedDay.dayNumber}: ${selectedDay.title}` : 'Study Day'}
        />
      ) : (
        <div className="p-8 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl">
          No Study Days found in curriculum. Please create a Study Day first.
        </div>
      )}
    </div>
  );
}
