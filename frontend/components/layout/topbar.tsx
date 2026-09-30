'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
  description?: string;
}

export function Topbar({ onMenuClick, title, description }: TopbarProps) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title ? (
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h1>
              {description && <p className="text-xs text-slate-400 hidden sm:block">{description}</p>}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-200">Welcome,</span>
              <span className="text-sm font-bold text-indigo-400">{user?.name || 'Student'}</span>
              <span className="text-base">👋</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isAdmin && (
          <Link href="/admin">
            <Badge variant="ADMIN" className="hidden sm:inline-flex items-center gap-1 cursor-pointer">
              <Shield className="w-3 h-3" /> Admin Panel
            </Badge>
          </Link>
        )}
        <div className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </div>
        <Link href="/profile">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-colors"
          />
        </Link>
      </div>
    </header>
  );
}
