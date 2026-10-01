'use client';

import React from 'react';
import { CheckCircle2, XCircle, FlaskConical, HelpCircle } from 'lucide-react';
import { TestResult } from '@/lib/code-runner/types';

interface TestResultsProps {
  tests: TestResult[] | undefined;
  isTesting?: boolean;
}

export const TestResults: React.FC<TestResultsProps> = ({ tests, isTesting }) => {
  if (isTesting) {
    return (
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono text-amber-400">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-4 h-4 animate-bounce text-amber-400" />
          <span>Running predefined exercise test suite...</span>
        </div>
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return null;
  }

  const passedCount = tests.filter((t) => t.passed).length;
  const totalCount = tests.length;
  const isAllPassed = passedCount === totalCount;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs font-mono shadow-inner">
      {/* Test Suite Summary Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">Test Results</span>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
              isAllPassed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {passedCount} / {totalCount} Passed
          </span>
        </div>
      </div>

      {/* Test Item List */}
      <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto">
        {tests.map((test, idx) => (
          <div
            key={test.id || idx}
            className={`p-3 rounded-lg border transition-colors ${
              test.passed
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span className="font-bold text-slate-200">{test.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">{test.durationMs}ms</span>
            </div>

            {!test.passed && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                {test.error ? (
                  <p className="text-rose-400">Error: {test.error}</p>
                ) : (
                  <>
                    <div>
                      <span className="text-slate-500">Expected: </span>
                      <span className="text-emerald-400 font-semibold">
                        {JSON.stringify(test.expected)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Got: </span>
                      <span className="text-rose-400 font-semibold">
                        {JSON.stringify(test.actual)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
