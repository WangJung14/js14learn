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
    badge: 'NOTE',
    border: 'border-l-2 border-l-sky-500 border-sky-900/30',
    bg: 'bg-sky-950/15',
    text: 'text-slate-300',
    iconColor: 'text-sky-400',
    titleColor: 'text-sky-300',
  },
  tip: {
    icon: Lightbulb,
    badge: 'PRO TIP',
    border: 'border-l-2 border-l-emerald-500 border-emerald-900/30',
    bg: 'bg-emerald-950/15',
    text: 'text-slate-300',
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-300',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'WARNING',
    border: 'border-l-2 border-l-amber-500 border-amber-900/30',
    bg: 'bg-amber-950/15',
    text: 'text-slate-300',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
  },
  important: {
    icon: Bookmark,
    badge: 'IMPORTANT',
    border: 'border-l-2 border-l-purple-500 border-purple-900/30',
    bg: 'bg-purple-950/15',
    text: 'text-slate-300',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
  example: {
    icon: FlaskConical,
    badge: 'EXAMPLE',
    border: 'border-l-2 border-l-indigo-500 border-indigo-900/30',
    bg: 'bg-indigo-950/15',
    text: 'text-slate-300',
    iconColor: 'text-indigo-400',
    titleColor: 'text-indigo-300',
  },
};

export function LessonCallout({ type, title, tokens, children }: LessonCalloutProps) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`my-6 p-4 sm:p-5 rounded-r-xl rounded-l-sm border ${config.border} ${config.bg} shadow-sm space-y-2`}
      role="region"
      aria-label={title || config.badge}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
        <span className={`text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
          {title || config.badge}
        </span>
      </div>

      <div className={`text-[15px] leading-[1.75] font-normal not-italic ${config.text} pl-0.5 [&>p]:my-2 [&>p]:leading-relaxed [&>p]:not-italic [&>ul]:my-2 [&>ul]:space-y-1.5 [&>ul]:pl-1 [&>ul_li]:not-italic [&>ol]:my-2 [&>ol]:space-y-1.5 [&>ol]:pl-2 [&>ol_li]:not-italic [&_strong]:text-slate-100 [&_strong]:font-bold`}>
        {tokens ? <InlineTokensRenderer tokens={tokens} /> : children}
      </div>
    </div>
  );
}
