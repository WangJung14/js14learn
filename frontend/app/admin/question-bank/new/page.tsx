'use client';

import React from 'react';
import { QuestionEditor } from '@/components/admin/question-editor';

export default function CreateQuestionPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Create New Question
        </h1>
        <p className="text-sm text-slate-400">
          Add a new reusable question to the Question Bank. It can later be added to one or more exercises.
        </p>
      </div>

      <QuestionEditor />
    </div>
  );
}
