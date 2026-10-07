'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, CheckSquare, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';
import { studyDaysApi } from '@/lib/api';
import { StudyDay } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminStudyDaysPage() {
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<StudyDay | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  const loadStudyDays = async () => {
    try {
      const data = await studyDaysApi.getAll();
      setStudyDays(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load study days.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudyDays();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= studyDays.length) return;

    const newDays = [...studyDays];
    const temp = newDays[index];
    newDays[index] = newDays[targetIndex];
    newDays[targetIndex] = temp;

    const reorderedList = newDays.map((day, idx) => ({
      id: day.id,
      order: idx + 1,
    }));

    setStudyDays(newDays.map((d, idx) => ({ ...d, order: idx + 1 })));

    try {
      await studyDaysApi.reorder(reorderedList);
    } catch (err: any) {
      setError(err.message || 'Failed to reorder study days.');
      await loadStudyDays();
    }
  };

  const openCreateModal = () => {
    setEditingDay(null);
    const nextDayNum = studyDays.length + 1;
    setDayNumber(nextDayNum);
    setOrder(nextDayNum);
    setTitle('');
    setDescription('');
    setContent('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (day: StudyDay) => {
    setEditingDay(day);
    setDayNumber(day.dayNumber);
    setOrder(day.order);
    setTitle(day.title);
    setDescription(day.description);
    setContent(day.content || '');
    setFormError(null);
    setIsModalOpen(true);
    if (!day.content) {
      try {
        const fullDay = await studyDaysApi.getById(day.id);
        if (fullDay?.content) {
          setContent(fullDay.content);
        }
      } catch {
        // Content will remain fallback
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !description) {
      setFormError('Please fill in title and description.');
      return;
    }

    setSaving(true);
    try {
      if (editingDay) {
        await studyDaysApi.update(editingDay.id, {
          dayNumber,
          title: title.trim(),
          description: description.trim(),
          ...(content ? { content } : {}),
          order,
        });
      } else {
        await studyDaysApi.create({
          dayNumber,
          title: title.trim(),
          description: description.trim(),
          content: content || '# ' + title.trim(),
          order,
        });
      }
      setIsModalOpen(false);
      await loadStudyDays();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save study day.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, titleName: string) => {
    if (!confirm(`Are you sure you want to delete "${titleName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await studyDaysApi.delete(id);
      await loadStudyDays();
    } catch (err: any) {
      alert(err.message || 'Failed to delete study day.');
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Manage Study Days</h2>
          <p className="text-xs text-slate-400">Create, edit, or reorder curriculum study days</p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          <Plus className="w-4 h-4 mr-1.5" /> Add Study Day
        </Button>
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
                <th className="p-4 w-16">Day #</th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-20 text-center">Order</th>
                <th className="p-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {studyDays.map((day, index) => (
                <tr key={day.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-400">
                    Day {String(day.dayNumber).padStart(2, '0')}
                  </td>
                  <td className="p-4 font-bold text-slate-100">{day.title}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{day.description}</td>
                  <td className="p-4 font-mono text-center text-slate-300">
                    <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-indigo-400">
                      #{day.order}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleMove(index, 'down')}
                      disabled={index === studyDays.length - 1}
                      title="Move Down"
                      className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Link href={`/admin/study-days/${day.id}/content`}>
                      <Button variant="outline" size="sm" className="px-2 py-1 text-xs border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/15">
                        <BookOpen className="w-3.5 h-3.5 mr-1" /> Edit Lesson
                      </Button>
                    </Link>
                    <Link href={`/admin/checklists?studyDayId=${day.id}`}>
                      <Button variant="outline" size="sm" className="px-2 py-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
                        <CheckSquare className="w-3.5 h-3.5 mr-1" /> Checklist
                      </Button>
                    </Link>
                    <Button onClick={() => openEditModal(day)} variant="outline" size="sm" className="px-2 py-1" title="Edit Metadata">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button onClick={() => handleDelete(day.id, day.title)} variant="danger" size="sm" className="px-2 py-1" title="Delete Study Day">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDay ? 'Edit Study Day' : 'Add New Study Day'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="dayNumber"
              type="number"
              label="Day Number"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
              required
            />
            <Input
              id="order"
              type="number"
              label="Order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <Input
            id="title"
            label="Title"
            placeholder="e.g. Higher-Order Functions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Short Description"
            placeholder="Brief overview of day objectives..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            required
          />

          <Textarea
            id="content"
            label="Lesson Content (Markdown)"
            placeholder="# Lesson Header\n\nContent details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />

          <Button type="submit" isLoading={saving} className="w-full">
            {editingDay ? 'Save Changes' : 'Create Study Day'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
