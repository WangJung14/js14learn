'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Award } from 'lucide-react';

interface OverallCompletionCardProps {
  progress?: {
    percentage: number;
    completedDays: number;
    totalDays: number;
    completedExercises: number;
    totalExercises: number;
  };
}

export function OverallCompletionCard({ progress }: OverallCompletionCardProps) {
  const percentage = progress?.percentage ?? 0;
  const completedDays = progress?.completedDays ?? 0;
  const totalDays = progress?.totalDays ?? 14;
  const completedExercises = progress?.completedExercises ?? 0;
  const totalExercises = progress?.totalExercises ?? 70;

  // SVG Circular Progress calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="relative overflow-hidden border-indigo-500/30 bg-slate-950 shadow-xl flex flex-col justify-between group h-full">
      {/* Background Image Overlay (overall-completion.jpg) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        style={{ backgroundImage: `url('/assets/images/overall-completion.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80 pointer-events-none" />

      <CardHeader className="relative z-10 pb-2 border-b border-slate-800/80 backdrop-blur-sm">
        <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
          <span>Overall Completion</span>
          <Award className="w-5 h-5 text-indigo-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 p-6 space-y-6 flex flex-col justify-between flex-1">
        {/* Circular SVG Ring & Percentage Display */}
        <div className="flex flex-col items-center justify-center py-2 relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Track Background */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-800/80"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-gradient transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#progress-gradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Percentage Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent drop-shadow">
                {percentage}%
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Completed</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-300 mt-2 font-mono">Roadmap Completion</p>
        </div>

        {/* Linear Progress Bar */}
        <ProgressBar value={percentage} />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
            <p className="text-base font-extrabold text-slate-100 font-mono">
              {completedDays} / {totalDays}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Completed Days
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
            <p className="text-base font-extrabold text-slate-100 font-mono">
              {completedExercises} / {totalExercises}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Approved Exercises
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
