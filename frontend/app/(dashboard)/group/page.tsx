'use client';

import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Activity as ActivityIcon, CheckCircle2, Copy, Check } from 'lucide-react';
import { groupsApi } from '@/lib/api';
import { Group, Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/lib/utils';

export default function GroupPage() {
  const [group, setGroup] = useState<Group | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Join Group State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadGroupData = async () => {
    try {
      const groupData = await groupsApi.getMyGroup();
      setGroup(groupData);
      const actData = await groupsApi.getActivity(groupData.id);
      setActivities(actData);
    } catch (err: any) {
      if (err.statusCode === 404) {
        setGroup(null);
      } else {
        setError(err.message || 'Failed to load group details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupData();
  }, []);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    if (!inviteCodeInput) {
      setJoinError('Please enter an invite code.');
      return;
    }

    setJoining(true);
    try {
      await groupsApi.join(inviteCodeInput.trim());
      setIsJoinModalOpen(false);
      setInviteCodeInput('');
      setLoading(true);
      await loadGroupData();
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join group. Check the invite code.');
    } finally {
      setJoining(false);
    }
  };

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Study Group Visibility</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            {group ? group.name : 'Study Group'}
          </h1>
        </div>

        {group ? (
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400 font-mono">Invite Code:</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">{group.inviteCode}</span>
            <button
              onClick={copyInviteCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy Invite Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <Button onClick={() => setIsJoinModalOpen(true)} variant="primary">
            <UserPlus className="w-4 h-4 mr-2" /> Join a Study Group
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* If not in a group */}
      {!group && !error && (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
          <Users className="w-16 h-16 mx-auto text-slate-600" />
          <h3 className="text-xl font-bold text-slate-100">You are not in a group yet</h3>
          <p className="text-sm text-slate-400">
            Join your friends using your group&apos;s invite code to start tracking progress together.
          </p>
          <Button onClick={() => setIsJoinModalOpen(true)} className="mt-2">
            Join Group Now
          </Button>
        </Card>
      )}

      {/* Member Progress Cards Grid */}
      {group && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-xl font-bold text-slate-100">Group Members ({group.members?.length || 0})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {group.members?.map((member) => (
              <Card
                key={member.id}
                className="flex flex-col justify-between space-y-4 border-slate-800/80 bg-slate-900/80 hover:border-indigo-500/40 transition-all"
              >
                <CardHeader className="p-0">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      alt={member.name}
                      className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700"
                    />
                    <div className="truncate">
                      <h3 className="text-base font-bold text-slate-100 truncate">{member.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{member.email}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-indigo-400 font-bold">{member.percentage}%</span>
                    </div>
                    <ProgressBar value={member.percentage} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800 text-xs">
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <p className="font-bold text-slate-100">Day {member.currentDayNumber}</p>
                      <p className="text-[10px] text-slate-500">Current Focus</p>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <p className="font-bold text-emerald-400">{member.completedExercises}</p>
                      <p className="text-[10px] text-slate-500">Approved Challenges</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Group Activity Stream */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800 pb-4">
              <ActivityIcon className="w-5 h-5 text-indigo-400" />
              <CardTitle className="text-lg">Group Activity Log</CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No group activities logged yet.</p>
              ) : (
                activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={act.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user?.name}`}
                        alt={act.user?.name || 'User'}
                        className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{act.message}</p>
                        <p className="text-[11px] text-slate-500">{formatTimeAgo(act.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Join Group Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join Study Group"
        description="Enter the invite code shared by your group administrator."
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          {joinError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
              {joinError}
            </div>
          )}

          <Input
            id="inviteCode"
            label="Invite Code"
            placeholder="e.g. JSWARRIORS2026"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
            required
          />

          <Button type="submit" isLoading={joining} className="w-full">
            Join Group
          </Button>
        </form>
      </Modal>
    </div>
  );
}
