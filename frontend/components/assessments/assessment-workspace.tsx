'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Exercise,
  Question,
  AssessmentAttempt,
  AssessmentSummary,
} from '@/types';
import { assessmentsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea, Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AssessmentResult } from './assessment-result';
import { AttemptHistory } from './attempt-history';
import {
  Code2,
  ListOrdered,
  FileText,
  Send,
  Copy,
  Check,
  Award,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface AssessmentWorkspaceProps {
  exercise: Exercise;
  onCompletion?: () => void;
}

export function AssessmentWorkspace({
  exercise,
  onCompletion,
}: AssessmentWorkspaceProps) {
  // Normalize questions array from exercise
  const questions: Question[] =
    exercise.questions && exercise.questions.length > 0
      ? exercise.questions
      : exercise.assessmentType && exercise.assessmentType !== 'NONE'
        ? [
            {
              id: 'legacy-q',
              type: exercise.assessmentType,
              title: exercise.title,
              description: exercise.description,
              difficulty: exercise.difficulty,
              status: 'PUBLISHED',
              defaultPoints: 10,
              points: 10,
              order: 1,
              config: exercise.assessmentConfig,
            },
          ]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Student answers state: map questionId -> answer string
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});

  // Summary & Attempt state
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [latestAttempt, setLatestAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaryAndAttempts = useCallback(async () => {
    try {
      setLoading(true);
      const [sum, atts] = await Promise.all([
        assessmentsApi.getSummary(exercise.id),
        assessmentsApi.getAttempts(exercise.id),
      ]);
      setSummary(sum);
      setAttempts(atts);
      if (sum.latestAttempt) {
        setLatestAttempt(sum.latestAttempt);
      }
    } catch (err: unknown) {
      console.error('Failed to load assessment summary', err);
    } finally {
      setLoading(false);
    }
  }, [exercise.id]);

  useEffect(() => {
    void fetchSummaryAndAttempts();
  }, [fetchSummaryAndAttempts]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCopyCode = async (snippet: string) => {
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch {
        // clipboard error fallback
      }
    }
  };

  const maxAttempts = exercise.maxAttempts || summary?.maxAttempts || 0;
  const attemptsCount = summary?.totalAttempts || attempts.length;
  const isAttemptsExhausted = maxAttempts > 0 && attemptsCount >= maxAttempts;
  const canRetry = !isAttemptsExhausted;

  const totalPoints =
    exercise.totalPoints ||
    questions.reduce((sum, q) => sum + (q.points || q.defaultPoints || 10), 0);
  const passingScore = exercise.passingScore ?? 70;

  const answeredQuestionsCount = questions.filter(
    (q) => (answersMap[q.id] || '').trim().length > 0,
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required questions have answers
    for (const q of questions) {
      const ans = (answersMap[q.id] || '').trim();
      if (!ans) {
        setError(`Please provide an answer for "${q.title}".`);
        const qIndex = questions.findIndex((item) => item.id === q.id);
        if (qIndex !== -1) setCurrentIndex(qIndex);
        return;
      }
    }

    const payload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        answer: answersMap[q.id] || '',
      })),
    };

    setSubmitting(true);
    try {
      const attempt = await assessmentsApi.submitAttempt(exercise.id, payload);

      setLatestAttempt(attempt);
      await fetchSummaryAndAttempts();

      if (attempt.isPassed && onCompletion) {
        onCompletion();
      }
    } catch (err: unknown) {
      setError(
        (err as Error).message || 'Failed to submit assessment attempt.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setLatestAttempt(null);
    setAnswersMap({});
    setCurrentIndex(0);
    setError(null);
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
        No questions configured for this assessment yet.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Assessment Top Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Questions
          </span>
          <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{questions.length} Questions</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Total Points
          </span>
          <div className="flex items-center space-x-1.5 text-slate-200 font-mono font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              {totalPoints} pts (Pass: {passingScore}%)
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Attempts
          </span>
          <div className="text-slate-200 font-mono font-bold text-sm">
            {attemptsCount} / {maxAttempts > 0 ? maxAttempts : 'Unlimited'}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Best Score
          </span>
          <div className="text-emerald-400 font-mono font-bold text-sm">
            {summary?.bestScore !== undefined && summary?.bestScore > 0
              ? `${summary.bestScore} pts (${summary.bestPercentage?.toFixed(0)}%)`
              : '—'}
          </div>
        </div>
      </div>

      {/* Show Latest Result if submitted and not retrying */}
      {latestAttempt && (
        <AssessmentResult
          attempt={latestAttempt}
          passingScore={passingScore}
          canRetry={canRetry}
          onRetry={handleRetry}
        />
      )}

      {/* Interactive Question Workspace (if not displaying result or if retrying) */}
      {!latestAttempt && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Question Navigator Header / Pills */}
          <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Progress:
              </span>
              <span className="text-xs font-mono font-bold text-indigo-300">
                {answeredQuestionsCount} / {questions.length} answered
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(
                  (answersMap[q.id] || '').trim().length > 0,
                );
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                        : isAnswered
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {isAnswered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Card */}
          {currentQuestion && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-6">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs font-mono">
                    Question {currentIndex + 1} of {questions.length}
                  </Badge>
                  <Badge className="text-xs">
                    {currentQuestion.type}
                  </Badge>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {currentQuestion.points || currentQuestion.defaultPoints || 10}{' '}
                    Points
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="h-8 text-xs text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="h-8 text-xs text-slate-400 hover:text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-white leading-snug">
                  {currentQuestion.title}
                </h3>
                {currentQuestion.description && (
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* Render Question Answer Input based on type */}

              {/* 1. CODE OUTPUT */}
              {currentQuestion.type === 'CODE_OUTPUT' && (
                <div className="space-y-4">
                  {currentQuestion.config?.codeSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold">
                          JavaScript Code Snippet
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(
                              currentQuestion.config.codeSnippet || '',
                            )
                          }
                          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-indigo-200 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner">
                        <code>{currentQuestion.config.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Your Predicted Console Output:
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 52 or undefined"
                      value={answersMap[currentQuestion.id] || ''}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      className="font-mono text-sm bg-slate-950 border-slate-700 h-12 rounded-xl text-white"
                    />
                  </div>
                </div>
              )}

              {/* 2. MULTIPLE CHOICE */}
              {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Select One Option:
                  </label>

                  <div className="space-y-2.5">
                    {(
                      currentQuestion.config?.choices ||
                      currentQuestion.config?.options ||
                      []
                    ).map((choice: any, cIdx: number) => {
                      const letter = String.fromCharCode(65 + cIdx);
                      const isSelected =
                        answersMap[currentQuestion.id] === choice.id;

                      return (
                        <label
                          key={choice.id || cIdx}
                          className={`flex items-center space-x-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`mcq_${currentQuestion.id}`}
                            value={choice.id}
                            checked={isSelected}
                            onChange={() =>
                              handleAnswerChange(currentQuestion.id, choice.id)
                            }
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                          />
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-sm font-medium leading-relaxed flex-1">
                            {choice.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. ESSAY */}
              {currentQuestion.type === 'ESSAY' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Your Explanation / Answer:
                    </label>
                    <span className="text-xs font-mono text-slate-400">
                      {(answersMap[currentQuestion.id] || '').length} characters
                    </span>
                  </div>

                  <Textarea
                    placeholder="Provide your comprehensive explanation here..."
                    value={answersMap[currentQuestion.id] || ''}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    rows={6}
                    className="text-sm bg-slate-950 border-slate-700 rounded-2xl text-white leading-relaxed resize-none p-4"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submission and Bottom Navigation Action Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="border-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Question
              </Button>

              {currentIndex < questions.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="border-slate-800 text-slate-300 hover:text-white"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            <Button
              type="submit"
              isLoading={submitting}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-600/25 rounded-2xl h-11"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Assessment ({answeredQuestionsCount}/{questions.length})
            </Button>
          </div>
        </form>
      )}

      {/* Attempt History */}
      {attempts.length > 0 && <AttemptHistory attempts={attempts} />}
    </div>
  );
}
