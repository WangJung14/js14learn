'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Code2,
  Eye,
  FileText,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Sparkles,
  HelpCircle,
  Search,
  Check,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { exercisesApi, studyDaysApi, questionsApi } from '@/lib/api';
import {
  Exercise,
  StudyDay,
  ExerciseDifficulty,
  CodingTestCase,
  CodingExerciseConfig,
  Question,
  AssessmentType,
} from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { TestCaseBuilder } from '@/components/admin/test-case-builder';
import { CodingWorkspace } from '@/components/code-editor/coding-workspace';
import { AssessmentWorkspace } from '@/components/assessments/assessment-workspace';

interface SelectedQuestionItem {
  question: Question;
  points: number;
  order: number;
  isRequired: boolean;
}

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingDayId, setReorderingDayId] = useState<string | null>(null);

  // Question Bank available questions cache
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [qbSearch, setQbSearch] = useState('');
  const [qbTypeFilter, setQbTypeFilter] = useState<string>('ALL');

  // Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [saving, setSaving] = useState(false);

  // Exercise Form Fields
  const [studyDayId, setStudyDayId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>('EASY');
  const [order, setOrder] = useState<number>(1);

  // Exercise Category
  const [exerciseCategory, setExerciseCategory] = useState<
    'standard' | 'coding' | 'assessment'
  >('standard');

  // Coding Config
  const [mode, setMode] = useState<'function' | 'console'>('function');
  const [functionName, setFunctionName] = useState<string>('');
  const [starterCode, setStarterCode] = useState<string>('');
  const [tests, setTests] = useState<CodingTestCase[]>([]);

  // Assessment Config Fields
  const [selectedQuestions, setSelectedQuestions] = useState<
    SelectedQuestionItem[]
  >([]);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [maxAttempts, setMaxAttempts] = useState<number>(0);

  const [formError, setFormError] = useState<string | null>(null);

  // Preview Modal State
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const loadData = async () => {
    try {
      const [days, qList] = await Promise.all([
        studyDaysApi.getAll(),
        questionsApi.getAll(),
      ]);
      setStudyDays(days);
      setBankQuestions(qList);

      if (days.length > 0) {
        if (!studyDayId) setStudyDayId(days[0].id);

        const allExercisesPromises = days.map((d) =>
          exercisesApi.getByStudyDay(d.id),
        );
        const results = await Promise.all(allExercisesPromises);
        const combined = results.flat();
        setExercises(combined);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load exercises data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreateModal = (presetStudyDayId?: string) => {
    setEditingExercise(null);
    if (presetStudyDayId) {
      setStudyDayId(presetStudyDayId);
    } else if (studyDays.length > 0 && !studyDayId) {
      setStudyDayId(studyDays[0].id);
    }
    setTitle('');
    setDescription('');
    setDifficulty('EASY');
    setOrder(1);
    setExerciseCategory('standard');
    setMode('function');
    setFunctionName('');
    setStarterCode('// Write your starter code here\n');
    setTests([]);

    setSelectedQuestions([]);
    setPassingScore(70);
    setMaxAttempts(0);
    setQbSearch('');
    setQbTypeFilter('ALL');

    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ex: Exercise) => {
    setEditingExercise(ex);
    setStudyDayId(ex.studyDayId);
    setTitle(ex.title);
    setDescription(ex.description);
    setDifficulty(ex.difficulty);
    setOrder(ex.order);

    const hasQuestions =
      (ex.questions && ex.questions.length > 0) ||
      (ex.assessmentType && ex.assessmentType !== 'NONE');

    if (hasQuestions) {
      setExerciseCategory('assessment');
      setPassingScore(ex.passingScore ?? 70);
      setMaxAttempts(ex.maxAttempts ?? 0);

      if (ex.questions && ex.questions.length > 0) {
        setSelectedQuestions(
          ex.questions.map((q, idx) => ({
            question: q,
            points: q.points ?? q.defaultPoints ?? 10,
            order: q.order ?? idx + 1,
            isRequired: q.isRequired ?? true,
          })),
        );
      } else {
        // Fallback for legacy single question assessment
        const matched = bankQuestions.find(
          (bq) => bq.title.toLowerCase() === ex.title.toLowerCase(),
        );
        if (matched) {
          setSelectedQuestions([
            {
              question: matched,
              points: matched.defaultPoints || 10,
              order: 1,
              isRequired: true,
            },
          ]);
        }
      }
    } else if (ex.isCoding) {
      setExerciseCategory('coding');
      const cfg = (ex.codingConfig as CodingExerciseConfig | null) || null;
      setMode(cfg?.mode || 'function');
      setFunctionName(cfg?.functionName || '');
      setStarterCode(
        ex.starterCode || cfg?.starterCode || '// Write starter code here\n',
      );
      setTests(cfg?.tests || []);
    } else {
      setExerciseCategory('standard');
    }

    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddQuestionToSelected = (q: Question) => {
    if (selectedQuestions.some((sq) => sq.question.id === q.id)) {
      return;
    }
    const nextOrder = selectedQuestions.length + 1;
    setSelectedQuestions([
      ...selectedQuestions,
      {
        question: q,
        points: q.defaultPoints || 10,
        order: nextOrder,
        isRequired: true,
      },
    ]);
  };

  const handleRemoveSelectedQuestion = (index: number) => {
    const updated = selectedQuestions.filter((_, i) => i !== index);
    setSelectedQuestions(
      updated.map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    );
  };

  const handleMoveSelectedQuestion = (
    index: number,
    direction: 'up' | 'down',
  ) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedQuestions.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...selectedQuestions];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    setSelectedQuestions(
      next.map((item, idx) => ({
        ...item,
        order: idx + 1,
      })),
    );
  };

  const handlePointsChange = (index: number, val: number) => {
    const next = [...selectedQuestions];
    next[index].points = val;
    setSelectedQuestions(next);
  };

  const handleRequiredToggle = (index: number) => {
    const next = [...selectedQuestions];
    next[index].isRequired = !next[index].isRequired;
    setSelectedQuestions(next);
  };

  const totalAssessmentPoints = selectedQuestions.reduce(
    (sum, sq) => sum + (Number(sq.points) || 0),
    0,
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || !studyDayId) {
      setFormError('Please fill in all required basic fields.');
      return;
    }

    const isCodingEx = exerciseCategory === 'coding';
    const isAssessmentEx = exerciseCategory === 'assessment';

    if (isCodingEx) {
      if (mode === 'function' && !functionName.trim()) {
        setFormError(
          'Function Name is required for function-mode coding exercises.',
        );
        return;
      }
    }

    if (isAssessmentEx && selectedQuestions.length === 0) {
      setFormError(
        'Please select at least one question from the Question Bank.',
      );
      return;
    }

    const codingConfigPayload: CodingExerciseConfig | undefined = isCodingEx
      ? {
          language: 'javascript',
          mode,
          functionName: mode === 'function' ? functionName.trim() : undefined,
          starterCode: starterCode.trim(),
          tests,
        }
      : undefined;

    const questionsPayload = isAssessmentEx
      ? selectedQuestions.map((sq, idx) => ({
          questionId: sq.question.id,
          points: Number(sq.points) || 10,
          order: idx + 1,
          isRequired: sq.isRequired,
        }))
      : undefined;

    setSaving(true);
    try {
      if (editingExercise) {
        await exercisesApi.update(editingExercise.id, {
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
          isCoding: isCodingEx,
          starterCode: isCodingEx ? starterCode : undefined,
          codingConfig: codingConfigPayload,
          assessmentType: isAssessmentEx ? 'CODE_OUTPUT' : 'NONE',
          passingScore: isAssessmentEx ? Number(passingScore) || 70 : undefined,
          maxAttempts: isAssessmentEx ? Number(maxAttempts) || 0 : undefined,
          questions: questionsPayload,
        });
      } else {
        await exercisesApi.create({
          studyDayId,
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
          isCoding: isCodingEx,
          starterCode: isCodingEx ? starterCode : undefined,
          codingConfig: codingConfigPayload,
          assessmentType: isAssessmentEx ? 'CODE_OUTPUT' : 'NONE',
          passingScore: isAssessmentEx ? Number(passingScore) || 70 : undefined,
          maxAttempts: isAssessmentEx ? Number(maxAttempts) || 0 : undefined,
          questions: questionsPayload,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to save exercise.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string,
    exTitle: string,
    isCodingEx?: boolean,
  ) => {
    const warningMsg = isCodingEx
      ? `Are you sure you want to delete Coding Exercise "${exTitle}"?\nDeleting this exercise will remove student submissions and unlink associated checklist items.`
      : `Are you sure you want to delete exercise "${exTitle}"?\nThis action will unlink associated checklist items.`;

    if (!confirm(warningMsg)) {
      return;
    }
    try {
      await exercisesApi.delete(id);
      await loadData();
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete exercise.');
    }
  };

  const handleMoveExercise = async (
    targetStudyDayId: string,
    exerciseId: string,
    direction: 'up' | 'down',
  ) => {
    if (reorderingDayId) return;

    const dayExercises = exercises
      .filter((ex) => ex.studyDayId === targetStudyDayId)
      .sort((a, b) => a.order - b.order);

    const index = dayExercises.findIndex((ex) => ex.id === exerciseId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === dayExercises.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const reorderedList = [...dayExercises];
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    const items = reorderedList.map((ex, i) => ({
      id: ex.id,
      order: i + 1,
    }));

    const previousExercises = [...exercises];

    setExercises((prev) => {
      const updatedMap = new Map(items.map((it) => [it.id, it.order]));
      return prev.map((ex) =>
        updatedMap.has(ex.id) ? { ...ex, order: updatedMap.get(ex.id)! } : ex,
      );
    });

    setReorderingDayId(targetStudyDayId);
    setError(null);

    try {
      const updatedDayExercises = await exercisesApi.reorder(
        targetStudyDayId,
        items,
      );
      setExercises((prev) => {
        const otherExercises = prev.filter(
          (ex) => ex.studyDayId !== targetStudyDayId,
        );
        return [...otherExercises, ...updatedDayExercises];
      });
    } catch (err: unknown) {
      setExercises(previousExercises);
      setError(
        (err as Error).message ||
          'Failed to reorder exercises. Restored previous order.',
      );
    } finally {
      setReorderingDayId(null);
    }
  };

  const filteredBankQuestions = bankQuestions.filter((q) => {
    if (q.status === 'ARCHIVED') return false;
    if (qbTypeFilter !== 'ALL' && q.type !== qbTypeFilter) return false;
    if (qbSearch.trim()) {
      const term = qbSearch.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchDesc = q.description?.toLowerCase().includes(term) ?? false;
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const visibleStudyDays =
    selectedDayFilter === 'ALL'
      ? studyDays
      : studyDays.filter((d) => d.id === selectedDayFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Manage Exercises
          </h2>
          <p className="text-xs text-slate-400">
            Create multi-question assessments, coding challenges &amp; upload
            exercises.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="w-48 text-xs"
          >
            <option value="ALL">All Study Days</option>
            {studyDays.map((d) => (
              <option key={d.id} value={d.id}>
                Day {d.dayNumber}: {d.title}
              </option>
            ))}
          </Select>

          <Button onClick={() => openCreateModal()} variant="primary">
            <Plus className="w-4 h-4 mr-1.5" /> Add Exercise
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Exercises Grouped by Study Day */}
      <div className="space-y-6">
        {visibleStudyDays.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            No study days found.
          </Card>
        ) : (
          visibleStudyDays.map((day) => {
            const dayExercises = exercises
              .filter((ex) => ex.studyDayId === day.id)
              .sort((a, b) => a.order - b.order);

            return (
              <Card
                key={day.id}
                className="p-0 overflow-hidden border border-slate-800 shadow-xl"
              >
                {/* Study Day Section Header */}
                <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {day.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {dayExercises.length}{' '}
                      {dayExercises.length === 1 ? 'exercise' : 'exercises'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCreateModal(day.id)}
                      className="text-xs px-2.5 py-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add to Day{' '}
                      {day.dayNumber}
                    </Button>
                  </div>
                </div>

                {/* Day Exercises Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3.5 w-16 text-center">Order</th>
                        <th className="p-3.5 w-36">Type</th>
                        <th className="p-3.5">Title</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5 w-28 text-center">Difficulty</th>
                        <th className="p-3.5 w-44 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dayExercises.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-6 text-center text-slate-500 text-xs"
                          >
                            No exercises created for Day {day.dayNumber} yet.
                          </td>
                        </tr>
                      ) : (
                        dayExercises.map((ex, index) => {
                          const isAssessment =
                            (ex.questions && ex.questions.length > 0) ||
                            (ex.assessmentType && ex.assessmentType !== 'NONE');
                          const qCount =
                            ex.totalQuestions || ex.questions?.length || 1;

                          return (
                            <tr
                              key={ex.id}
                              className="hover:bg-slate-900/50 transition-colors"
                            >
                              <td className="p-3.5 font-mono text-center">
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400">
                                  #{ex.order}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {isAssessment ? (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Assessment ({qCount}Q)
                                  </span>
                                ) : ex.isCoding ? (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    <Code2 className="w-3 h-3 mr-1" /> JS Coding
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                    <FileText className="w-3 h-3 mr-1" />{' '}
                                    Standard
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 font-bold text-slate-100">
                                {ex.title}
                              </td>
                              <td className="p-3.5 text-slate-400 max-w-xs truncate text-xs">
                                {ex.description}
                              </td>
                              <td className="p-3.5 text-center">
                                <Badge variant={ex.difficulty} />
                              </td>
                              <td className="p-3.5 text-right space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    void handleMoveExercise(
                                      day.id,
                                      ex.id,
                                      'up',
                                    )
                                  }
                                  disabled={
                                    index === 0 || reorderingDayId === day.id
                                  }
                                  title="Move Up"
                                  aria-label={`Move ${ex.title} up`}
                                  className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    void handleMoveExercise(
                                      day.id,
                                      ex.id,
                                      'down',
                                    )
                                  }
                                  disabled={
                                    index === dayExercises.length - 1 ||
                                    reorderingDayId === day.id
                                  }
                                  title="Move Down"
                                  aria-label={`Move ${ex.title} down`}
                                  className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </Button>
                                {(ex.isCoding || isAssessment) && (
                                  <Button
                                    onClick={() => setPreviewExercise(ex)}
                                    variant="ghost"
                                    size="sm"
                                    title="Preview Exercise Workspace"
                                    className="px-2 py-1 text-indigo-400 hover:text-indigo-300"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                                <Button
                                  onClick={() => openEditModal(ex)}
                                  variant="outline"
                                  size="sm"
                                  className="px-2 py-1"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDelete(ex.id, ex.title, ex.isCoding)
                                  }
                                  variant="danger"
                                  size="sm"
                                  className="px-2 py-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create / Edit Exercise Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
        className="max-w-4xl"
      >
        <form
          onSubmit={handleSave}
          className="space-y-4 max-h-[80vh] overflow-y-auto pr-1"
        >
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {formError}
            </div>
          )}

          {!editingExercise && (
            <Select
              id="studyDayId"
              label="Assigned Study Day"
              value={studyDayId}
              onChange={(e) => setStudyDayId(e.target.value)}
              required
            >
              {studyDays.map((d) => (
                <option key={d.id} value={d.id}>
                  Day {d.dayNumber}: {d.title}
                </option>
              ))}
            </Select>
          )}

          <Input
            id="title"
            label="Exercise Title"
            placeholder="e.g. JavaScript Fundamentals Checkpoint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Exercise Description / Instructions"
            placeholder="Overview instructions for students..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="difficulty"
              label="Difficulty Level"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as ExerciseDifficulty)
              }
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </Select>

            <Input
              id="order"
              type="number"
              label="Order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          {/* Exercise Category Selection */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Exercise Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center space-x-2 text-xs cursor-pointer transition-all ${
                  exerciseCategory === 'standard'
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="exerciseCategory"
                  checked={exerciseCategory === 'standard'}
                  onChange={() => setExerciseCategory('standard')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold">Standard Upload</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center space-x-2 text-xs cursor-pointer transition-all ${
                  exerciseCategory === 'coding'
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="exerciseCategory"
                  checked={exerciseCategory === 'coding'}
                  onChange={() => setExerciseCategory('coding')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold flex items-center">
                  <Code2 className="w-3.5 h-3.5 mr-1" /> JS Interactive
                </span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center space-x-2 text-xs cursor-pointer transition-all ${
                  exerciseCategory === 'assessment'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="exerciseCategory"
                  checked={exerciseCategory === 'assessment'}
                  onChange={() => setExerciseCategory('assessment')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />{' '}
                  Assessment (Question Bank)
                </span>
              </label>
            </div>
          </div>

          {/* 1. QUESTION BANK MULTI-QUESTION ASSESSMENT BUILDER */}
          {exerciseCategory === 'assessment' && (
            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Question Bank Assessment Composition
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select reusable questions from your Question Bank into this
                    assessment.
                  </p>
                </div>

                <Link
                  href="/admin/question-bank/new"
                  target="_blank"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Question in Bank
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Two Column Layout: Available Bank Questions & Selected Questions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Question Bank Picker */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      Available in Question Bank
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {filteredBankQuestions.length} available
                    </span>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <Input
                        value={qbSearch}
                        onChange={(e) => setQbSearch(e.target.value)}
                        placeholder="Search..."
                        className="pl-8 text-xs h-8 bg-slate-950"
                      />
                    </div>
                    <Select
                      value={qbTypeFilter}
                      onChange={(e) => setQbTypeFilter(e.target.value)}
                      className="text-xs h-8 bg-slate-950"
                    >
                      <option value="ALL">All Types</option>
                      <option value="CODE_OUTPUT">Code Output</option>
                      <option value="MULTIPLE_CHOICE">MCQ</option>
                      <option value="ESSAY">Essay</option>
                    </Select>
                  </div>

                  {/* Scrollable Questions list */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {filteredBankQuestions.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6 italic">
                        No matching questions in Question Bank.
                      </p>
                    ) : (
                      filteredBankQuestions.map((q) => {
                        const isAlreadySelected = selectedQuestions.some(
                          (sq) => sq.question.id === q.id,
                        );

                        return (
                          <div
                            key={q.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                              isAlreadySelected
                                ? 'bg-indigo-950/20 border-indigo-500/40 text-slate-300'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Badge className="text-[9px] px-1 py-0">
                                  {q.type}
                                </Badge>
                                <span className="text-[10px] text-indigo-400 font-mono">
                                  {q.defaultPoints} pts
                                </span>
                              </div>
                              <p className="font-semibold text-white truncate">
                                {q.title}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant={isAlreadySelected ? 'ghost' : 'outline'}
                              size="sm"
                              disabled={isAlreadySelected}
                              onClick={() => handleAddQuestionToSelected(q)}
                              className="h-7 text-xs px-2"
                            >
                              {isAlreadySelected ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right: Selected Exercise Questions */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Selected Questions ({selectedQuestions.length})
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      Total: {totalAssessmentPoints} pts
                    </span>
                  </div>

                  {selectedQuestions.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Select questions from the left panel to compose this
                      assessment.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {selectedQuestions.map((sq, idx) => (
                        <div
                          key={sq.question.id}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-2"
                        >
                          <span className="font-mono text-xs text-indigo-400 font-bold w-5">
                            #{idx + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate">
                              {sq.question.title}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {sq.question.type}
                            </span>
                          </div>

                          {/* Points Override */}
                          <div className="flex items-center gap-1 w-20">
                            <Input
                              type="number"
                              min={1}
                              value={sq.points}
                              onChange={(e) =>
                                handlePointsChange(
                                  idx,
                                  Number(e.target.value) || 0,
                                )
                              }
                              className="h-7 text-xs px-1 text-center bg-slate-900 border-slate-700"
                            />
                            <span className="text-[10px] text-slate-400">
                              pts
                            </span>
                          </div>

                          {/* Order controls */}
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveSelectedQuestion(idx, 'up')
                              }
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveSelectedQuestion(idx, 'down')
                              }
                              disabled={idx === selectedQuestions.length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedQuestion(idx)}
                              className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Passing Rules */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Passing Threshold (%)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={passingScore}
                    onChange={(e) =>
                      setPassingScore(Number(e.target.value) || 70)
                    }
                    className="h-10 text-xs bg-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    Students must score at least this percentage of total points
                    to pass.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Max Attempts (0 = Unlimited)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={maxAttempts}
                    onChange={(e) =>
                      setMaxAttempts(Number(e.target.value) || 0)
                    }
                    className="h-10 text-xs bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. CODING EXERCISE CONFIGURATION */}
          {exerciseCategory === 'coding' && (
            <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                  <Code2 className="w-4 h-4 mr-1.5" /> JavaScript Compiler &amp;
                  Test Suite Configuration
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="mode"
                  label="Execution Mode"
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as 'function' | 'console')
                  }
                >
                  <option value="function">
                    Function Return Value (Recommended)
                  </option>
                  <option value="console">Console Log Output</option>
                </Select>

                {mode === 'function' && (
                  <Input
                    id="functionName"
                    label="Function Name to Test"
                    placeholder="e.g. sum or calculate"
                    value={functionName}
                    onChange={(e) => setFunctionName(e.target.value)}
                    required
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Starter Code Template
                </label>
                <Textarea
                  id="starterCode"
                  placeholder="function sum(a, b) {\n  // Write your code here\n}"
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  rows={5}
                  className="font-mono text-xs"
                />
              </div>

              {/* Visual Test Case Builder Component */}
              <TestCaseBuilder tests={tests} onChange={setTests} mode={mode} />
            </div>
          )}

          <Button type="submit" isLoading={saving} className="w-full font-bold">
            {editingExercise ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </form>
      </Modal>

      {/* Admin Preview Modal */}
      {previewExercise && (
        <Modal
          isOpen={Boolean(previewExercise)}
          onClose={() => setPreviewExercise(null)}
          title={`Admin Preview: ${previewExercise.title}`}
          className="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
              ⚡ <strong>Admin Preview Mode:</strong> Test exercise interaction
              live.
            </div>
            {previewExercise.questions &&
            previewExercise.questions.length > 0 ? (
              <AssessmentWorkspace exercise={previewExercise} />
            ) : previewExercise.assessmentType &&
              previewExercise.assessmentType !== 'NONE' ? (
              <AssessmentWorkspace exercise={previewExercise} />
            ) : (
              <CodingWorkspace exercise={previewExercise} />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
