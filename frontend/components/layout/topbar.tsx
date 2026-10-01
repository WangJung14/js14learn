'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, Shield, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
  description?: string;
}

export function Topbar({ onMenuClick, title, description }: TopbarProps) {
  const { user, isAdmin } = useAuth();
  const userName = user?.name || 'Quang Trung';

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left Area */}
      <div className="flex items-center space-x-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {title ? (
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight truncate">{title}</h1>
              {description && <p className="text-xs text-slate-400 hidden sm:block truncate">{description}</p>}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-300">Welcome,</span>
              <span className="text-sm font-bold text-indigo-300 truncate">{userName}</span>
              <span className="text-base">👋</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Search Input (Desktop/Tablet) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search lessons, exercises, topics..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
        {isAdmin && (
          <Link href="/admin">
            <Badge variant="ADMIN" className="hidden sm:inline-flex items-center gap-1 cursor-pointer">
              <Shield className="w-3 h-3" /> Admin Panel
            </Badge>
          </Link>
        )}

        {/* Notifications Icon */}
        <button
          type="button"
          title="Notifications"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        </button>

        {/* User Profile Area */}
        <Link href="/profile" className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-900/80 transition-colors">
          <img
            src={
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
            }
            alt={userName}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 object-cover"
          />
          <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
            {userName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline-block" />
        </Link>
      </div>
    </header>
  );
}
