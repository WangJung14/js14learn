'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { groupsApi } from '@/lib/api';
import { Group } from '@/types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (group: Group) => void;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  onCreated,
}: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newGroup = await groupsApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
        inviteCode: inviteCode.trim() || undefined,
      });

      setName('');
      setDescription('');
      setInviteCode('');
      onCreated(newGroup);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Study Group"
      description="Create a private group to study and chat in real-time with fellow learners."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
            {error}
          </div>
        )}

        <Input
          id="group-name-input"
          label="Group Name *"
          placeholder="e.g. JavaScript Maestros"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Description (Optional)
          </label>
          <textarea
            id="group-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is your group focusing on?"
            rows={3}
            maxLength={500}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <Input
          id="group-invite-code-input"
          label="Custom Invite Code (Optional)"
          placeholder="e.g. JS-2026-WARRIORS (leave empty to auto-generate)"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          maxLength={50}
        />

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
            id="create-group-submit-btn"
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}
