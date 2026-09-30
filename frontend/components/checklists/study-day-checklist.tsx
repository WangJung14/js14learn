'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  Lock,
  ExternalLink,
  BookOpen,
  Code2,
  Award,
  Folder,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { checklistsApi } from '@/lib/api';
import { StudyDayChecklistData, ChecklistItem, ChecklistItemType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface StudyDayChecklistProps {
  studyDayId?: string;
  compact?: boolean;
  title?: string;
  initialData?: StudyDayChecklistData | null;
  onUpdate?: (data: StudyDayChecklistData) => void;
}

export function StudyDayChecklist({
  studyDayId,
  compact = false,
  title,
  initialData = null,
  onUpdate,
}: StudyDayChecklistProps) {
  const [data, setData] = useState<StudyDayChecklistData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchChecklist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = studyDayId
        ? await checklistsApi.getStudyDayChecklist(studyDayId)
        : await checklistsApi.getTodayChecklist();
      setData(res);
      if (onUpdate) onUpdate(res);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load study checklist.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [studyDayId, onUpdate]);

  useEffect(() => {
    if (!initialData) {
      let active = true;
      const load = async () => {
        try {
          const res = studyDayId
            ? await checklistsApi.getStudyDayChecklist(studyDayId)
            : await checklistsApi.getTodayChecklist();
          if (active) {
            setData(res);
            if (onUpdate) onUpdate(res);
          }
        } catch (err: unknown) {
          if (active) {
            const message =
              err instanceof Error ? err.message : 'Failed to load study checklist.';
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
  }, [studyDayId, initialData, onUpdate]);

  const handleToggle = async (item: ChecklistItem) => {
    if (updatingItemId || item.type === 'EXERCISE') return;
    setUpdatingItemId(item.id);
    setError(null);
    try {
      const res = item.isCompleted
        ? await checklistsApi.uncompleteItem(item.id)
        : await checklistsApi.completeItem(item.id);
      setData(res);
      if (onUpdate) onUpdate(res);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update checklist item.';
      setError(message);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getItemBadge = (type: ChecklistItemType) => {
    switch (type) {
      case 'LESSON':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-3 h-3 mr-1" /> Lesson
          </span>
        );
      case 'EXERCISE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code2 className="w-3 h-3 mr-1" /> Exercise
          </span>
        );
      case 'PROJECT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Folder className="w-3 h-3 mr-1" /> Project
          </span>
        );
      case 'CHECKPOINT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-3 h-3 mr-1" /> Checkpoint
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
            Task
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Card className={compact ? 'border-slate-800' : 'border-slate-800/80 bg-slate-900/60'}>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-2 w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
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
            <span>{error || 'Unable to load study checklist.'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchChecklist()}
            className="text-xs border-rose-500/40 hover:bg-rose-500/20"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { summary, items } = data;
  const displayedItems = compact ? items.slice(0, 5) : items;

  return (
    <Card className={compact ? 'border-slate-800' : 'border-slate-800/80 bg-slate-900/60'}>
      <CardHeader className="pb-4 border-b border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg font-bold text-slate-100">
              {title || (data.studyDay ? `Day ${data.studyDay.dayNumber} Checklist` : "Study Checklist")}
            </CardTitle>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="font-semibold text-slate-300">
              {summary.completedItems} / {summary.totalItems} Completed
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              {summary.percentage}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void fetchChecklist()}
              title="Refresh Checklist"
              className="p-1.5 h-7 w-7 text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <ProgressBar value={summary.percentage} />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {displayedItems.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            No checklist items defined for this study day yet.
          </p>
        ) : (
          displayedItems.map((item) => {
            const isExerciseManaged = item.type === 'EXERCISE';
            return (
              <div
                key={item.id}
                className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                  item.isCompleted
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-90'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  {/* Accessible Toggle Button */}
                  <button
                    type="button"
                    onClick={() => void handleToggle(item)}
                    disabled={isExerciseManaged || updatingItemId === item.id}
                    title={
                      isExerciseManaged
                        ? item.isCompleted
                          ? 'Automatically completed via approved exercise solution'
                          : 'Requires admin approved exercise solution'
                        : item.isCompleted
                          ? 'Click to uncheck task'
                          : 'Click to mark task complete'
                    }
                    className={`mt-0.5 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-transform ${
                      isExerciseManaged
                        ? 'cursor-not-allowed'
                        : 'hover:scale-105 active:scale-95 cursor-pointer'
                    }`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : isExerciseManaged ? (
                      <Lock className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 hover:text-slate-300 flex-shrink-0" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-medium leading-snug ${
                          item.isCompleted
                            ? 'line-through text-slate-400'
                            : 'text-slate-100'
                        }`}
                      >
                        {item.title}
                      </span>

                      {getItemBadge(item.type)}

                      {item.isRequired ? (
                        <span className="text-[10px] text-rose-400/90 font-mono">
                          *Required
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Optional
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {isExerciseManaged && (
                      <p className="text-[11px] text-slate-500 italic">
                        {item.isCompleted
                          ? '✓ Solution approved by instructor'
                          : 'Requires submitting an exercise solution for review'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Linked Exercise Navigation Link */}
                {item.exerciseId && (
                  <Link href={`/exercises/${item.exerciseId}`} className="ml-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 h-7"
                      title="Go to Linked Exercise"
                    >
                      <span>Exercise</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
