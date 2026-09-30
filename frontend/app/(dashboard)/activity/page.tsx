'use client';

import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { ActivityFeed } from '@/components/activity-feed';

export default function ActivityPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ActivityIcon className="w-4 h-4" />
            <span>Community Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Activity Feed
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track recent submissions, completed lessons, and study group progress in real time.
          </p>
        </div>
      </div>

      {/* Main Activity Feed Component */}
      <ActivityFeed showTabs={true} title="Live Activity Stream" />
    </div>
  );
}
