import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, showLabel = false, className, size = 'md' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-400">
          <span>Overall Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50', heights[size], className)}>
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
