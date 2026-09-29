import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back to JS Study Hub</p>
        </div>
        <Link
          href="/"
          className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
        >
          Back Home
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Overall Progress</span>
          <p className="text-3xl font-extrabold text-indigo-400">0%</p>
          <p className="text-xs text-slate-500">Day 1 of 14</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Current Day</span>
          <p className="text-xl font-bold">Day 01 — Values & Types</p>
          <p className="text-xs text-slate-500">Ready to start</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Group Members</span>
          <p className="text-3xl font-extrabold text-emerald-400">1 / 5</p>
          <p className="text-xs text-slate-500">Study Group Active</p>
        </div>
      </div>
    </div>
  );
}
