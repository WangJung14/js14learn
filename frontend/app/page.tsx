import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium">
          JS Study Hub — Collaborative Learning Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Master JavaScript Together
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto">
          Track progress, tackle daily exercises, upload solutions, and stay accountable with your study group.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-600/20"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
