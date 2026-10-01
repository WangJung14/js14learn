'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface HeroBannerProps {
  user?: User | null;
}

export function HeroBanner({ user }: HeroBannerProps) {
  const userName = user?.name || 'Quang Trung';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-950 p-6 sm:p-8 shadow-2xl">
      {/* Background Image with Crisp Visibility */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transition-transform duration-700 hover:scale-100"
        style={{ backgroundImage: `url('/assets/images/dashboard-hero.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

      {/* Decorative Light Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Content Area */}
      <div className="relative z-10 max-w-2xl space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Better code • Brighter future</span>
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-indigo-400/90">
            LEARN • PRACTICE • GROW
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Hello, {userName} <span className="inline-block animate-bounce">👋</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
          Keep pushing forward with your JavaScript study group. Master concepts, solve challenges, and elevate your software engineering skills.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex items-center space-x-4">
          <Link href="/roadmap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
