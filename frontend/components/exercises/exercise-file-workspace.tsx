'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileUp, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { submissionsApi } from '@/lib/api';

interface ExerciseFileWorkspaceProps {
  exerciseId: string;
  onSubmissionSuccess: () => Promise<void>;
}

export function ExerciseFileWorkspace({
  exerciseId,
  onSubmissionSuccess,
}: ExerciseFileWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected file size exceeds the 10 MB maximum limit.');
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedFile) {
      setError('Please select or drop a solution file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      await submissionsApi.submit({
        exerciseId,
        file: selectedFile,
        note: note.trim() || undefined,
      });

      setSuccess('Solution uploaded successfully! Awaiting instructor evaluation.');
      setSelectedFile(null);
      setNote('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await onSubmissionSuccess();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to upload solution.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-indigo-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-2.5 border-b border-slate-800/80 pb-4 bg-slate-950/40">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Upload className="w-4 h-4" />
        </div>
        <div>
          <CardTitle className="text-base font-bold text-slate-100">
            Submit Your Solution
          </CardTitle>
          <p className="text-[11px] text-slate-400">
            Upload your source file, archive, or documentation
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-400 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.ts,.zip,.pdf,.png"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileUp className="w-5 h-5" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-300 font-mono flex items-center justify-center space-x-1">
                  <span>{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-400">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB (Click or drop to replace)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  <span className="text-indigo-400 font-semibold underline underline-offset-2">Click to browse</span> or drag and drop file here
                </p>
                <p className="text-[11px] text-slate-400">
                  Accepted: <span className="font-mono text-slate-400">.js, .ts, .zip, .pdf, .png</span> (Max 10 MB)
                </p>
              </div>
            )}
          </div>

          {/* Submission Note */}
          <Textarea
            id="submission-note"
            label="Submission Note (Optional)"
            placeholder="Explain your approach, assumptions, or any questions for the instructor..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="text-xs"
          />

          <Button
            type="submit"
            isLoading={submitting}
            disabled={!selectedFile || submitting}
            className="w-full py-2.5 text-xs font-semibold"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload &amp; Submit Solution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
