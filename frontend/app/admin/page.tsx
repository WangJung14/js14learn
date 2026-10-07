'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Map,
  Code2,
  FileCheck,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { usersApi, studyDaysApi, submissionsApi } from '@/lib/api';
import { Submission, User, StudyDay } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [usersData, daysData, subsData] = await Promise.all([
          usersApi.getAllUsers(),
          studyDaysApi.getAll(),
          submissionsApi.getAllForAdmin(),
        ]);
        setUsers(usersData);
        setStudyDays(daysData);
        setSubmissions(subsData);
      } catch {
        // silent fallback
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const studentCount = users.filter((u) => u.role === 'STUDENT').length;
  const pendingCount = submissions.filter((s) => s.status === 'PENDING').length;
  const approvedCount = submissions.filter((s) => s.status === 'APPROVED').length;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4 border-rose-500/20">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Students</p>
            <p className="text-2xl font-black text-slate-100">{studentCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-amber-500/20">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Pending Reviews</p>
            <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-indigo-500/20">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Curriculum Days</p>
            <p className="text-2xl font-black text-slate-100">{studyDays.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-emerald-500/20">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Approved Submissions</p>
            <p className="text-2xl font-black text-emerald-400">{approvedCount}</p>
          </div>
        </Card>
      </div>

      {/* Quick Admin Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-rose-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg w-fit">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">Review Submissions</h3>
            <p className="text-xs text-slate-400">Review student code solution uploads and provide feedback.</p>
          </div>
          <Link href="/admin/submissions">
            <Button variant="danger" size="sm" className="w-full">
              Review ({pendingCount}) <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">Manage Roadmap</h3>
            <p className="text-xs text-slate-400">Create, edit, or reorder the 14-day learning curriculum.</p>
          </div>
          <Link href="/admin/study-days">
            <Button variant="outline" size="sm" className="w-full">
              Manage Days <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">Java Curriculum Docs</h3>
            <p className="text-xs text-slate-400">Biên soạn và quản lý tài liệu lý thuyết 30 ngày Java Core (Level 1 → 2 → 3).</p>
          </div>
          <Link href="/admin/java-roadmap">
            <Button variant="outline" size="sm" className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
              Biên Soạn Tài Liệu <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg w-fit">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">Manage Exercises</h3>
            <p className="text-xs text-slate-400">Add or edit code challenge tasks and difficulty levels.</p>
          </div>
          <Link href="/admin/exercises">
            <Button variant="outline" size="sm" className="w-full">
              Manage Exercises <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">User Management</h3>
            <p className="text-xs text-slate-400">Inspect registered student accounts and update user roles.</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="w-full">
              Manage Users <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="space-y-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg w-fit">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100">Roadmap Validation</h3>
            <p className="text-xs text-slate-400">Validate curriculum integrity and publish/unpublish roadmap.</p>
          </div>
          <Link href="/admin/roadmap">
            <Button variant="outline" size="sm" className="w-full">
              Validate &amp; Publish <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
