'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { exercisesApi, submissionsApi, attendanceApi } from '@/lib/api';
import { Exercise, Submission } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CodingWorkspace } from '@/components/code-editor/coding-workspace';
import { AssessmentWorkspace } from '@/components/assessments/assessment-workspace';
import { ExerciseHeader } from '@/components/exercises/exercise-header';
import { ExerciseContentRenderer } from '@/components/exercises/exercise-content-renderer';
import { ExerciseFileWorkspace } from '@/components/exercises/exercise-file-workspace';
import { ExerciseStatusCard } from '@/components/exercises/exercise-status-card';
import { ExerciseSubmissionHistory } from '@/components/exercises/exercise-submission-history';
import { BookOpen, Code2 } from 'lucide-react';

export default function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = use(params);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExerciseData = useCallback(async () => {
    try {
      const [exData, mySubs] = await Promise.all([
        exercisesApi.getById(exerciseId),
        submissionsApi.getMySubmissions(),
      ]);
      setExercise(exData);
      setSubmissions(mySubs.filter((s) => s.exerciseId === exerciseId));
      // Automatic attendance check-in for learning context
      attendanceApi.checkIn().catch(() => {});
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load exercise details.');
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    void loadExerciseData();
  }, [loadExerciseData]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !exercise) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm max-w-4xl mx-auto space-y-4">
        <p className="font-semibold">Unable to load exercise:</p>
        <p className="text-slate-300 text-xs">{error}</p>
        <Link href="/roadmap">
          <Button variant="outline" size="sm">
            Back to Roadmap
          </Button>
        </Link>
      </div>
    );
  }

  if (!exercise) return null;

  const isAssessment =
    (exercise.questions && exercise.questions.length > 0) ||
    (exercise.assessmentType && exercise.assessmentType !== 'NONE');

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-4 pb-16">
      {/* 1. Header & Navigation */}
      <ExerciseHeader exercise={exercise} />

      {/* 2. Main Content Layout according to Exercise Type */}
      {isAssessment ? (
        /* Assessment Mode (Multi-Question Assessment) */
        <div className="space-y-6">
          {exercise.description && (
            <Card className="border-slate-800 bg-slate-900/60 shadow-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800/80 pb-3 bg-slate-950/40">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <CardTitle className="text-sm font-bold text-slate-200">
                  Assessment Overview &amp; Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                <ExerciseContentRenderer content={exercise.description} />
              </CardContent>
            </Card>
          )}

          <AssessmentWorkspace
            exercise={exercise}
            onCompletion={loadExerciseData}
          />
        </div>
      ) : exercise.isCoding ? (
        /* Interactive Coding Mode (Monaco + Test Runner) */
        <div className="space-y-6">
          {/* Problem Statement Card */}
          <Card className="border-slate-800 bg-slate-900/70 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800/80 pb-3.5 bg-slate-950/40">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <CardTitle className="text-base font-bold text-slate-100">
                Problem Description &amp; Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-7">
              <ExerciseContentRenderer content={exercise.description} />
            </CardContent>
          </Card>

          {/* Monaco Coding Workspace */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 px-1">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Interactive JavaScript Editor &amp; Test Suite</span>
            </div>
            <CodingWorkspace
              exercise={exercise}
              onSubmissionComplete={loadExerciseData}
            />
          </div>

          {/* Submission History */}
          <ExerciseSubmissionHistory submissions={submissions} />
        </div>
      ) : (
        /* Standard File Upload Mode (2-Column Responsive Layout) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Problem Statement & Markdown Content (65-70% / 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <Card className="border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center space-x-2.5 border-b border-slate-800/80 pb-4 bg-slate-950/40">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-100">
                    Problem Statement
                  </CardTitle>
                  <p className="text-[11px] text-slate-400">
                    Read the instructions, requirements, and examples carefully
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-8 px-5 sm:px-7">
                <ExerciseContentRenderer content={exercise.description} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sticky Sidebar (Status + Solution Upload + History) (30-35% / 4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Exercise Status Card */}
            <ExerciseStatusCard
              exercise={exercise}
              submissions={submissions}
            />

            {/* Upload Solution Workspace */}
            <ExerciseFileWorkspace
              exerciseId={exercise.id}
              onSubmissionSuccess={loadExerciseData}
            />

            {/* Submission History */}
            <ExerciseSubmissionHistory submissions={submissions} />
          </div>
        </div>
      )}
    </div>
  );
}
