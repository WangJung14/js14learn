'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questionsApi } from '@/lib/api';
import { Question } from '@/types';
import { QuestionEditor } from '@/components/admin/question-editor';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditQuestionPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await questionsApi.getById(id);
        setQuestion(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch question.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void fetchQuestion();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 bg-slate-800/40 rounded-xl" />
        <Skeleton className="h-40 w-full bg-slate-800/40 rounded-3xl" />
        <Skeleton className="h-64 w-full bg-slate-800/40 rounded-3xl" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 max-w-5xl mx-auto space-y-3">
        <p className="font-bold">Error loading question</p>
        <p className="text-sm">{error || 'Question not found'}</p>
        <button
          onClick={() => router.push('/admin/question-bank')}
          className="text-xs text-indigo-400 underline font-bold"
        >
          Return to Question Bank
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Edit Question
        </h1>
        <p className="text-sm text-slate-400">
          Modify question configuration, answer keys, or points.
        </p>
      </div>

      <QuestionEditor initialData={question} isEditing={true} />
    </div>
  );
}
