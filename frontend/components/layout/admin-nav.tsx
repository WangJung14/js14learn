'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Code2, FileCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Study Days', href: '/admin/study-days', icon: Map },
    { name: 'Exercises', href: '/admin/exercises', icon: Code2 },
    { name: 'Submissions', href: '/admin/submissions', icon: FileCheck },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex overflow-x-auto space-x-1 border-b border-slate-800 pb-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900',
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
