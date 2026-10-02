'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Copy,
  Archive,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  HelpCircle,
  Layers,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { questionsApi } from '@/lib/api';
import { Question, AssessmentType, ExerciseDifficulty, QuestionStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Preview Modal
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionsApi.getAll({
        search: search.trim() || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        difficulty: difficultyFilter !== 'ALL' ? difficultyFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load Question Bank.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuestions();
  }, [typeFilter, difficultyFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchQuestions();
  };

  const handleDuplicate = async (id: string) => {
    try {
      setActionLoading(`dup_${id}`);
      await questionsApi.duplicate(id);
      await fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate question');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleArchive = async (question: Question) => {
    try {
      setActionLoading(`status_${question.id}`);
      if (question.status === 'ARCHIVED') {
        await questionsApi.publish(question.id);
      } else {
        await questionsApi.archive(question.id);
      }
      await fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Failed to change question status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (question: Question) => {
    if (
      !confirm(
        `Are you sure you want to delete "${question.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(`del_${question.id}`);
      await questionsApi.delete(question.id);
      await fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeBadge = (type: AssessmentType) => {
    switch (type) {
      case 'CODE_OUTPUT':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
            Code Output
          </Badge>
        );
      case 'MULTIPLE_CHOICE':
        return (
          <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/40 text-[10px]">
            MCQ
          </Badge>
        );
      case 'ESSAY':
        return (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]">
            Essay
          </Badge>
        );
      default:
        return <Badge className="text-[10px]">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: QuestionStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
            Published
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
            Draft
          </Badge>
        );
      case 'ARCHIVED':
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-600/40 text-[10px]">
            Archived
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Question Bank Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Question Bank
            <Badge className="text-xs bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
              {questions.length} Questions
            </Badge>
          </h1>
          <p className="text-sm text-slate-300">
            Create, manage and organize reusable assessment questions across all exercises.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/question-bank/new">
            <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25 px-5 py-2.5 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="p-4 bg-slate-900/40 backdrop-blur-md border-slate-800/80 shadow-lg">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
        >
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by keyword or title..."
              className="pl-9 bg-slate-950/60 border-slate-800 text-sm h-10 rounded-xl"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950/60 border-slate-800 text-sm h-10 rounded-xl"
          >
            <option value="ALL">All Question Types</option>
            <option value="CODE_OUTPUT">Code Output</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="ESSAY">Essay</option>
          </Select>

          {/* Difficulty Filter */}
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-950/60 border-slate-800 text-sm h-10 rounded-xl"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/60 border-slate-800 text-sm h-10 rounded-xl"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </form>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Question List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl bg-slate-800/40" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 space-y-4">
          <HelpCircle className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Questions Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No questions matched your search or filters. Create your first reusable question in the Question Bank.
          </p>
          <Link href="/admin/question-bank/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Question
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const usageCount = q._count?.exerciseQuestions ?? 0;
            const isActing =
              actionLoading === `dup_${q.id}` ||
              actionLoading === `status_${q.id}` ||
              actionLoading === `del_${q.id}`;

            return (
              <Card
                key={q.id}
                className="p-5 bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700/80 transition-all rounded-2xl shadow-md group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Question Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      {getTypeBadge(q.type)}
                      <Badge
                        variant={
                          q.difficulty === 'EASY'
                            ? 'EASY'
                            : q.difficulty === 'MEDIUM'
                              ? 'MEDIUM'
                              : 'HARD'
                        }
                        className="text-[10px]"
                      >
                        {q.difficulty}
                      </Badge>
                      {getStatusBadge(q.status)}
                      <span className="text-xs text-indigo-300/80 font-mono">
                        {q.defaultPoints} pts
                      </span>
                      {usageCount > 0 ? (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Layers className="w-3 h-3 text-indigo-400" />
                          Used in {usageCount} exercise{usageCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          Not used yet
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {q.title}
                    </h3>

                    {q.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {q.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewQuestion(q);
                        setShowAnswerKey(false);
                      }}
                      className="h-8 text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Preview
                    </Button>

                    <Link href={`/admin/question-bank/${q.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-indigo-300"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActing}
                      onClick={() => handleDuplicate(q.id)}
                      className="h-8 text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Duplicate
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActing}
                      onClick={() => handleToggleArchive(q)}
                      className="h-8 text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {q.status === 'ARCHIVED' ? 'Publish' : 'Archive'}
                    </Button>

                    {usageCount === 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isActing}
                        onClick={() => handleDelete(q)}
                        className="h-8 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Student-Style Preview Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title="Question Preview"
          className="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getTypeBadge(previewQuestion.type)}
                <Badge
                  variant={
                    previewQuestion.difficulty === 'EASY'
                      ? 'EASY'
                      : previewQuestion.difficulty === 'MEDIUM'
                        ? 'MEDIUM'
                        : 'HARD'
                  }
                  className="text-xs"
                >
                  {previewQuestion.difficulty}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {previewQuestion.defaultPoints} Points
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              >
                {showAnswerKey ? 'Hide Answer Key' : 'Reveal Answer Key'}
              </Button>
            </div>

            {/* Question Title & Prompt */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">
                {previewQuestion.title}
              </h2>
              {previewQuestion.description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {previewQuestion.description}
                </p>
              )}
            </div>

            {/* Student-Facing Interactive Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <p className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold">
                Student View:
              </p>

              {previewQuestion.type === 'CODE_OUTPUT' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-indigo-200 whitespace-pre overflow-x-auto">
                    {previewQuestion.config?.codeSnippet || '// No code snippet'}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                      Predict the output:
                    </label>
                    <Input
                      placeholder="e.g. 52"
                      disabled
                      className="bg-slate-900/60 border-slate-700 text-sm"
                    />
                  </div>
                </div>
              )}

              {previewQuestion.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {(previewQuestion.config?.choices || previewQuestion.config?.options || []).map(
                    (choice: any, cIdx: number) => {
                      const letter = String.fromCharCode(65 + cIdx);
                      return (
                        <div
                          key={choice.id || cIdx}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-200"
                        >
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                            {letter}
                          </span>
                          <span className="flex-1">{choice.text}</span>
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {previewQuestion.type === 'ESSAY' && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write your explanation here..."
                    disabled
                    rows={4}
                    className="bg-slate-900/60 border-slate-700 text-sm resize-none"
                  />
                  {previewQuestion.config?.gradingMode === 'MANUAL' && (
                    <p className="text-xs text-amber-400/80">
                      ℹ️ This essay will be reviewed manually by the instructor.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Answer Key (Admin View Only) */}
            {showAnswerKey && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-in fade-in">
                <p className="text-xs font-mono text-indigo-300 uppercase tracking-wider font-bold">
                  🔒 Server-Side Answer Key (Instructor Only):
                </p>

                {previewQuestion.type === 'CODE_OUTPUT' && (
                  <div className="text-xs space-y-1 text-slate-200">
                    <p>
                      <strong>Expected Output:</strong>{' '}
                      <code className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-emerald-400">
                        {previewQuestion.config?.expectedOutput}
                      </code>
                    </p>
                    <p>
                      <strong>Normalization Mode:</strong>{' '}
                      <span className="text-slate-300 font-mono">
                        {previewQuestion.config?.normalizationMode || 'NORMALIZED'}
                      </span>
                    </p>
                  </div>
                )}

                {previewQuestion.type === 'MULTIPLE_CHOICE' && (
                  <div className="text-xs text-slate-200">
                    <p>
                      <strong>Correct Option ID:</strong>{' '}
                      <span className="font-mono text-emerald-400 font-bold">
                        {previewQuestion.config?.correctOptionId}
                      </span>
                    </p>
                  </div>
                )}

                {previewQuestion.type === 'ESSAY' && (
                  <div className="text-xs space-y-1 text-slate-200">
                    <p>
                      <strong>Grading Mode:</strong>{' '}
                      <span className="font-mono text-indigo-300">
                        {previewQuestion.config?.gradingMode || 'EXACT'}
                      </span>
                    </p>
                    {previewQuestion.config?.gradingMode === 'EXACT' && (
                      <p>
                        <strong>Expected Answer:</strong>{' '}
                        <span className="text-slate-300">
                          {previewQuestion.config?.expectedAnswer}
                        </span>
                      </p>
                    )}
                    {previewQuestion.config?.gradingMode === 'KEYWORDS' && (
                      <p>
                        <strong>Required Keywords:</strong>{' '}
                        <span className="text-emerald-400 font-mono">
                          {(previewQuestion.config?.requiredKeywords || previewQuestion.config?.keywords || []).join(', ')}
                        </span>
                      </p>
                    )}
                    {previewQuestion.config?.rubric && (
                      <p>
                        <strong>Rubric:</strong>{' '}
                        <span className="text-slate-300">
                          {previewQuestion.config?.rubric}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {previewQuestion.explanation && (
                  <div className="pt-2 border-t border-indigo-500/20 text-xs text-slate-300">
                    <strong>Explanation:</strong> {previewQuestion.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
