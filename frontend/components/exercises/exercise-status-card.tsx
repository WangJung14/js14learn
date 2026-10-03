'use client';

import React from 'react';
import { CheckCircle2, Clock, FileCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Exercise, Submission } from '@/types';

interface ExerciseStatusCardProps {
  exercise: Exercise;
  submissions: Submission[];
}

export function ExerciseStatusCard({
  exercise,
  submissions,
}: ExerciseStatusCardProps) {
  const isApproved =
    exercise.submissionStatus === 'APPROVED' ||
    submissions.some((s) => s.status === 'APPROVED');

  const isPending =
    exercise.submissionStatus === 'PENDING' ||
    submissions.some((s) => s.status === 'PENDING');

  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-3.5 bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <CardTitle className="text-sm font-bold text-slate-200">
            Exercise Status
          </CardTitle>
        </div>
        {exercise.submissionStatus ? (
          <Badge variant={exercise.submissionStatus} />
        ) : (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Not Submitted
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 text-xs text-slate-300">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center space-x-2">
            {isApproved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : isPending ? (
              <Clock className="w-4 h-4 text-amber-400" />
            ) : (
              <FileCheck className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-medium text-slate-300">Status</span>
          </div>
          <span className="font-mono font-bold text-slate-200">
            {isApproved
              ? 'Approved'
              : isPending
                ? 'Under Review'
                : submissions.length > 0
                  ? 'Attempted'
                  : 'Not Started'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="block text-[11px] text-slate-400">Submissions</span>
            <span className="font-mono font-bold text-base text-slate-100 mt-0.5 block">
              {submissions.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="block text-[11px] text-slate-400">Difficulty</span>
            <span className="font-mono font-bold text-xs text-indigo-300 mt-1 block">
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
