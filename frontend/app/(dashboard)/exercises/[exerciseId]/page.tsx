'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code2, Upload, FileCode, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { exercisesApi, submissionsApi } from '@/lib/api';
import { Exercise, Submission } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function ExerciseDetailPage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = use(params);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [note, setNote] = useState('');

  const loadExerciseData = async () => {
    try {
      const [exData, mySubs] = await Promise.all([
        exercisesApi.getById(exerciseId),
        submissionsApi.getMySubmissions(),
      ]);
      setExercise(exData);
      setSubmissions(mySubs.filter((s) => s.exerciseId === exerciseId));
    } catch (err: any) {
      setError(err.message || 'Failed to load exercise details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExerciseData();
  }, [exerciseId]);

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fileName || !fileUrl) {
      setError('File name and solution URL are required.');
      return;
    }

    setSubmitting(true);
    try {
      await submissionsApi.submit({
        exerciseId,
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim(),
        note: note.trim() || undefined,
      });

      setSuccess('Solution uploaded successfully! Awaiting admin review.');
      setFileName('');
      setFileUrl('');
      setNote('');
      await loadExerciseData();
    } catch (err: any) {
      setError(err.message || 'Failed to upload solution.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error && !exercise) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm max-w-4xl mx-auto space-y-4">
        <p>{error}</p>
        <Link href="/roadmap">
          <Button variant="outline" size="sm">Back to Roadmap</Button>
        </Link>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Navigation */}
      {exercise.studyDay && (
        <Link
          href={`/roadmap/${exercise.studyDay.id}`}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Day {exercise.studyDay.dayNumber}: {exercise.studyDay.title}</span>
        </Link>
      )}

      {/* Exercise Title Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <Badge variant={exercise.difficulty} />
          {exercise.submissionStatus && <Badge variant={exercise.submissionStatus} />}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{exercise.title}</h1>
        <p className="text-sm text-slate-400 leading-relaxed">{exercise.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Solution Upload Form */}
        <Card className="border-indigo-500/30 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800 pb-4">
            <Upload className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg">Upload Solution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-medium text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <Input
                id="fileName"
                label="File Name"
                placeholder="solution.js (allowed: .js, .ts, .zip, .pdf, .png)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />

              <Input
                id="fileUrl"
                label="Solution Public URL / Repository Link"
                placeholder="https://github.com/user/repo/solution.js"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
              />

              <Textarea
                id="note"
                label="Submission Note (Optional)"
                placeholder="Describe your implementation logic or key takeaways..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />

              <Button type="submit" isLoading={submitting} className="w-full">
                <Upload className="w-4 h-4 mr-2" /> Submit Solution
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Submission History */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800 pb-4">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg">Your Submission History</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-slate-500 text-xs">
                <Clock className="w-8 h-8 mx-auto text-slate-600" />
                <p>No submissions uploaded for this exercise yet.</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-indigo-300">
                      {sub.fileName}
                    </span>
                    <Badge variant={sub.status} />
                  </div>

                  <p className="text-xs text-slate-400">
                    Submitted on: <span className="text-slate-300">{formatDate(sub.submittedAt)}</span>
                  </p>

                  {sub.note && (
                    <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      &quot;{sub.note}&quot;
                    </p>
                  )}

                  {sub.adminNote && (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs space-y-1">
                      <span className="font-bold text-indigo-400 block">Admin Feedback:</span>
                      <p className="text-slate-200">{sub.adminNote}</p>
                    </div>
                  )}

                  <div className="pt-1">
                    <Link href={`/submissions/${sub.id}`}>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View Submission Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
