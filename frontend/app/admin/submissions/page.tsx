'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { submissionsApi } from '@/lib/api';
import { Submission, SubmissionStatus } from '@/types';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter,
  Eye,
  AlertCircle,
  ExternalLink,
  Code2,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Review modal state
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statusArg =
        filterStatus === 'ALL'
          ? undefined
          : (filterStatus as SubmissionStatus);
      const data = await submissionsApi.getAllForAdmin(statusArg);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load student submissions.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    void fetchSubmissions();
  }, [fetchSubmissions]);

  const handleOpenReview = (sub: Submission) => {
    setSelectedSubmission(sub);
    setAdminNote(sub.adminNote || '');
    setReviewError(null);
    setIsReviewModalOpen(true);
  };

  const handleReview = async (newStatus: SubmissionStatus) => {
    if (!selectedSubmission) return;
    try {
      setReviewing(true);
      setReviewError(null);
      await submissionsApi.review(selectedSubmission.id, {
        status: newStatus,
        adminNote: adminNote.trim() ? adminNote.trim() : undefined,
      });
      setIsReviewModalOpen(false);
      setSelectedSubmission(null);
      await fetchSubmissions();
    } catch (err: unknown) {
      setReviewError(
        (err as Error).message || 'Failed to review submission.',
      );
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge
            variant="APPROVED"
            className="flex items-center gap-1 font-mono text-[10px]"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge
            variant="REJECTED"
            className="flex items-center gap-1 font-mono text-[10px]"
          >
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </Badge>
        );
      case 'PENDING':
      default:
        return (
          <Badge
            variant="PENDING"
            className="flex items-center gap-1 font-mono text-[10px]"
          >
            <Clock className="w-3.5 h-3.5" /> Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'N/A';
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return 'N/A';
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.user?.name || '';
    const studentEmail = sub.user?.email || '';
    const exerciseTitle = sub.exercise?.title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exerciseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1 font-mono">
            <FileText className="w-4 h-4" />
            <span>Submission Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Review Submissions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Evaluate student exercise submissions, verify code executions, and provide constructive feedback.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchSubmissions()}
          isLoading={loading}
          className="self-start md:self-auto text-xs border-slate-800 hover:bg-slate-900"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Submissions
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4 bg-slate-900/80 border-slate-800/80 shadow-xl backdrop-blur-md rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {status === 'ALL'
                  ? 'All Submissions'
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error state with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void fetchSubmissions()}
            className="text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-300 self-start sm:self-auto"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Submissions List Table */}
      <Card className="shadow-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-4">
          <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No submissions found"
                description={
                  filterStatus === 'ALL'
                    ? 'No student submissions have been recorded yet.'
                    : `No submissions with status "${filterStatus.toLowerCase()}".`
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-6">Exercise</th>
                    <th className="py-3.5 px-6">Type / Payload</th>
                    <th className="py-3.5 px-6">Submitted Time</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-transparent">
                  {filteredSubmissions.map((sub) => {
                    const isCode =
                      sub.submissionType === 'CODE' || Boolean(sub.code);
                    const avatarUrl =
                      sub.user?.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        sub.user?.name || 'Student',
                      )}`;

                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={sub.user?.name || 'Student'}
                              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-100 truncate">
                                {sub.user?.name || 'Student'}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {sub.user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <p className="text-slate-100 font-semibold truncate max-w-xs">
                            {sub.exercise?.title || 'Exercise Solution'}
                          </p>
                          {sub.exercise?.studyDay && (
                            <span className="text-[10px] text-indigo-400 font-mono">
                              Day {sub.exercise.studyDay.dayNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-xs">
                          {isCode ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 font-mono">
                              <Code2 className="w-3.5 h-3.5" /> JavaScript Code
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono truncate max-w-[180px]">
                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">
                                {sub.fileName || 'Solution File'}
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 text-xs font-mono">
                          {formatDate(sub.submittedAt)}
                        </td>
                        <td className="py-3.5 px-6">
                          {getStatusBadge(sub.status)}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenReview(sub)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Review Student Submission"
        description="Inspect submitted code/file, assess test execution, and record approval status."
      >
        {selectedSubmission && (
          <div className="space-y-5">
            {/* Student & Exercise Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Student
                </span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">
                  {selectedSubmission.user?.name || 'Student'}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedSubmission.user?.email || 'No email'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Exercise
                </span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">
                  {selectedSubmission.exercise?.title || 'Exercise'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 font-mono">Status:</span>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>
            </div>

            {/* Submission Code or File Viewer */}
            {selectedSubmission.submissionType === 'CODE' ||
            selectedSubmission.code ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono">
                    Submitted JavaScript Code
                  </label>
                  {selectedSubmission.executionResult ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Tests Passed
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl max-h-64 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre">
                  {selectedSubmission.code || '// No code content provided'}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono">
                  Submitted File
                </label>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-indigo-400">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">
                      {selectedSubmission.fileName || 'Solution File'}
                    </span>
                  </div>
                  {(selectedSubmission.signedUrl ||
                    selectedSubmission.fileUrl) && (
                    <a
                      href={
                        selectedSubmission.signedUrl ||
                        selectedSubmission.fileUrl ||
                        '#'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-3 shrink-0"
                    >
                      View / Download <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Student Note */}
            {selectedSubmission.note && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono">
                  Student Note
                </label>
                <p className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-slate-800 leading-relaxed">
                  {selectedSubmission.note}
                </p>
              </div>
            )}

            {/* Admin Note / Feedback Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono">
                Review Feedback / Admin Note
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter review feedback for the student..."
                className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Review Error */}
            {reviewError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400">
                {reviewError}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewModalOpen(false)}
                disabled={reviewing}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReview('REJECTED')}
                isLoading={reviewing}
                className="flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleReview('APPROVED')}
                isLoading={reviewing}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
