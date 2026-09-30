'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Code2 } from 'lucide-react';
import { exercisesApi, studyDaysApi } from '@/lib/api';
import { Exercise, StudyDay, ExerciseDifficulty } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [studyDayId, setStudyDayId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>('EASY');
  const [order, setOrder] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || 'Failed to load exercises data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingExercise(null);
    setTitle('');
    setDescription('');
    setDifficulty('EASY');
    setOrder(1);
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
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !description || !studyDayId) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      if (editingExercise) {
        await exercisesApi.update(editingExercise.id, {
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
        });
      } else {
        await exercisesApi.create({
          studyDayId,
          title: title.trim(),
          description: description.trim(),
          difficulty,
          order,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save exercise.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, exTitle: string) => {
    if (!confirm(`Are you sure you want to delete exercise "${exTitle}"?`)) {
      return;
    }
    try {
      await exercisesApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete exercise.');
    }
  };

  const filteredExercises =
    selectedDayFilter === 'ALL'
      ? exercises
      : exercises.filter((ex) => ex.studyDayId === selectedDayFilter);

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
          <p className="text-xs text-slate-400">Add, edit, or delete coding challenges assigned to study days</p>
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

          <Button onClick={openCreateModal} variant="primary">
            <Plus className="w-4 h-4 mr-1.5" /> Add Exercise
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Table Card */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-28 text-center">Difficulty</th>
                <th className="p-4 w-20 text-center">Order</th>
                <th className="p-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExercises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                    No exercises found for this filter.
                  </td>
                </tr>
              ) : (
                filteredExercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 font-bold text-slate-100">{ex.title}</td>
                    <td className="p-4 text-slate-400 max-w-sm truncate">{ex.description}</td>
                    <td className="p-4 text-center">
                      <Badge variant={ex.difficulty} />
                    </td>
                    <td className="p-4 font-mono text-center text-slate-300">{ex.order}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button onClick={() => openEditModal(ex)} variant="outline" size="sm" className="px-2 py-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(ex.id, ex.title)} variant="danger" size="sm" className="px-2 py-1">
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
      >
        <form onSubmit={handleSave} className="space-y-4">
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
            rows={4}
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

          <Button type="submit" isLoading={saving} className="w-full">
            {editingExercise ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
