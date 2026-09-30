'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Save, CheckCircle2, Shield, Flame, FileCode } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi, activityApi } from '@/lib/api';
import { Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/lib/utils';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadMyActivities() {
      try {
        const acts = await activityApi.getMyActivity();
        setMyActivities(acts);
      } catch {
        // silent fallback
      }
    }
    loadMyActivities();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await usersApi.updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      await refreshUser();
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500/50 shadow-xl"
        />
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{user.name}</h1>
            <Badge variant={user.role} />
          </div>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Edit Profile Form */}
        <Card className="border-slate-800">
          <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800 pb-4">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg">Edit Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-medium text-rose-400">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-medium text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                id="email"
                label="Email Address (Read-only in MVP)"
                value={user.email}
                disabled
                className="bg-slate-900 cursor-not-allowed opacity-70"
              />

              <Input
                id="avatarUrl"
                label="Avatar Image URL (Optional)"
                placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=Tommy"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />

              <Button type="submit" isLoading={saving} className="w-full">
                <Save className="w-4 h-4 mr-2" /> Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Personal Activity Log */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 border-b border-slate-800 pb-4">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-lg">Your Personal Activity History</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-3">
            {myActivities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No personal activity recorded yet.</p>
            ) : (
              myActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-200">{act.message}</p>
                    <p className="text-[10px] text-slate-500">{formatTimeAgo(act.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
