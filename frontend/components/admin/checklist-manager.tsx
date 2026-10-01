'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare,
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  AlertCircle,
  BookOpen,
  Code2,
  Award,
  Folder,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { checklistsApi, exercisesApi } from '@/lib/api';
import { ChecklistItem, ChecklistItemType, Exercise } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StudyDayChecklist } from '@/components/checklists/study-day-checklist';
import { Skeleton } from '@/components/ui/skeleton';

interface ChecklistManagerProps {
  studyDayId: string;
  studyDayTitle?: string;
  onClose?: () => void;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  studyDayId,
  studyDayTitle = 'Study Day',
  onClose,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Preview toggle state
  const [showPreview, setShowPreview] = useState(false);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: ChecklistItemType;
    isRequired: boolean;
    exerciseId: string;
  }>({
    title: '',
    description: '',
    type: 'LESSON',
    isRequired: true,
    exerciseId: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deletingItem, setDeletingItem] = useState<ChecklistItem | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [checklistData, exList] = await Promise.all([
        checklistsApi.getStudyDayChecklist(studyDayId),
        exercisesApi.getByStudyDay(studyDayId),
      ]);
      setItems(checklistData.items || []);
      setExercises(exList || []);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load checklist data.');
    } finally {
      setLoading(false);
    }
  }, [studyDayId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      type: 'LESSON',
      isRequired: true,
      exerciseId: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ChecklistItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      isRequired: item.isRequired,
      exerciseId: item.exerciseId || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        studyDayId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        isRequired: formData.isRequired,
        exerciseId:
          formData.type === 'EXERCISE' && formData.exerciseId
            ? formData.exerciseId
            : undefined,
      };

      if (editingItem) {
        await checklistsApi.adminUpdate(editingItem.id, payload);
        setActionSuccess('Checklist item updated successfully.');
      } else {
        await checklistsApi.adminCreate({
          ...payload,
          order: items.length,
        });
        setActionSuccess('Checklist item created successfully.');
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to save checklist item.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteSubmitting(true);
    try {
      await checklistsApi.adminDelete(deletingItem.id);
      setDeletingItem(null);
      setActionSuccess('Checklist item deleted successfully.');
      await loadData();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete checklist item.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update order indexes
    const reorderedList = newItems.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    setItems(newItems);

    try {
      await checklistsApi.adminReorder(reorderedList);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to persist item order.');
      await loadData(); // Revert
    }
  };

  const getItemTypeBadge = (type: ChecklistItemType) => {
    switch (type) {
      case 'LESSON':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-3 h-3 mr-1" /> Lesson
          </span>
        );
      case 'EXERCISE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code2 className="w-3 h-3 mr-1" /> Exercise
          </span>
        );
      case 'PROJECT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Folder className="w-3 h-3 mr-1" /> Project
          </span>
        );
      case 'CHECKPOINT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-3 h-3 mr-1" /> Checkpoint
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
            Custom
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg font-bold text-slate-100">
              Checklist Manager — {studyDayTitle}
            </CardTitle>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              {showPreview ? 'Hide Preview' : 'Student Preview'}
            </Button>

            <Button
              size="sm"
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void loadData()}
              className="text-xs text-rose-300 hover:bg-rose-500/20 p-1 h-6"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* Action success message */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span>{actionSuccess}</span>
            <button
              type="button"
              onClick={() => setActionSuccess(null)}
              className="text-emerald-400 font-bold hover:text-emerald-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Live Student Preview Mode */}
        {showPreview && (
          <div className="p-3 border border-indigo-500/30 bg-indigo-950/20 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Live Student View Preview</span>
            </div>
            <StudyDayChecklist studyDayId={studyDayId} compact={false} />
          </div>
        )}

        {/* Item List */}
        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl p-6">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            <p className="text-sm font-medium">No checklist tasks defined yet.</p>
            <p className="text-xs text-slate-600 mt-1">
              Click &quot;Add Task&quot; above to create the first checklist item.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const linkedEx = exercises.find((e) => e.id === item.exerciseId);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col space-y-1 mt-0.5">
                      <button
                        type="button"
                        onClick={() => void handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleMove(index, 'down')}
                        disabled={index === items.length - 1}
                        title="Move Down"
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          #{item.order + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-200">
                          {item.title}
                        </span>
                        {getItemTypeBadge(item.type)}
                        {item.isRequired ? (
                          <span className="text-[10px] text-rose-400 font-mono">*Required</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Optional</span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-400">{item.description}</p>
                      )}

                      {item.type === 'EXERCISE' && (
                        <p className="text-[11px] font-mono text-emerald-400/90">
                          {linkedEx
                            ? `Linked Exercise: ${linkedEx.title}`
                            : item.exerciseId
                              ? `Linked Exercise ID: ${item.exerciseId}`
                              : '⚠️ No exercise linked yet'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(item)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingItem(item)}
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Checklist Item' : 'Add Checklist Item'}
      >
        <form onSubmit={(e) => void handleFormSubmit(e)} className="space-y-4 text-xs">
          {formError && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
              {formError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Task Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Read Higher-Order Functions"
              className="bg-slate-900 border-slate-800 text-slate-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Description (Optional)</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide context or guidance for students..."
              className="bg-slate-900 border-slate-800 text-slate-100 min-h-[70px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Task Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as ChecklistItemType })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LESSON">LESSON</option>
                <option value="EXERCISE">EXERCISE</option>
                <option value="CHECKPOINT">CHECKPOINT</option>
                <option value="PROJECT">PROJECT</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </div>

            <div className="space-y-1 flex flex-col justify-end">
              <label className="flex items-center space-x-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300 font-medium">Required for Day Completion</span>
              </label>
            </div>
          </div>

          {/* Linked Exercise Selector (Shown if type === EXERCISE) */}
          {formData.type === 'EXERCISE' && (
            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
              <label className="text-emerald-400 font-semibold block">
                Link to Exercise (Study Day {studyDayTitle})
              </label>
              <select
                value={formData.exerciseId}
                onChange={(e) => setFormData({ ...formData, exerciseId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select Linked Exercise --</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.difficulty})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Linked exercise tasks are automatically marked complete when a student submits an approved solution.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              {formSubmitting ? 'Saving...' : editingItem ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        title="Confirm Delete Checklist Task"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Are you sure you want to delete checklist task{' '}
            <strong className="text-rose-400">&quot;{deletingItem?.title}&quot;</strong>?
          </p>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
            <strong>Warning:</strong> Existing student completion records for this checklist task will also be permanently removed.
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeletingItem(null)}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleteSubmitting}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold"
            >
              {deleteSubmitting ? 'Deleting...' : 'Delete Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
