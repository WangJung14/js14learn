'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Copy,
  Check,
  LogOut,
  Edit,
  Trash2,
  ChevronLeft,
  MessageSquare,
  Shield,
  Sparkles,
} from 'lucide-react';
import { groupsApi } from '@/lib/api';
import { Group } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGroupChat } from '@/hooks/useGroupChat';
import { ChatWindow } from '@/components/chat/chat-window';
import { GroupMembersList } from '@/components/groups/group-members-list';
import { EditGroupModal } from '@/components/groups/edit-group-modal';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ groupId: string }>;
}

export default function GroupDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const groupId = resolvedParams.groupId;
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Modals & UI states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'members'>('chat');

  // Real-time Chat hook
  const {
    messages,
    loading: chatLoading,
    loadingOlder,
    hasMore,
    connectionStatus,
    error: chatError,
    sendMessage,
    loadOlderMessages,
  } = useGroupChat({ groupId });

  const loadGroup = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupsApi.getById(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveGroup = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await groupsApi.leave(groupId);
      setIsLeaveOpen(false);
      router.push('/group');
    } catch (err: any) {
      setActionError(err.message || 'Failed to leave group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await groupsApi.delete(groupId);
      setIsDeleteOpen(false);
      router.push('/group');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    await groupsApi.removeMember(groupId, targetUserId);
    await loadGroup();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <Users className="w-12 h-12 mx-auto text-rose-400" />
        <h2 className="text-xl font-bold text-slate-100">Group Not Accessible</h2>
        <p className="text-sm text-slate-400">
          {error || 'You do not have access to this study group or it does not exist.'}
        </p>
        <Button onClick={() => router.push('/group')} variant="outline" className="mt-2">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Study Groups
        </Button>
      </div>
    );
  }

  const isOwner = group.isOwner || (group.creatorId ? group.creatorId === user?.id : false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-2 sm:p-4 md:p-6">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/group')}
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Study Groups
        </button>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMobileTab('chat')}
            className={cn(
              'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeMobileTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white',
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('members')}
            className={cn(
              'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeMobileTab === 'members'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white',
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({group.members?.length || group.memberCount || 0})</span>
          </button>
        </div>
      </div>

      {/* Group Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {group.name}
            </h1>
            {isOwner && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 font-mono">
                Owner
              </span>
            )}
          </div>
          {group.description && (
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {group.description}
            </p>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Invite Code Pill */}
          <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-mono">Code:</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">
              {group.inviteCode}
            </span>
            <button
              onClick={copyInviteCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy Invite Code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Owner Actions: Edit / Delete */}
          {isOwner ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditOpen(true)}
                className="text-xs border-slate-800 hover:bg-slate-800"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setIsDeleteOpen(true)}
                className="text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
            </div>
          ) : (
            /* Member Action: Leave Group */
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLeaveOpen(true)}
              className="text-xs text-rose-400 border-rose-900/40 hover:bg-rose-950/30"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Leave Group
            </Button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout (Desktop) / Tabbed (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Members & Stats */}
        <div
          className={cn(
            'lg:col-span-1 space-y-6',
            activeMobileTab === 'members' ? 'block' : 'hidden lg:block',
          )}
        >
          <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-slate-800/80 shadow-lg space-y-6">
            <GroupMembersList
              groupId={group.id}
              members={group.members || []}
              currentUser={user}
              isOwner={isOwner}
              onRemoveMember={handleRemoveMember}
            />

            {/* Group Info Tip */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Real-Time Hub</span>
              </div>
              <p>
                Messages in this study group are stored securely and synchronized instantly across all connected members.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Chat Window */}
        <div
          className={cn(
            'lg:col-span-2',
            activeMobileTab === 'chat' ? 'block' : 'hidden lg:block',
          )}
        >
          <ChatWindow
            groupId={group.id}
            currentUser={user}
            messages={messages}
            loading={chatLoading}
            loadingOlder={loadingOlder}
            hasMore={hasMore}
            connectionStatus={connectionStatus}
            error={chatError}
            onSendMessage={sendMessage}
            onLoadOlder={loadOlderMessages}
          />
        </div>
      </div>

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        group={group}
        onUpdated={(updated) => setGroup((prev) => (prev ? { ...prev, ...updated } : updated))}
      />

      {/* Delete Group Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Study Group"
        description="Are you sure you want to delete this study group? This will permanently remove the group, all memberships, and chat history."
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {actionError}
            </div>
          )}

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center space-x-3">
            <Shield className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              This action cannot be undone. All messages and progress shared within this group will be deleted.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              id="confirm-delete-group-btn"
              variant="danger"
              onClick={handleDeleteGroup}
              isLoading={actionLoading}
            >
              Delete Group
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Group Confirmation Modal */}
      <Modal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        title="Leave Study Group"
        description="Are you sure you want to leave this study group? You will lose access to the group chat until re-invited."
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {actionError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsLeaveOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              id="confirm-leave-group-btn"
              variant="danger"
              onClick={handleLeaveGroup}
              isLoading={actionLoading}
            >
              Leave Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
