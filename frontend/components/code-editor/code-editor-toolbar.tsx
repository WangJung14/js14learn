'use client';

import React from 'react';
import { Play, FlaskConical, Send, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeEditorToolbarProps {
  onRunCode: () => void;
  onRunTests: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isTesting: boolean;
  isSubmitting: boolean;
  hasDraftChanges: boolean;
  hasTests: boolean;
}

export const CodeEditorToolbar: React.FC<CodeEditorToolbarProps> = ({
  onRunCode,
  onRunTests,
  onSubmit,
  onReset,
  isRunning,
  isTesting,
  isSubmitting,
  hasDraftChanges,
  hasTests,
}) => {
  const isBusy = isRunning || isTesting || isSubmitting;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-b border-slate-800 rounded-t-xl">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRunCode}
          disabled={isBusy}
          isLoading={isRunning}
          className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-white"
        >
          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
          Run Code
        </Button>

        {hasTests && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRunTests}
            disabled={isBusy}
            isLoading={isTesting}
            className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-white"
          >
            <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
            Run Tests
          </Button>
        )}

        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isBusy}
          isLoading={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Submit Solution
        </Button>
      </div>

      <div className="flex items-center space-x-3 text-xs text-slate-400">
        {hasDraftChanges ? (
          <span className="inline-flex items-center text-amber-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
            Unsaved changes
          </span>
        ) : (
          <span className="inline-flex items-center text-slate-400 font-mono text-[11px]">
            <Save className="w-3 h-3 mr-1 text-emerald-400" />
            Draft saved
          </span>
        )}

        <button
          onClick={onReset}
          disabled={isBusy}
          title="Reset to starter code"
          className="inline-flex items-center text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span className="text-[11px] hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
