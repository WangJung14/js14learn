'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Coffee, ArrowRight, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { JAVA_ROADMAP_DAYS, JAVA_ROADMAP_META, JAVA_ROADMAP_PHASES } from '@/lib/roadmaps/java-roadmap-data';
import { useJavaRoadmapProgress } from '@/lib/roadmaps/use-roadmap-progress';

export function JavaRoadmapView() {
  const { summary, getDayProgress } = useJavaRoadmapProgress();
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('all');

  const filteredDays = selectedPhaseId === 'all'
    ? JAVA_ROADMAP_DAYS
    : JAVA_ROADMAP_DAYS.filter((d) => d.phaseId === selectedPhaseId);

  return (
    <div className="space-y-8">
      {/* Java Track Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Coffee className="w-4 h-4" />
          <span>Java Backend Track</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-3">
              {JAVA_ROADMAP_META.title}
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {JAVA_ROADMAP_META.badge}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {JAVA_ROADMAP_META.description}
            </p>
          </div>
        </div>
      </div>

      {/* Java Track Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border-indigo-500/30 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left w-full lg:w-auto">
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Curriculum Mastery Progress</span>
            </div>
            <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-3">
              <span className="text-3xl font-extrabold text-slate-100 font-mono">
                {summary.completedDays} / {summary.totalDays}
              </span>
              <span className="text-sm text-slate-400 font-medium">
                Days Completed ({summary.completedSubtopics} of {summary.totalSubtopics} Subtopics)
              </span>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Overall Completion</span>
              <span className="font-mono font-bold text-indigo-300">{summary.percentage}%</span>
            </div>
            <ProgressBar value={summary.percentage} showLabel={false} />
          </div>
        </div>
      </Card>

      {/* Phase Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <button
          type="button"
          onClick={() => setSelectedPhaseId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedPhaseId === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All 30 Days (7 Phases)
        </button>
        {JAVA_ROADMAP_PHASES.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => setSelectedPhaseId(phase.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedPhaseId === phase.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {phase.title.split(':')[0]} (Day {phase.startDay} - {phase.endDay})
          </button>
        ))}
      </div>

      {/* Java 30-Day Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-800/80">
        {filteredDays.map((day) => {
          const dayProgress = getDayProgress(day);
          const isCompleted = dayProgress.isCompleted;
          const isInProgress = dayProgress.isInProgress;
          const statusVariant = isCompleted ? 'COMPLETED' : isInProgress ? 'IN_PROGRESS' : 'LOCKED';

          return (
            <Link key={day.id} href={`/roadmap/java/${day.id}`} className="block group">
              <Card
                className={`transition-all duration-200 hover:border-indigo-500/60 relative ${
                  isInProgress
                    ? 'border-indigo-500/50 bg-indigo-950/10 shadow-lg shadow-indigo-600/10'
                    : isCompleted
                      ? 'border-emerald-500/30 bg-slate-900/90'
                      : 'border-slate-800/80 bg-slate-950/60 opacity-90'
                }`}
              >
                <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start space-x-4">
                    {/* Status Icon Indicator */}
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 mt-1 sm:mt-0 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isInProgress
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          DAY {String(day.dayNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                          {day.phaseTitle.split(':')[0]}
                        </span>
                        <Badge variant={statusVariant} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {day.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{day.description}</p>

                      {/* Level 2 Topics preview tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {day.topics.map((t) => (
                          <span
                            key={t.id}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-800"
                          >
                            {t.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
                    <div className="text-left lg:text-right space-y-1">
                      <div className="text-xs text-slate-400 font-medium">
                        {dayProgress.completedCount} / {dayProgress.totalCount} Subtopics
                      </div>
                      <div className="w-28">
                        <ProgressBar value={dayProgress.percentage} showLabel={false} />
                      </div>
                    </div>

                    <div className="p-2 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-600/10 transition-colors flex-shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
