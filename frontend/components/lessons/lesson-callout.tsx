'use client';

import React from 'react';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Bookmark,
  FlaskConical,
} from 'lucide-react';
import { CalloutType, InlineToken } from '@/lib/markdown-parser';
import { InlineTokensRenderer } from './inline-tokens-renderer';

interface LessonCalloutProps {
  type: CalloutType;
  title?: string;
  tokens?: InlineToken[];
  children?: React.ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    icon: React.ElementType;
    badge: string;
    border: string;
    bg: string;
    text: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    icon: Info,
    badge: 'INFO',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-200',
    iconColor: 'text-sky-400',
    titleColor: 'text-sky-300',
  },
  tip: {
    icon: Lightbulb,
    badge: 'PRO TIP',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-200',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-300',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'WARNING',
    border: 'border-amber-500/35',
    bg: 'bg-amber-500/10',
    text: 'text-amber-200',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
  },
  important: {
    icon: Bookmark,
    badge: 'IMPORTANT',
    border: 'border-purple-500/35',
    bg: 'bg-purple-500/10',
    text: 'text-purple-200',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
  example: {
    icon: FlaskConical,
    badge: 'EXAMPLE',
    border: 'border-indigo-500/35',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-200',
    iconColor: 'text-indigo-400',
    titleColor: 'text-indigo-300',
  },
};

export function LessonCallout({ type, title, tokens, children }: LessonCalloutProps) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`my-5 p-4 sm:p-5 rounded-xl border ${config.border} ${config.bg} shadow-md space-y-2`}
      role="region"
      aria-label={title || config.badge}
    >
      <div className="flex items-center space-x-2.5">
        <div className={`p-1.5 rounded-lg bg-slate-950/60 ${config.iconColor} border border-slate-800`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
          {title || config.badge}
        </span>
      </div>

      <div className={`text-sm leading-relaxed ${config.text} pl-1`}>
        {tokens ? <InlineTokensRenderer tokens={tokens} /> : children}
      </div>
    </div>
  );
}
