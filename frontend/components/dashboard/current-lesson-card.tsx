'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CurrentLessonCardProps {
  currentDay?: {
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    exerciseCount: number;
  } | null;
}

export function CurrentLessonCard({ currentDay }: CurrentLessonCardProps) {
  const dayNumber = currentDay ? String(currentDay.dayNumber).padStart(2, '0') : '01';
  const title = currentDay
    ? `Day ${dayNumber} — ${currentDay.title}`
    : 'Day 01 — Values, Types & Operators';
  const description = currentDay
    ? currentDay.description
    : 'Build a strong JavaScript foundation with primitive values, types, coercion, and operators.';
  const exerciseCount = currentDay?.exerciseCount ?? 5;

  return (
    <Card className="relative overflow-hidden border-indigo-500/30 bg-slate-900/90 shadow-xl flex flex-col justify-between group">
      {/* Background Image Illustration with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-right opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('/assets/images/javascript-study.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/40 pointer-events-none" />

      <CardContent className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-400">
              CURRENT LESSON FOCUS
            </span>
          </div>

          {/* JavaScript Logo Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
            <img
              src="/assets/logos/javascript-logo.svg"
              alt="JavaScript Logo"
              className="w-4 h-4 object-contain"
            />
            <span className="text-[10px] font-mono font-bold text-amber-400">JS CORE</span>
          </div>
        </div>

        {/* Lesson Details */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom CTA Area */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
          {currentDay ? (
            <Link href={`/roadmap/${currentDay.id}`}>
              <Button
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          ) : (
            <Link href="/roadmap">
              <Button
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Explore Roadmap</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>{exerciseCount} exercises to complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
