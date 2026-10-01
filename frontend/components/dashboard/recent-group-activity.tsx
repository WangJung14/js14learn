'use client';

import React from 'react';
import Link from 'next/link';
import { Activity as ActivityIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimeAgo } from '@/lib/utils';
import { Activity } from '@/types';

interface RecentGroupActivityProps {
  recentActivity?: Activity[];
}

export function RecentGroupActivity({ recentActivity = [] }: RecentGroupActivityProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <ActivityIcon className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-100">Recent Group Activity</CardTitle>
        </div>

        <Link
          href="/activity"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition-colors group"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-3">
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-slate-500 text-xs font-mono">
            <ActivityIcon className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
            <p>No recent group activity logged yet.</p>
          </div>
        ) : (
          recentActivity.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      act.user?.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        act.user?.name || 'User',
                      )}`
                    }
                    alt={act.user?.name || 'User'}
                    className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {act.message}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {formatTimeAgo(act.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
