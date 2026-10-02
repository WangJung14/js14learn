'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Code2, Eye, FileText, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';
import { exercisesApi, studyDaysApi } from '@/lib/api';
import { Exercise, StudyDay, ExerciseDifficulty, CodingTestCase, CodingExerciseConfig } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { TestCaseBuilder } from '@/components/admin/test-case-builder';
import { CodingWorkspace } from '@/components/code-editor/coding-workspace';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingDayId, setReorderingDayId] = useState<string | null>(null);

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

  // Coding Exercise Fields
  const [isCoding, setIsCoding] = useState<boolean>(false);
  const [mode, setMode] = useState<'function' | 'console'>('function');
  const [functionName, setFunctionName] = useState<string>('');
  const [starterCode, setStarterCode] = useState<string>('');
  const [tests, setTests] = useState<CodingTestCase[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Preview Modal State
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  const loadData = async () => {
    try {
      const days = await studyDaysApi.getAll();
      setStudyDays(days);

      if (days.length > 0) {
        if (!studyDayId) setStudyDayId(days[0].id);

        const allExercisesPromises = days.map((d) => exercisesApi.getByStudyDay(d.id));
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
    setIsCoding(false);
    setMode('function');
    setFunctionName('');
    setStarterCode('// Write your starter code here\n');
    setTests([]);
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
    setIsCoding(Boolean(ex.isCoding));

    const cfg = (ex.codingConfig as CodingExerciseConfig | null) || null;
    setMode(cfg?.mode || 'function');
    setFunctionName(cfg?.functionName || '');
    setStarterCode(ex.starterCode || cfg?.starterCode || '// Write starter code here\n');
    setTests(cfg?.tests || []);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || !studyDayId) {
      setFormError('Please fill in all required basic fields.');
      return;
    }

    if (isCoding) {
      if (mode === 'function' && !functionName.trim()) {
        setFormError('Function Name is required for function-mode coding exercises.');
        return;
      }
    }

    const codingConfigPayload: CodingExerciseConfig | undefined = isCoding
      ? {
          language: 'javascript',
          mode,
          functionName: mode === 'function' ? functionName.trim() : undefined,
          starterCode: starterCode.trim(),
          tests,
        }
      : undefined;

    setSaving(true);
    try {
      if (editingExercise) {
        await exercisesApi.update(editingExercise.id, {
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
          isCoding,
          starterCode: isCoding ? starterCode : undefined,
          codingConfig: codingConfigPayload,
        });
      } else {
        await exercisesApi.create({
          studyDayId,
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
          isCoding,
          starterCode: isCoding ? starterCode : undefined,
          codingConfig: codingConfigPayload,
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

  const handleDelete = async (id: string, exTitle: string, isCodingEx?: boolean) => {
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

    // Optimistic local update
    setExercises((prev) => {
      const updatedMap = new Map(items.map((it) => [it.id, it.order]));
      return prev.map((ex) =>
        updatedMap.has(ex.id) ? { ...ex, order: updatedMap.get(ex.id)! } : ex,
      );
    });

    setReorderingDayId(targetStudyDayId);
    setError(null);

    try {
      const updatedDayExercises = await exercisesApi.reorder(targetStudyDayId, items);
      setExercises((prev) => {
        const otherExercises = prev.filter((ex) => ex.studyDayId !== targetStudyDayId);
        return [...otherExercises, ...updatedDayExercises];
      });
    } catch (err: unknown) {
      setExercises(previousExercises);
      setError((err as Error).message || 'Failed to reorder exercises. Restored previous order.');
    } finally {
      setReorderingDayId(null);
    }
  };

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
          <h2 className="text-2xl font-bold text-slate-100">Manage Exercises</h2>
          <p className="text-xs text-slate-400">Add, edit, or reorder coding challenges &amp; exercises grouped by Study Day</p>
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
              <Card key={day.id} className="p-0 overflow-hidden border border-slate-800">
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
                      <p className="text-xs text-slate-400 line-clamp-1">{day.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {dayExercises.length} {dayExercises.length === 1 ? 'exercise' : 'exercises'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCreateModal(day.id)}
                      className="text-xs px-2.5 py-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add to Day {day.dayNumber}
                    </Button>
                  </div>
                </div>

                {/* Day Exercises Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3.5 w-16 text-center">Order</th>
                        <th className="p-3.5 w-32">Type</th>
                        <th className="p-3.5">Title</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5 w-28 text-center">Difficulty</th>
                        <th className="p-3.5 w-44 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dayExercises.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                            No exercises created for Day {day.dayNumber} yet.
                          </td>
                        </tr>
                      ) : (
                        dayExercises.map((ex, index) => (
                          <tr key={ex.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5 font-mono text-center">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400">
                                #{ex.order}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {ex.isCoding ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  <Code2 className="w-3 h-3 mr-1" /> JS Coding
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                  <FileText className="w-3 h-3 mr-1" /> Standard
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-slate-100">{ex.title}</td>
                            <td className="p-3.5 text-slate-400 max-w-xs truncate text-xs">{ex.description}</td>
                            <td className="p-3.5 text-center">
                              <Badge variant={ex.difficulty} />
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => void handleMoveExercise(day.id, ex.id, 'up')}
                                disabled={index === 0 || reorderingDayId === day.id}
                                title="Move Up"
                                aria-label={`Move ${ex.title} up`}
                                className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => void handleMoveExercise(day.id, ex.id, 'down')}
                                disabled={index === dayExercises.length - 1 || reorderingDayId === day.id}
                                title="Move Down"
                                aria-label={`Move ${ex.title} down`}
                                className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                              {ex.isCoding && (
                                <Button
                                  onClick={() => setPreviewExercise(ex)}
                                  variant="ghost"
                                  size="sm"
                                  title="Preview Coding Workspace"
                                  className="px-2 py-1 text-indigo-400 hover:text-indigo-300"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button onClick={() => openEditModal(ex)} variant="outline" size="sm" className="px-2 py-1">
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button onClick={() => handleDelete(ex.id, ex.title, ex.isCoding)} variant="danger" size="sm" className="px-2 py-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))
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
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
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
            placeholder="e.g. Higher-Order Map Transformation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Exercise Description & Instructions"
            placeholder="Detailed instructions for student solution..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="difficulty"
              label="Difficulty Level"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
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

          {/* Exercise Type Selection */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Exercise Type
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="exerciseType"
                  checked={!isCoding}
                  onChange={() => setIsCoding(false)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Standard Solution Upload</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-indigo-300 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="exerciseType"
                  checked={isCoding}
                  onChange={() => setIsCoding(true)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center">
                  <Code2 className="w-3.5 h-3.5 mr-1" /> JavaScript Interactive Coding
                </span>
              </label>
            </div>
          </div>

          {/* Coding Exercise Configuration Controls */}
          {isCoding && (
            <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                  <Code2 className="w-4 h-4 mr-1.5" /> JavaScript Compiler &amp; Test Suite Configuration
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="mode"
                  label="Execution Mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'function' | 'console')}
                >
                  <option value="function">Function Return Value (Recommended)</option>
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

          <Button type="submit" isLoading={saving} className="w-full">
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
        >
          <div className="space-y-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
              ⚡ <strong>Admin Preview Mode:</strong> Test code execution and assertions live. Submissions are NOT persisted to student records in preview mode.
            </div>
            <CodingWorkspace exercise={previewExercise} />
          </div>
        </Modal>
      )}
    </div>
  );
}
