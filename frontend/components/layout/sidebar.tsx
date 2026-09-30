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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logo Header */}
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800/60">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-indigo-300 bg-clip-text text-transparent">
                JS Study Hub
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">Group Learning</p>
            </div>
          </div>

          {/* Student Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900',
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-slate-500')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin Navigation Section */}
          {isAdmin && (
            <div className="space-y-1 pt-4 border-t border-slate-800/60">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-semibold text-rose-400/90 uppercase tracking-wider">
                  Admin Control
                </p>
                <Badge variant="ADMIN" className="text-[9px] px-1.5 py-0">ADMIN</Badge>
              </div>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900',
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-rose-400' : 'text-slate-500')} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User Footer Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0"
              />
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-100 truncate">{user?.name || 'Student'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
