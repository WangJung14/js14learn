'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Award, Target, Code, CheckSquare, FileUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Exercise } from '@/types';

interface ExerciseHeaderProps {
  exercise: Exercise;
}

export function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
  const isAssessment =
    (exercise.questions && exercise.questions.length > 0) ||
    (exercise.assessmentType && exercise.assessmentType !== 'NONE');

  const questionCount =
    exercise.totalQuestions || exercise.questions?.length || 1;

  // Compute realistic estimated time
  const wordCount = (exercise.description || '').split(/\s+/).filter(Boolean).length;
  const estimatedMin = isAssessment
    ? Math.max(5, questionCount * 3)
    : exercise.isCoding
      ? Math.max(15, Math.ceil(wordCount / 30) + 10)
      : Math.max(10, Math.ceil(wordCount / 40) + 5);

  return (
    <div className="space-y-4">
      {/* 1. Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {exercise.studyDay ? (
          <Link
            href={`/roadmap/${exercise.studyDay.id}`}
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">
              Study Day {exercise.studyDay.dayNumber}: {exercise.studyDay.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/roadmap"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-medium">Back to Roadmap</span>
          </Link>
        )}

        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
          <span>Day {exercise.studyDay?.dayNumber || 1}</span>
          <span>/</span>
          <span>Exercises</span>
          <span>/</span>
          <span className="text-slate-300 font-semibold truncate max-w-[180px]">
            {exercise.title}
          </span>
        </div>
      </div>

      {/* 2. Main Exercise Header Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/30 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-800/90 text-slate-300 border border-slate-700/60">
            Exercise {String(exercise.order || 1).padStart(2, '0')}
          </span>

          <Badge variant={exercise.difficulty} />

          {exercise.submissionStatus && (
            <Badge variant={exercise.submissionStatus} />
          )}

          {isAssessment ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Assessment ({questionCount} Question{questionCount > 1 ? 's' : ''})</span>
            </span>
          ) : exercise.isCoding ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Code className="w-3.5 h-3.5" />
              <span>Interactive Coding</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
              <FileUp className="w-3.5 h-3.5" />
              <span>File Submission</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
          {exercise.title}
        </h1>

        {/* Meta Stats Pill Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Estimated: <strong className="text-slate-200 font-mono">~{estimatedMin} min</strong></span>
          </div>

          {exercise.passingScore !== undefined && exercise.passingScore !== null && isAssessment && (
            <div className="flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Passing Score: <strong className="text-slate-200 font-mono">{exercise.passingScore}%</strong></span>
            </div>
          )}

          {exercise.totalPoints !== undefined && exercise.totalPoints !== null && isAssessment && (
            <div className="flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Points: <strong className="text-slate-200 font-mono">{exercise.totalPoints} pts</strong></span>
            </div>
          )}

          {exercise.maxAttempts && (
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Max Attempts: <strong className="text-slate-200 font-mono">{exercise.maxAttempts}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
