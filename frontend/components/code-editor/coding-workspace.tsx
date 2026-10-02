'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Exercise, CodingExerciseConfig } from '@/types';
import { JavaScriptEditor } from './javascript-editor';
import { CodeEditorToolbar } from './code-editor-toolbar';
import { CodeOutput } from './code-output';
import { TestResults } from './test-results';
import { runCode, runTests } from '@/lib/code-runner/runner';
import { ExecutionResult } from '@/lib/code-runner/types';
import { submissionsApi } from '@/lib/api';

interface CodingWorkspaceProps {
  exercise: Exercise;
  userId?: string;
  onSubmissionComplete?: () => void;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  exercise,
  userId = 'default-user',
  onSubmissionComplete,
}) => {
  const codingConfig = (exercise.codingConfig as CodingExerciseConfig | null) || null;
  const tests = codingConfig?.tests || [];
  const functionName = codingConfig?.functionName;
  const mode = codingConfig?.mode || 'function';

  const defaultStarter =
    exercise.starterCode ||
    codingConfig?.starterCode ||
    '// Write your JavaScript code here\n';

  const storageKey = `js14learn:code-draft:${userId}:${exercise.id}`;

  const [code, setCode] = useState<string>(defaultStarter);
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        setCode(savedDraft);
      } else {
        setCode(defaultStarter);
      }
    } catch {
      setCode(defaultStarter);
    }
  }, [storageKey, defaultStarter]);

  // Save draft to localStorage on edit
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      localStorage.setItem(storageKey, newCode);
    } catch {
      // Ignore localStorage errors
    }
  };

  const hasDraftChanges = code.trim() !== defaultStarter.trim();

  // Reset code to starter
  const handleReset = () => {
    if (
      hasDraftChanges &&
      !window.confirm('Are you sure you want to reset your code to the starter template?')
    ) {
      return;
    }
    setCode(defaultStarter);
    setExecutionResult(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  };

  // Run Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await runCode(code);
      setExecutionResult(res);
    } catch (err: unknown) {
      setExecutionResult({
        success: false,
        stdout: [],
        stderr: [(err as Error).message || 'Execution error'],
        error: { name: 'ExecutionError', message: (err as Error).message },
        durationMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run Tests
  const handleRunTests = useCallback(async (): Promise<ExecutionResult> => {
    setIsTesting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await runTests(code, tests, functionName, mode);
      setExecutionResult(res);
      return res;
    } catch (err: unknown) {
      const errorRes: ExecutionResult = {
        success: false,
        stdout: [],
        stderr: [(err as Error).message || 'Test execution error'],
        error: { name: 'TestError', message: (err as Error).message },
        durationMs: 0,
      };
      setExecutionResult(errorRes);
      return errorRes;
    } finally {
      setIsTesting(false);
    }
  }, [code, tests, functionName, mode]);

  // Submit Solution
  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    let currentRes = executionResult;

    // Run tests first if not already run for current code
    if (tests.length > 0) {
      currentRes = await handleRunTests();
    } else {
      setIsRunning(true);
      currentRes = await runCode(code);
      setExecutionResult(currentRes);
      setIsRunning(false);
    }

    if (tests.length > 0 && currentRes?.tests) {
      const passedCount = currentRes.tests.filter((t) => t.passed).length;
      const totalCount = currentRes.tests.length;

      if (passedCount < totalCount) {
        setSubmitError(
          `Cannot submit: ${totalCount - passedCount} of ${totalCount} tests failed. Please fix your solution and run tests again.`,
        );
        return;
      }
    } else if (!currentRes?.success) {
      setSubmitError('Cannot submit solution with runtime or compilation errors.');
      return;
    }

    setIsSubmitting(true);
    try {
      const passed = currentRes?.tests
        ? currentRes.tests.filter((t) => t.passed).length
        : 1;
      const total = currentRes?.tests ? currentRes.tests.length : 1;
      const durationMs = currentRes?.durationMs || 0;

      await submissionsApi.submitCode({
        exerciseId: exercise.id,
        code,
        executionSummary: {
          passed,
          total,
          durationMs,
        },
      });

      setSubmitSuccess('Submission accepted! Your solution passed all test cases.');
      onSubmissionComplete?.();
    } catch (err: unknown) {
      setSubmitError((err as Error).message || 'Failed to submit solution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Notifications */}
      {submitError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      {submitSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-300 flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Code Editor Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <CodeEditorToolbar
          onRunCode={handleRunCode}
          onRunTests={handleRunTests}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isRunning={isRunning}
          isTesting={isTesting}
          isSubmitting={isSubmitting}
          hasDraftChanges={hasDraftChanges}
          hasTests={tests.length > 0}
        />

        <div className="p-1 bg-slate-950">
          <JavaScriptEditor value={code} onChange={handleCodeChange} minHeight="380px" />
        </div>
      </div>

      {/* Output & Test Results Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodeOutput result={executionResult} isRunning={isRunning} />
        <TestResults tests={executionResult?.tests} isTesting={isTesting} />
      </div>
    </div>
  );
};
