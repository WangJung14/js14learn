'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileCode, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { submissionsApi } from '@/lib/api';
import { Submission } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function SubmissionDetailPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = use(params);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubmission() {
      try {
        const result = await submissionsApi.getById(submissionId);
        setSubmission(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load submission details.');
      } finally {
        setLoading(false);
      }
    }
    loadSubmission();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm max-w-3xl mx-auto space-y-4">
        <p>{error || 'Submission record not found.'}</p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href={submission.exerciseId ? `/exercises/${submission.exerciseId}` : '/dashboard'}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Exercise</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <Badge variant={submission.status} />
          <span className="text-xs font-mono text-slate-400">
            Submitted: {formatDate(submission.submittedAt)}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
          {submission.fileName}
        </h1>
        {submission.exercise && (
          <p className="text-sm text-slate-400">
            Exercise: <span className="text-indigo-400 font-semibold">{submission.exercise.title}</span>
          </p>
        )}
      </div>

      {/* Main Details Card */}
      <Card className="border-slate-800 space-y-6">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg">Submission File Payload</CardTitle>
          </div>
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <span>Open Solution File</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Student Note */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student Note</h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300">
              {submission.note ? submission.note : <span className="text-slate-500 italic">No submission note provided.</span>}
            </div>
          </div>

          {/* Admin Review Feedback */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Review Feedback</h4>
            {submission.status === 'PENDING' ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>This submission is currently pending review by an admin instructor.</span>
              </div>
            ) : submission.status === 'APPROVED' ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submission Approved!</span>
                </div>
                {submission.adminNote && <p className="text-slate-200 font-sans">{submission.adminNote}</p>}
              </div>
            ) : (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>Submission Needs Revision</span>
                </div>
                {submission.adminNote && <p className="text-slate-200 font-sans">{submission.adminNote}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
