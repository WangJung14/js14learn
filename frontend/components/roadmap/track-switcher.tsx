'use client';

import React from 'react';
import { Coffee, Code2, Sparkles } from 'lucide-react';
import { RoadmapTrackId } from '@/lib/roadmaps/types';

interface TrackSwitcherProps {
  activeTrack: RoadmapTrackId;
  onTrackChange: (track: RoadmapTrackId) => void;
  jsProgressPercentage?: number;
  javaProgressPercentage?: number;
}

export function TrackSwitcher({
  activeTrack,
  onTrackChange,
}: TrackSwitcherProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
      <div className="flex items-center p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
        {/* JavaScript Track Button */}
        <button
          type="button"
          onClick={() => onTrackChange('javascript')}
          className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTrack === 'javascript'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              activeTrack === 'javascript' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Code2 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span>JavaScript Track</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                14 Days
              </span>
            </div>
          </div>
        </button>

        {/* Java Core Track Button */}
        <button
          type="button"
          onClick={() => onTrackChange('java')}
          className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeTrack === 'java'
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <div
            className={`p-1.5 rounded-md ${
              activeTrack === 'java' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Coffee className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span>Java Core Track</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                30 Days
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Active Track Status Indicator */}
      <div className="flex items-center justify-between sm:justify-end space-x-3 px-3 py-1">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Track:</span>
          <span className="font-semibold text-slate-200">
            {activeTrack === 'java' ? 'Java Core Backend (30 Days)' : 'JavaScript Fundamentals (14 Days)'}
          </span>
        </div>
      </div>
    </div>
  );
}
