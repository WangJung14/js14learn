import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No Data Available',
  description = 'There are no items to display at this time.',
  icon = <FolderOpen className="w-12 h-12 text-slate-600" />,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 space-y-4',
        className,
      )}
    >
      <div className="p-3 bg-slate-800/50 rounded-full border border-slate-700/50">{icon}</div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-semibold text-slate-200">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
