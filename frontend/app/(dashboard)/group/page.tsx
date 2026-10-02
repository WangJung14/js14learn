'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Plus,
  MessageSquare,
  Crown,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { groupsApi } from '@/lib/api';
import { Group } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateGroupModal } from '@/components/groups/create-group-modal';

export default function GroupsDirectoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load study groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      setJoinError('Please enter an invite code.');
      return;
    }

    setJoining(true);
    setJoinError(null);
    try {
      const res = await groupsApi.join(inviteCodeInput.trim());
      setIsJoinModalOpen(false);
      setInviteCodeInput('');
      if (res && res.group?.id) {
        router.push(`/group/${res.group.id}`);
      } else {
        await loadGroups();
      }
    } catch (err: any) {
      setJoinError(err.message || 'Invalid invite code or already joined.');
    } finally {
      setJoining(false);
    }
  };

  const myGroups = groups.filter((g) => g.isMember || g.creatorId === user?.id);
  const otherGroups = groups.filter((g) => !g.isMember && g.creatorId !== user?.id);

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1 font-mono">
            <Users className="w-4 h-4" />
            <span>Collaborative Learning</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Study Groups & Real-Time Chat
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Join or create a study group to collaborate, solve coding exercises, and chat in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsJoinModalOpen(true)}
            variant="outline"
            className="text-xs border-slate-800 hover:bg-slate-900"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Join with Code
          </Button>
          <Button
            id="open-create-group-modal-btn"
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            className="text-xs shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Group
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* SECTION 1: MY STUDY GROUPS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
            <span>My Study Groups</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60 font-mono">
              {myGroups.length}
            </span>
          </h2>
        </div>

        {myGroups.length === 0 ? (
          <Card className="p-8 text-center bg-slate-950/40 border-slate-800/80 rounded-2xl">
            <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-200">You haven&apos;t joined any group yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
              Create your own group or join an existing one using an invite code to start chatting with peers.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Create Group
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsJoinModalOpen(true)}
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" /> Enter Invite Code
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((g) => {
              const isOwner = g.creatorId === user?.id || g.isOwner;

              return (
                <Card
                  key={g.id}
                  className="flex flex-col justify-between border-slate-800/80 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all rounded-2xl shadow-xl group"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {g.name}
                          </h3>
                        </div>
                        {isOwner && (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full font-mono">
                            <Crown className="w-3 h-3 mr-1" /> Owner
                          </span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {g.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-800/80 text-xs">
                      <div className="p-2 bg-slate-900/80 rounded-xl">
                        <p className="font-bold text-slate-100 font-mono">
                          {g.memberCount || 1}
                        </p>
                        <p className="text-[10px] text-slate-500">Members</p>
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded-xl">
                        <p className="font-bold text-indigo-400 font-mono">
                          {g.messageCount || 0}
                        </p>
                        <p className="text-[10px] text-slate-500">Messages</p>
                      </div>
                    </div>

                    <Link
                      href={`/group/${g.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                    >
                      <span>Open Chat & Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: EXPLORE OTHER GROUPS */}
      {otherGroups.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-200">
            Available Study Groups ({otherGroups.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGroups.map((g) => (
              <Card
                key={g.id}
                className="flex flex-col justify-between border-slate-800/60 bg-slate-950/30 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-100">{g.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {g.description || 'Public study group for JS learners.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" /> {g.memberCount || 1} members
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await groupsApi.joinById(g.id);
                        router.push(`/group/${g.id}`);
                      } catch (err: any) {
                        alert(err.message || 'Failed to join group');
                      }
                    }}
                    className="text-xs"
                  >
                    Join Group
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newGroup) => {
          router.push(`/group/${newGroup.id}`);
        }}
      />

      {/* Join with Invite Code Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join Study Group"
        description="Enter the invite code shared by your group administrator or peer."
      >
        <form onSubmit={handleJoinWithCode} className="space-y-4">
          {joinError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {joinError}
            </div>
          )}

          <Input
            id="join-invite-code-input"
            label="Invite Code *"
            placeholder="e.g. GRP-A1B2C3"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsJoinModalOpen(false)}
              disabled={joining}
            >
              Cancel
            </Button>
            <Button
              id="submit-join-code-btn"
              type="submit"
              variant="primary"
              isLoading={joining}
            >
              Join Group
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
