'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Send,
  Eye,
  ShieldAlert,
  RefreshCw,
  Map,
  BookOpen,
  Code2,
  CheckSquare,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { roadmapApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';

interface ValidationIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  code: string;
  message: string;
  studyDayId?: string;
  studyDayNumber?: number;
  exerciseId?: string;
  checklistItemId?: string;
}

interface ValidationResult {
  valid: boolean;
  summary: {
    errors: number;
    warnings: number;
    infos: number;
    studyDays: number;
    exercises: number;
    checklistItems: number;
    codingExercises: number;
  };
  issues: ValidationIssue[];
}

export default function AdminRoadmapValidationPage() {
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadStatusAndValidate = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusData = await roadmapApi.getStatus();
      setStatus(statusData.status);
      setPublishedAt(statusData.publishedAt || null);

      const valData = await roadmapApi.validate();
      setValidationResult(valData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load roadmap status or validation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStatusAndValidate();
  }, []);

  const handleRunValidation = async () => {
    setValidating(true);
    setError(null);
    try {
      const valData = await roadmapApi.validate();
      setValidationResult(valData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to validate roadmap.');
    } finally {
      setValidating(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const result = await roadmapApi.publish();
      setStatus(result.status);
      setPublishedAt(result.publishedAt);
      if (result.validationResult) {
        setValidationResult(result.validationResult as ValidationResult);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to publish roadmap.');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish the roadmap?\nStudents will not be able to view unpublished content until re-published.')) {
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const result = await roadmapApi.unpublish();
      setStatus(result.status);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to unpublish roadmap.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const issues = validationResult?.issues || [];
  const filteredIssues = issues.filter((i) => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  const hasErrors = (validationResult?.summary.errors || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-400" />
            Roadmap Validation &amp; Publishing
          </h2>
          <p className="text-xs text-slate-400">
            Validate curriculum integrity, check for missing links or test cases, and manage student publishing status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => void handleRunValidation()}
            variant="outline"
            size="sm"
            isLoading={validating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-Validate
          </Button>

          <Button
            onClick={() => setIsPreviewOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Student Preview
          </Button>

          {status === 'PUBLISHED' ? (
            <Button
              onClick={() => void handleUnpublish()}
              variant="danger"
              size="sm"
              isLoading={publishing}
              className="text-xs"
            >
              Unpublish Roadmap
            </Button>
          ) : (
            <Button
              onClick={() => void handlePublish()}
              variant="primary"
              size="sm"
              isLoading={publishing}
              disabled={hasErrors || validating}
              title={hasErrors ? 'Fix blocking errors before publishing' : 'Publish roadmap'}
              className="text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Publish Roadmap
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Roadmap Status Overview Card */}
      <Card className={`p-6 border ${status === 'PUBLISHED' ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-amber-500/30 bg-amber-950/10'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {status === 'PUBLISHED' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-100">
                  Current Status: {status}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {status === 'PUBLISHED'
                  ? `Published to students on ${publishedAt ? new Date(publishedAt).toLocaleString() : 'N/A'}`
                  : 'Roadmap is currently in DRAFT mode. Students cannot view unpublished content.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {validationResult?.valid ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> 0 Blocking Errors — Ready to Publish
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <ShieldAlert className="w-4 h-4 mr-1.5" /> {validationResult?.summary.errors || 0} Blocking Errors Detected
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Validation Summary Metrics */}
      {validationResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Card className="p-3 text-center border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Study Days</p>
            <p className="text-xl font-black text-slate-100 mt-0.5">{validationResult.summary.studyDays}</p>
          </Card>
          <Card className="p-3 text-center border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Exercises</p>
            <p className="text-xl font-black text-slate-100 mt-0.5">{validationResult.summary.exercises}</p>
          </Card>
          <Card className="p-3 text-center border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Coding Challenges</p>
            <p className="text-xl font-black text-indigo-400 mt-0.5">{validationResult.summary.codingExercises}</p>
          </Card>
          <Card className="p-3 text-center border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Checklist Items</p>
            <p className="text-xl font-black text-slate-100 mt-0.5">{validationResult.summary.checklistItems}</p>
          </Card>
          <Card className="p-3 text-center border-rose-500/30 bg-rose-950/10">
            <p className="text-[10px] uppercase font-semibold text-rose-400">Errors (Blocking)</p>
            <p className="text-xl font-black text-rose-400 mt-0.5">{validationResult.summary.errors}</p>
          </Card>
          <Card className="p-3 text-center border-amber-500/30 bg-amber-950/10">
            <p className="text-[10px] uppercase font-semibold text-amber-400">Warnings</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">{validationResult.summary.warnings}</p>
          </Card>
          <Card className="p-3 text-center border-blue-500/30 bg-blue-950/10">
            <p className="text-[10px] uppercase font-semibold text-blue-400">Info</p>
            <p className="text-xl font-black text-blue-400 mt-0.5">{validationResult.summary.infos}</p>
          </Card>
        </div>
      )}

      {/* Issues List & Filter Tabs */}
      <Card className="p-0 overflow-hidden border border-slate-800">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            Validation Findings &amp; Audit Log ({filteredIssues.length})
          </h3>

          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${filterSeverity === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilterSeverity('ERROR')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${filterSeverity === 'ERROR' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Errors ({validationResult?.summary.errors || 0})
            </button>
            <button
              onClick={() => setFilterSeverity('WARNING')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${filterSeverity === 'WARNING' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Warnings ({validationResult?.summary.warnings || 0})
            </button>
            <button
              onClick={() => setFilterSeverity('INFO')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${filterSeverity === 'INFO' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Info ({validationResult?.summary.infos || 0})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No issues found for the selected filter.
            </div>
          ) : (
            filteredIssues.map((issue, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-900/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {issue.severity === 'ERROR' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {issue.severity === 'WARNING' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {issue.severity === 'INFO' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Info className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-200">{issue.code}</span>
                      {issue.studyDayNumber && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-indigo-400 border border-slate-700">
                          Day {issue.studyDayNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{issue.message}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {issue.exerciseId && (
                    <Link href="/admin/exercises">
                      <Button variant="outline" size="sm" className="text-[11px] px-2.5 py-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                        <Code2 className="w-3 h-3 mr-1" /> Fix Exercise
                      </Button>
                    </Link>
                  )}
                  {issue.checklistItemId && (
                    <Link href="/admin/checklists">
                      <Button variant="outline" size="sm" className="text-[11px] px-2.5 py-1 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
                        <CheckSquare className="w-3 h-3 mr-1" /> Fix Checklist
                      </Button>
                    </Link>
                  )}
                  {issue.studyDayId && !issue.exerciseId && !issue.checklistItemId && (
                    <Link href="/admin/study-days">
                      <Button variant="outline" size="sm" className="text-[11px] px-2.5 py-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                        <BookOpen className="w-3 h-3 mr-1" /> Fix Study Day
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Read-Only Student Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Admin Read-Only Student Roadmap Preview"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
            ⚡ <strong>Admin Student View Preview:</strong> This read-only preview demonstrates how students navigate the curriculum, view exercises, and inspect checklists. Submissions and progress actions are disabled in preview mode.
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center justify-between">
              <span>Roadmap Curriculum View</span>
              <span className="text-xs text-slate-400 font-mono">
                {validationResult?.summary.studyDays || 0} Days • {validationResult?.summary.exercises || 0} Exercises
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Students view study days unlocked sequentially based on checklist item completions.
            </p>
            <div className="pt-2">
              <Link href="/roadmap" target="_blank">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Open Live Student Roadmap View <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
