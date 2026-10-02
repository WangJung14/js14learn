'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Users,
  Activity,
  User,
  ShieldAlert,
  LogOut,
  Code2,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Roadmap', href: '/roadmap', icon: Map },
    { name: 'Attendance', href: '/attendance', icon: Clock },
    { name: 'Study Group', href: '/group', icon: Users },
    { name: 'Activity Feed', href: '/activity', icon: Activity },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Admin Overview', href: '/admin', icon: ShieldAlert },
    { name: 'Manage Roadmap', href: '/admin/study-days', icon: Map },
    { name: 'Manage Exercises', href: '/admin/exercises', icon: Code2 },
    { name: 'Review Submissions', href: '/admin/submissions', icon: FileCheck },
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container: Transparent Glassmorphism allowing background1.jpg to show through */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 border-r border-slate-800/80 bg-slate-950/30 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 overflow-hidden shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar Content Viewport */}
        <div className="relative z-10 flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          {/* Brand Logo Header */}
          <Link href="/dashboard" className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800/60 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900/70 p-1 border border-indigo-500/30 shadow-md flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform backdrop-blur-md">
              <img
                src="/assets/logos/STUDY-Hub.svg"
                alt="JS Study Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="truncate">
              <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent truncate">
                JS Study Hub
              </h1>
              <p className="text-[10px] text-indigo-300 font-mono tracking-widest uppercase">
                GROUP LEARNING
              </p>
            </div>
          </Link>

          {/* Student Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono drop-shadow">
              MAIN MENU
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative backdrop-blur-md',
                    isActive
                      ? 'bg-indigo-600/35 text-white border border-indigo-500/50 shadow-lg shadow-indigo-600/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/50',
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-400 shadow-sm" />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200',
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Motivational Glass Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/40 backdrop-blur-md border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>14-Day Sprint</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Master JavaScript core concepts, async workflows & DOM patterns together!
            </p>
          </div>

          {/* Admin Navigation Section */}
          {isAdmin && (
            <div className="space-y-1 pt-4 border-t border-slate-800/60">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono">
                  ADMIN CONTROL
                </p>
                <Badge variant="ADMIN" className="text-[9px] px-1.5 py-0">
                  ADMIN
                </Badge>
              </div>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-md',
                      isActive
                        ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/50',
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-rose-400' : 'text-slate-400')} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User Footer Card & Logout */}
        <div className="relative z-10 p-4 border-t border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`
                }
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover flex-shrink-0"
              />
              <div className="truncate min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Quang Trung'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'quangtrung5467@...'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-2 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
