'use me';
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
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Review modal state
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statusArg = filterStatus === 'ALL' ? undefined : (filterStatus as SubmissionStatus);
      const data = await submissionsApi.getAllForAdmin(statusArg);
      setSubmissions(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchSubmissions();
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
      fetchSubmissions();
    } catch (err: unknown) {
      setReviewError((err as Error).message || 'Failed to review submission.');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="APPROVED" className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="REJECTED" className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="PENDING" className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Review Submissions</h1>
          <p className="text-slate-600 text-sm mt-1">
            Review student code submissions, provide feedback, and approve or reject solutions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4 bg-white shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <span className="text-sm font-medium text-slate-700 mr-2 shrink-0">Filter by status:</span>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Submissions' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submissions List */}
      <Card className="shadow-sm border border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-base font-semibold text-slate-800">
            Submissions ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              title="No submissions found"
              description={
                filterStatus === 'ALL'
                  ? 'No student submissions have been recorded yet.'
                  : `No submissions with status "${filterStatus.toLowerCase()}".`
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Exercise</th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {sub.user?.name ? sub.user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{sub.user?.name || 'Student'}</p>
                            <p className="text-xs text-slate-500">{sub.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {sub.exercise?.title || 'Exercise'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {sub.fileName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(sub.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenReview(sub)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
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
      >
        {selectedSubmission && (
          <div className="space-y-5">
            {/* Student & Exercise Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-medium text-slate-500 block uppercase">Student</span>
                <p className="font-semibold text-slate-900 text-sm">{selectedSubmission.user?.name}</p>
                <p className="text-xs text-slate-600">{selectedSubmission.user?.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block uppercase">Exercise</span>
                <p className="font-semibold text-slate-900 text-sm">{selectedSubmission.exercise?.title}</p>
                <p className="text-xs text-slate-500">Current Status: <span className="font-semibold">{selectedSubmission.status}</span></p>
              </div>
            </div>

            {/* Submission File */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Submitted File
              </label>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-indigo-700">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  {selectedSubmission.fileName}
                </div>
                {selectedSubmission.fileUrl && (
                  <a
                    href={selectedSubmission.signedUrl || selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View File <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Student Note */}
            {selectedSubmission.note && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Student Note
                </label>
                <p className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                  {selectedSubmission.note}
                </p>
              </div>
            )}

            {/* Admin Note / Feedback Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Admin Feedback / Note
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter review feedback for the student..."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Review Error */}
            {reviewError && (
              <p className="text-xs text-red-600 font-medium">{reviewError}</p>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
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
                disabled={reviewing}
                className="flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleReview('APPROVED')}
                disabled={reviewing}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
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
