'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FileCode,
  CheckCircle2,
  Users,
  Code2,
  Activity as ActivityIcon,
  RefreshCw,
  User as UserIcon,
} from 'lucide-react';
import { activityApi } from '@/lib/api';
import { Activity, ActivityType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo } from '@/lib/utils';

interface ActivityFeedProps {
  limit?: number;
  showTabs?: boolean;
  compact?: boolean;
  title?: string;
  initialTab?: 'group' | 'me';
}

export function ActivityFeed({
  limit,
  showTabs = true,
  compact = false,
  title = 'Activity Feed',
  initialTab = 'group',
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'group' | 'me'>(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        activeTab === 'group'
          ? await activityApi.getGroupActivity()
          : await activityApi.getMyActivity();
      setActivities(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load activity stream.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        const data =
          activeTab === 'group'
            ? await activityApi.getGroupActivity()
            : await activityApi.getMyActivity();
        if (active) {
          setActivities(data);
        }
      } catch (err: unknown) {
        if (active) {
          const message =
            err instanceof Error ? err.message : 'Failed to load activity stream.';
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [activeTab]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'SUBMITTED_EXERCISE':
        return (
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg flex-shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
        );
      case 'COMPLETED_DAY':
        return (
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'JOINED_GROUP':
        return (
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
        );
      case 'UPLOADED_PROJECT':
        return (
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg flex-shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-slate-800 text-slate-400 rounded-lg flex-shrink-0">
            <ActivityIcon className="w-4 h-4" />
          </div>
        );
    }
  };

  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  return (
    <Card className={compact ? 'border-slate-800' : 'border-slate-800/80 bg-slate-900/60'}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <ActivityIcon className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-lg font-bold text-slate-100">{title}</CardTitle>
        </div>

        <div className="flex items-center space-x-2">
          {showTabs && (
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('group')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'group'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Group Feed</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('me')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'me'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>My Activity</span>
              </button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => void fetchActivities()}
            disabled={loading}
            title="Refresh Activity Feed"
            className="p-2 h-8 w-8 text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {loading ? (
          <div className="space-y-3 py-2">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/40">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/40">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/40">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchActivities()}
              className="text-xs border-rose-500/40 hover:bg-rose-500/20"
            >
              Retry
            </Button>
          </div>
        ) : displayedActivities.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <ActivityIcon className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-300">No activity recorded yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'group'
                ? 'Activity from your group members will appear here as exercises are submitted and completed.'
                : 'Your personal activities will be tracked here when you work on exercises.'}
            </p>
          </div>
        ) : (
          displayedActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <img
                  src={
                    act.user?.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      act.user?.name || 'User',
                    )}`
                  }
                  alt={act.user?.name || 'User'}
                  className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 mt-0.5"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">
                    {act.message}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {formatTimeAgo(act.createdAt)}
                  </p>
                </div>
              </div>
              {getActivityIcon(act.type)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
