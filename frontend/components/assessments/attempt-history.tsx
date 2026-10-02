'use client';

import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Layers, Check, X } from 'lucide-react';
import { AssessmentAttempt } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AttemptHistoryProps {
  attempts: AssessmentAttempt[];
}

export function AttemptHistory({ attempts }: AttemptHistoryProps) {
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);

  if (!attempts || attempts.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedAttemptId(expandedAttemptId === id ? null : id);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <History className="w-4 h-4 text-indigo-400" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Attempt History ({attempts.length})
        </h4>
      </div>

      <div className="space-y-3">
        {attempts.map((att) => {
          const isPassed = att.isPassed || att.status === 'PASSED';
          const isPending = att.status === 'PENDING_REVIEW';
          const isExpanded = expandedAttemptId === att.id;
          const answers = att.answers || [];

          return (
            <div
              key={att.id}
              className="rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all overflow-hidden"
            >
              <div
                onClick={() => toggleExpand(att.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-slate-900/40 transition-colors gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                    #{att.attemptNumber}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      {isPending ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          <XCircle className="w-3 h-3 mr-1" />
                          Incorrect
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {att.score} / {att.totalPoints} pts ({att.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Submitted: {formatDate(att.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  {answers.length > 0 && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      {answers.length} Qs
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable Per-Question Breakdown */}
              {isExpanded && answers.length > 0 && (
                <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-2.5 animate-in fade-in">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Question Answers:
                  </p>
                  {answers.map((ans, aIdx) => {
                    const ansPassed = ans.isCorrect || ans.status === 'PASSED';
                    const ansPending = ans.status === 'PENDING_REVIEW';

                    return (
                      <div
                        key={ans.id || aIdx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <div
                            className={`p-1 rounded shrink-0 ${
                              ansPending
                                ? 'bg-amber-500/20 text-amber-400'
                                : ansPassed
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {ansPending ? (
                              <Clock className="w-3 h-3" />
                            ) : ansPassed ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-200 truncate">
                              Q{aIdx + 1}: {ans.question?.title || `Question ${aIdx + 1}`}
                            </p>
                            {ans.studentAnswer && (
                              <p className="text-[11px] text-slate-400 truncate">
                                Ans: {ans.studentAnswer}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="font-mono text-xs font-bold text-slate-300 shrink-0">
                          {ans.score} / {ans.maxScore} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
