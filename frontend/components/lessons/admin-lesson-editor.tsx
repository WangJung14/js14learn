'use client';

import React, { useState, useRef, useEffect, useCallback, useTransition, useMemo } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Link2,
  Terminal,
  Lightbulb,
  AlertTriangle,
  Bookmark,
  FlaskConical,
  Table as TableIcon,
  Quote,
  Minus,
  Save,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Columns,
  RefreshCw,
  Zap,
  ZapOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonContentRenderer } from './lesson-content-renderer';
import { useMarkdownParser } from '@/lib/use-markdown-parser';

interface AdminLessonEditorProps {
  initialContent: string;
  lessonTitle?: string;
  dayNumber?: number;
  onSave: (content: string) => Promise<void>;
  isSaving?: boolean;
}

export function AdminLessonEditor({
  initialContent,
  lessonTitle = 'Lesson Content',
  dayNumber,
  onSave,
  isSaving = false,
}: AdminLessonEditorProps) {
  // 1. RAW EDITOR STATE: Immediate, 0ms input latency, never blocked by preview
  const [content, setContent] = useState<string>(initialContent || '');
  const [isDirty, setIsDirty] = useState(false);

  // Fast O(N) line counter without array allocation
  const lineCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < content.length; i++) {
      if (content.charCodeAt(i) === 10) count++;
    }
    return count;
  }, [content]);

  // Performance Tiers: Default Mode & Auto-Preview Strategy
  const initialMode = useMemo<'editor' | 'split' | 'preview'>(() => {
    if (lineCount >= 3000) return 'editor'; // Tier Large/Very Large: Focus on editing first
    return 'split';
  }, [lineCount]);

  // 2. VIEW MODE: 'editor' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>(initialMode);

  // 3. AUTO PREVIEW TOGGLE: Auto-off for very large documents (>10k lines) to protect Main Thread
  const [autoPreview, setAutoPreview] = useState<boolean>(() => lineCount < 10000);

  // 4. PREVIEW STATE: Isolated from high-frequency typing
  const [previewContent, setPreviewContent] = useState<string>(initialContent || '');
  const [, startTransition] = useTransition();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Background Web Worker Parser hook for non-blocking AST generation
  const { parsed: parsedAst, isParsing } = useMarkdownParser(previewContent);

  // Synchronize initialContent on load
  useEffect(() => {
    setContent(initialContent || '');
    setPreviewContent(initialContent || '');
    setIsDirty(false);
  }, [initialContent]);

  // Debounced preview scheduler: 400ms pause before triggering background parse
  const schedulePreviewUpdate = useCallback(
    (newContent: string) => {
      if (!autoPreview) return; // Skip automatic parsing if user toggled Auto-Preview off

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        startTransition(() => {
          setPreviewContent(newContent);
        });
      }, 400);
    },
    [autoPreview]
  );

  // Manual Preview Refresh Action
  const handleManualRefreshPreview = () => {
    startTransition(() => {
      setPreviewContent(content);
    });
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle Textarea Change (0ms input latency)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsDirty(true);
    setValidationError(null);
    schedulePreviewUpdate(val);
  };

  // Insert or wrap text in textarea
  const insertText = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setIsDirty(true);
    setValidationError(null);
    schedulePreviewUpdate(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+B -> Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertText('**', '**', 'bold text');
    }
    // Ctrl+I -> Italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertText('*', '*', 'italic text');
    }
    // Ctrl+K -> Link
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertText('[', '](https://example.com)', 'link text');
    }
    // Tab -> 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }
  };

  // Independent Save Flow: always uses latest raw `content`
  const handleSave = async () => {
    if (!content.trim()) {
      setValidationError('Lesson content cannot be empty.');
      return;
    }

    setValidationError(null);
    try {
      await onSave(content);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save content.';
      setValidationError(message);
    }
  };

  // Insert Template Helpers
  const insertCallout = (type: 'tip' | 'warning' | 'important' | 'example' | 'info') => {
    const templates = {
      tip: '> [!TIP] Pro Tip\n> Explain best practices and performance tips here.\n\n',
      warning: '> [!WARNING] Watch Out\n> Common mistakes and anti-patterns to avoid.\n\n',
      important: '> [!IMPORTANT] Core Concept\n> Essential requirement or key rule.\n\n',
      example: '> [!EXAMPLE] Walkthrough\n> Step-by-step practical code example.\n\n',
      info: '> [!NOTE] Key Note\n> Important contextual information.\n\n',
    };
    insertText(templates[type] || templates.info);
  };

  const insertCodeBlock = () => {
    insertText('```javascript\n// Type your code here\n', '\n```\n', 'console.log("Hello, World!");');
  };

  const insertTable = () => {
    insertText(
      '| Feature | Syntax | Status |\n| :--- | :---: | :--- |\n| Core Concept | `code` | **Active** |\n| Example 2 | [Link](https://...) | Planned |\n\n'
    );
  };

  return (
    <div className="space-y-4">
      {/* Tier Warning / Performance Notice for Large Docs */}
      {lineCount >= 3000 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Large Document Detected:</strong> {lineCount.toLocaleString()} lines. Defaulting to Editor Mode for 0ms typing responsiveness.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!autoPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefreshPreview}
                className="text-[11px] h-7 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                <span>Refresh Preview</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Document Stats & Status */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300 font-bold">
            {lineCount.toLocaleString()} lines
          </span>
          <span className="font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300 font-bold">
            {content.length.toLocaleString()} chars
          </span>
          {isDirty && (
            <span className="flex items-center space-x-1.5 text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved Changes</span>
            </span>
          )}
          {isParsing && (
            <span className="flex items-center space-x-1.5 text-indigo-400 text-xs">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Parsing AST in Background Worker...</span>
            </span>
          )}
        </div>

        {/* View Mode Switcher, Auto-Preview & Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Auto Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !autoPreview;
              setAutoPreview(next);
              if (next) schedulePreviewUpdate(content);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              autoPreview
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Auto-Preview: when enabled, preview updates automatically after 400ms pause"
          >
            {autoPreview ? <Zap className="w-3.5 h-3.5 text-emerald-400" /> : <ZapOff className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">Auto Preview: {autoPreview ? 'ON' : 'OFF'}</span>
          </button>

          {/* Manual Refresh Preview Button */}
          {(!autoPreview || viewMode !== 'editor') && (
            <button
              type="button"
              onClick={handleManualRefreshPreview}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Manually Refresh Preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          )}

          {/* View Modes */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'editor'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Editor Only (0ms Latency Focus Mode)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('split');
                if (previewContent !== content) handleManualRefreshPreview();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Side-by-Side Split Mode"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('preview');
                if (previewContent !== content) handleManualRefreshPreview();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                viewMode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Full Preview Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            variant="primary"
            className="flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 font-semibold text-xs px-3.5"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Lesson content saved successfully!</span>
        </div>
      )}

      {/* Toolbar */}
      {viewMode !== 'preview' && (
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-300 shadow-sm">
          {/* Headings */}
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-800">
            <button
              type="button"
              onClick={() => insertText('# ', '', 'Day Title')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Heading 1 (#)"
            >
              <Heading1 className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              type="button"
              onClick={() => insertText('## ', '', 'Major Section')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Heading 2 (## - Collapsible Section)"
            >
              <Heading2 className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              type="button"
              onClick={() => insertText('### ', '', 'Subsection')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Heading 3 (###)"
            >
              <Heading3 className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* Text Formats */}
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-800">
            <button
              type="button"
              onClick={() => insertText('**', '**', 'bold text')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*', 'italic text')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('`', '`', 'code')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('[', '](https://...)', 'link title')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Link (Ctrl+K)"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-800">
            <button
              type="button"
              onClick={() => insertText('- ', '', 'List item')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Bullet List (-)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('1. ', '', 'Numbered item')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Numbered List (1.)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('> ', '', 'Quote text')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Blockquote (>)"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Code & Table */}
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-800">
            <button
              type="button"
              onClick={insertCodeBlock}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-1 text-indigo-300"
              title="Insert Code Block"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[11px]">Code</span>
            </button>
            <button
              type="button"
              onClick={insertTable}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-1 text-slate-300"
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[11px]">Table</span>
            </button>
            <button
              type="button"
              onClick={() => insertText('\n---\n\n')}
              className="p-1.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Educational Callouts */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 hidden xl:inline pr-1">Callouts:</span>
            <button
              type="button"
              onClick={() => insertCallout('tip')}
              className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-colors flex items-center space-x-1"
              title="Pro Tip Callout"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tip</span>
            </button>
            <button
              type="button"
              onClick={() => insertCallout('warning')}
              className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors flex items-center space-x-1"
              title="Warning Callout"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[11px]">Warning</span>
            </button>
            <button
              type="button"
              onClick={() => insertCallout('important')}
              className="px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors flex items-center space-x-1"
              title="Important Callout"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="text-[11px]">Important</span>
            </button>
            <button
              type="button"
              onClick={() => insertCallout('example')}
              className="px-2 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors flex items-center space-x-1"
              title="Example Walkthrough"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="text-[11px]">Example</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout based on View Mode */}
      <div
        className={`grid gap-6 items-start ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane (Unmounted in preview mode for 0 overhead) */}
        {viewMode !== 'preview' && (
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Raw Markdown Editor (0ms Latency)</span>
              </span>
              <span>UTF-8 • Markdown</span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="# Day Title&#10;&#10;Write comprehensive markdown lesson curriculum here..."
              className="w-full min-h-[600px] h-[75vh] p-5 bg-transparent font-mono text-sm sm:text-base text-slate-200 resize-y focus:outline-none focus:ring-1 focus:ring-indigo-500/40 leading-relaxed selection:bg-indigo-500/30"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Pane (Completely unmounted in editor mode for 0 DOM overhead) */}
        {viewMode !== 'editor' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6 overflow-y-auto max-h-[85vh] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Rendered Live Preview</span>
              </span>
              <span className="text-slate-500">
                {parsedAst.sections.length} sections • {parsedAst.estimatedMinutes} min read
              </span>
            </div>
            <LessonContentRenderer
              parsedData={parsedAst}
              title={lessonTitle}
              dayNumber={dayNumber}
              showTocSidebar={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
