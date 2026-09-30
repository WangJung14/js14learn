'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Code2, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <div className="w-full max-w-md mx-auto my-auto space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 text-white">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-100 to-indigo-300 bg-clip-text text-transparent">
              JS Study Hub
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-100 pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to access your study roadmap and group exercises</p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="tommy@jsstudyhub.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full py-3 text-sm font-semibold">
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Seed Account Credentials Shortcut Banner for Demo Testing */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quick Test Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setEmail('tommy@jsstudyhub.local');
                  setPassword('student123');
                }}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-left transition-colors text-slate-300"
              >
                <span className="text-indigo-400 block font-sans text-[10px] font-bold">Student Account</span>
                tommy@jsstudyhub.local
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@jsstudyhub.local');
                  setPassword('admin123');
                }}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-lg text-left transition-colors text-slate-300"
              >
                <span className="text-rose-400 block font-sans text-[10px] font-bold">Admin Account</span>
                admin@jsstudyhub.local
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
