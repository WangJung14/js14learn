'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { groupsApi } from '@/lib/api';
import { Group } from '@/types';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onUpdated: (updatedGroup: Group) => void;
}

export function EditGroupModal({
  isOpen,
  onClose,
  group,
  onUpdated,
}: EditGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setDescription(group.description || '');
      setError(null);
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    if (!name.trim()) {
      setError('Group name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await groupsApi.update(group.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Study Group"
      description="Update your group information."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
            {error}
          </div>
        )}

        <Input
          id="edit-group-name"
          label="Group Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Description
          </label>
          <textarea
            id="edit-group-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            id="save-group-edit-btn"
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
