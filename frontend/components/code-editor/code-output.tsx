'use client';

import React from 'react';
import { Terminal, AlertCircle, Clock } from 'lucide-react';
import { ExecutionResult } from '@/lib/code-runner/types';

interface CodeOutputProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ result, isRunning }) => {
  if (isRunning) {
    return (
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Executing code in Web Worker...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-center py-6">
        <Terminal className="w-6 h-6 text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-mono">
          Click &quot;Run Code&quot; or &quot;Run Tests&quot; to see execution output.
        </p>
      </div>
    );
  }

  const hasStdout = result.stdout && result.stdout.length > 0;
  const hasStderr = result.stderr && result.stderr.length > 0;
  const hasError = Boolean(result.error);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-inner">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">Console Output</span>
        </div>

        <span className="text-[11px] text-slate-500">
          Duration: <span className="text-slate-300 font-semibold">{result.durationMs}ms</span>
        </span>
      </div>

      {/* Output Content */}
      <div className="p-3 max-h-60 overflow-y-auto space-y-2 leading-relaxed">
        {result.timedOut && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Execution Timed Out!</span>
              <span>{result.error?.message || 'Execution exceeded 3000ms limit.'}</span>
            </div>
          </div>
        )}

        {hasError && !result.timedOut && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{result.error?.name || 'Runtime Error'}</span>
            </div>
            <p className="whitespace-pre-wrap text-[11px] leading-normal">{result.error?.message}</p>
          </div>
        )}

        {hasStderr && (
          <div className="space-y-1 text-amber-400">
            {result.stderr.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        )}

        {hasStdout ? (
          <div className="space-y-1 text-slate-200">
            {result.stdout.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                <span className="text-slate-600 mr-2 select-none">&gt;</span>
                {line}
              </div>
            ))}
          </div>
        ) : !hasStderr && !hasError && !result.timedOut ? (
          <p className="text-slate-500 italic text-[11px]">Program finished with no output.</p>
        ) : null}
      </div>
    </div>
  );
};
