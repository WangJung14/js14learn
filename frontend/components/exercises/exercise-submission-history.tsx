'use client';

import React from 'react';
import Link from 'next/link';
import { History, Clock, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Submission } from '@/types';
import { formatDate } from '@/lib/utils';

interface ExerciseSubmissionHistoryProps {
  submissions: Submission[];
}

export function ExerciseSubmissionHistory({
  submissions,
}: ExerciseSubmissionHistoryProps) {
  if (submissions.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 shadow-md">
        <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800/80 pb-3.5">
          <History className="w-4 h-4 text-slate-400" />
          <CardTitle className="text-base font-bold text-slate-200">
            Submission History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center py-8 space-y-2 text-slate-500 text-xs">
          <Clock className="w-7 h-7 mx-auto text-slate-600" />
          <p>No solutions submitted for this exercise yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/70 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-3.5 bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400" />
          <CardTitle className="text-base font-bold text-slate-200">
            Submission History
          </CardTitle>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          {submissions.length} Attempt{submissions.length > 1 ? 's' : ''}
        </span>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {submissions.map((sub, idx) => {
          const attemptIndex = submissions.length - idx;
          return (
            <div
              key={sub.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    #{attemptIndex}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[260px]">
                    {sub.submissionType === 'CODE' ? 'JavaScript Code Submission' : sub.fileName}
                  </span>
                </div>
                <Badge variant={sub.status} />
              </div>

              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{formatDate(sub.submittedAt)}</span>
              </div>

              {sub.note && (
                <div className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start space-x-2">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">&quot;{sub.note}&quot;</p>
                </div>
              )}

              {sub.adminNote && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-indigo-400 block text-[11px] uppercase tracking-wider">
                    Instructor Review:
                  </span>
                  <p className="text-slate-200 line-clamp-3">{sub.adminNote}</p>
                </div>
              )}

              <div className="pt-1">
                <Link href={`/submissions/${sub.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-slate-300 hover:text-indigo-300 hover:bg-slate-900 border border-slate-800/60 justify-between"
                  >
                    <span>View Submission Details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
