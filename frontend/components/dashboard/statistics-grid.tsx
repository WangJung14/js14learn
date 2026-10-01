'use client';

import React from 'react';
import { Map, CheckCircle2, FileCode, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatisticsGridProps {
  statistics?: {
    completedDays: number;
    totalDays: number;
    completedExercises: number;
    totalExercises: number;
    totalSubmissions: number;
    streakDays: number;
  };
}

export function StatisticsGrid({ statistics }: StatisticsGridProps) {
  const completedDays = statistics?.completedDays ?? 0;
  const totalDays = statistics?.totalDays ?? 14;
  const completedExercises = statistics?.completedExercises ?? 0;
  const totalExercises = statistics?.totalExercises ?? 70;
  const totalSubmissions = statistics?.totalSubmissions ?? 1;
  const streakDays = statistics?.streakDays ?? 1;

  const statCards = [
    {
      title: 'Completed Days',
      value: `${completedDays} / ${totalDays}`,
      icon: Map,
      accentBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      borderColor: 'hover:border-indigo-500/50',
    },
    {
      title: 'Approved Exercises',
      value: `${completedExercises} / ${totalExercises}`,
      icon: CheckCircle2,
      accentBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      title: 'Total Submissions',
      value: `${totalSubmissions}`,
      icon: FileCode,
      accentBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      borderColor: 'hover:border-purple-500/50',
    },
    {
      title: 'Current Streak',
      value: `${streakDays} Days`,
      icon: Flame,
      accentBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      borderColor: 'hover:border-amber-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className={`p-4 flex items-center space-x-4 border-slate-800 bg-slate-900/80 transition-all hover:scale-[1.02] shadow-lg ${card.borderColor}`}
          >
            <div className={`p-3.5 rounded-xl border ${card.accentBg} flex-shrink-0`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 font-medium truncate">{card.title}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-tight pt-0.5 truncate">
                {card.value}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
