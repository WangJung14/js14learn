import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressStatus, SubmissionStatus, ExerciseDifficulty } from '@/types';

type BadgeType = ProgressStatus | SubmissionStatus | ExerciseDifficulty | 'STUDENT' | 'ADMIN' | 'UNSUBMITTED';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeType;
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  const getBadgeStyle = (varType?: BadgeType) => {
    switch (varType) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'IN_PROGRESS':
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOCKED':
      case 'UNSUBMITTED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'EASY':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'HARD':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'ADMIN':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold';
      case 'STUDENT':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        getBadgeStyle(variant),
        className,
      )}
      {...props}
    >
      {children || variant}
    </span>
  );
}
