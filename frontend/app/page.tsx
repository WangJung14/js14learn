import Link from 'next/link';
import { Code2, Map, Users, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              JS Study Hub
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Collaborative Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-100">
            Learn JavaScript Together with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Real Accountability
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Follow a structured 14-day study roadmap, solve daily exercises, upload your solutions, and keep track of your team&apos;s real-time progress.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="px-8 shadow-xl shadow-indigo-600/25">
                Join Study Group <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="px-8">
                Member Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 text-left">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-indigo-500/50 transition-colors group">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Structured 14-Day Roadmap</h3>
            <p className="text-sm text-slate-400">
              From values and types to Async/Await and ES6+ classes, progress sequentially day by day.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-emerald-500/50 transition-colors group">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Daily Exercises & Solutions</h3>
            <p className="text-sm text-slate-400">
              Submit code solutions in JS, TS, or ZIP format for admin review and instant feedback.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-purple-500/50 transition-colors group">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Group Progress Visibility</h3>
            <p className="text-sm text-slate-400">
              See member progress, completed days, streak metrics, and real-time activity logs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>JS Study Hub — Production-Ready MVP Architecture</span>
          </div>
          <p>© {new Date().getFullYear()} JS Study Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
