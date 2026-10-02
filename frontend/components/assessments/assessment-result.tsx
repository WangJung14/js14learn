'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { AssessmentAttempt } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssessmentResultProps {
  attempt: AssessmentAttempt;
  passingScore?: number;
  canRetry?: boolean;
  onRetry?: () => void;
}

export function AssessmentResult({
  attempt,
  passingScore = 70,
  canRetry = false,
  onRetry,
}: AssessmentResultProps) {
  const isPending = attempt.status === 'PENDING_REVIEW';
  const isPassed = attempt.isPassed || attempt.status === 'PASSED';
  const answers = attempt.answers || [];

  return (
    <div
      role="region"
      aria-live="polite"
      className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 space-y-6 ${
        isPending
          ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-950/90'
          : isPassed
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-950/90'
            : 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-slate-950/90'
      }`}
    >
      {/* Header Stat & Outcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-start space-x-4">
          <div
            className={`p-3.5 rounded-2xl border shrink-0 ${
              isPending
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : isPassed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            {isPending ? (
              <Clock className="w-8 h-8 animate-pulse" />
            ) : isPassed ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge
                className={`text-xs font-bold ${
                  isPending
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {isPending
                  ? 'PENDING REVIEW'
                  : isPassed
                    ? 'PASSED'
                    : 'NEEDS IMPROVEMENT'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Attempt #{attempt.attemptNumber}
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white">
              {isPending
                ? 'Submitted for Instructor Review'
                : isPassed
                  ? 'Assessment Passed!'
                  : 'Assessment Incomplete / Failed'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300">
              {isPending
                ? 'Your submission includes open-ended questions pending manual instructor evaluation.'
                : isPassed
                  ? 'Great job! Your score meets or exceeds the required passing threshold.'
                  : `Your overall score of ${attempt.percentage.toFixed(0)}% is below the required ${passingScore}%. Review your answers below and retry.`}
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shrink-0 shadow-lg min-w-40">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-mono font-black text-white">
              {attempt.score}
            </span>
            <span className="text-sm font-mono text-slate-400">
              / {attempt.totalPoints} pts
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-semibold mt-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300">
              {attempt.percentage.toFixed(0)}% Score
            </span>
            <span className="text-slate-500 font-normal">
              (Req: {passingScore}%)
            </span>
          </div>
        </div>
      </div>

      {/* Per-Question Results Breakdown */}
      {answers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Question Breakdown ({answers.length} Questions)
          </h4>

          <div className="space-y-3">
            {answers.map((ans, idx) => {
              const isAnsCorrect = ans.isCorrect || ans.status === 'PASSED';
              const isAnsPending = ans.status === 'PENDING_REVIEW';

              return (
                <div
                  key={ans.id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAnsPending
                      ? 'bg-slate-950/60 border-amber-500/30'
                      : isAnsCorrect
                        ? 'bg-slate-950/60 border-emerald-500/30'
                        : 'bg-slate-950/60 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isAnsPending
                            ? 'bg-amber-500/20 text-amber-400'
                            : isAnsCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isAnsPending ? (
                          <Clock className="w-4 h-4" />
                        ) : isAnsCorrect ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            Question {idx + 1}
                          </span>
                          {ans.question?.type && (
                            <Badge className="text-[9px]">
                              {ans.question.type}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm font-bold text-white">
                          {ans.question?.title || `Question ${idx + 1}`}
                        </p>

                        {ans.studentAnswer && (
                          <p className="text-xs text-slate-300">
                            <strong className="text-slate-400">Your Answer:</strong>{' '}
                            <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {ans.studentAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-mono font-bold text-white">
                        {ans.score} / {ans.maxScore} pts
                      </span>
                    </div>
                  </div>

                  {/* Feedback and Notes */}
                  {ans.feedback && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      <strong>Feedback:</strong> {ans.feedback}
                    </div>
                  )}

                  {ans.adminFeedback && (
                    <div className="mt-2 text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                      <strong>Instructor Feedback:</strong> {ans.adminFeedback}
                    </div>
                  )}

                  {ans.question?.explanation && (
                    <div className="mt-2 text-xs text-indigo-300 bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/20">
                      <strong>Note:</strong> {ans.question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Try Again Action */}
      {!isPassed && canRetry && onRetry && (
        <div className="pt-2 flex justify-end">
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 space-x-2 font-bold px-5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
}
