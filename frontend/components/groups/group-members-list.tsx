'use client';

import React, { useState } from 'react';
import { Crown, UserMinus, ShieldAlert } from 'lucide-react';
import { GroupMemberProgress, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface GroupMembersListProps {
  groupId: string;
  members: GroupMemberProgress[];
  currentUser: User | null;
  isOwner: boolean;
  onRemoveMember: (userId: string) => Promise<void>;
}

export function GroupMembersList({
  members,
  currentUser,
  isOwner,
  onRemoveMember,
}: GroupMembersListProps) {
  const [selectedMember, setSelectedMember] =
    useState<GroupMemberProgress | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleConfirmRemove = async () => {
    if (!selectedMember) return;
    setRemoving(true);
    setRemoveError(null);
    try {
      await onRemoveMember(selectedMember.id);
      setSelectedMember(null);
    } catch (err: any) {
      setRemoveError(err.message || 'Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          Members ({members.length})
        </h3>
      </div>

      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {members.map((member) => {
          const isCurrentUser = member.id === currentUser?.id;
          const avatarUrl =
            member.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`;

          return (
            <div
              key={member.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 transition-all hover:border-slate-700',
                isCurrentUser && 'border-indigo-500/30 bg-indigo-950/20',
              )}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={avatarUrl}
                  alt={member.name}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover flex-shrink-0"
                />
                <div className="truncate min-w-0">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-sm font-bold text-slate-100 truncate">
                      {member.name}
                    </span>
                    {member.isOwner && (
                      <span
                        title="Group Owner"
                        className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded-md font-mono flex-shrink-0"
                      >
                        <Crown className="w-2.5 h-2.5 mr-0.5" /> Owner
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* Owner action: Remove member (cannot remove self) */}
              {isOwner && !member.isOwner && !isCurrentUser && (
                <button
                  onClick={() => setSelectedMember(member)}
                  title={`Remove ${member.name}`}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-2 flex-shrink-0"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title="Remove Member from Group"
        description="Are you sure you want to remove this member? They will lose access to the group chat."
      >
        <div className="space-y-4">
          {removeError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {removeError}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              User <strong className="text-white">{selectedMember?.name}</strong> will be immediately removed from the group and disconnected from the chat room.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setSelectedMember(null)}
              disabled={removing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmRemove}
              isLoading={removing}
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
