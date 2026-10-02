'use client';

import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonContentRenderer } from './lesson-content-renderer';

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
  const [content, setContent] = useState<string>(initialContent || '');
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent || '');
    setIsDirty(false);
  }, [initialContent]);

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

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
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
      example: '> [!EXAMPLE] Code Walkthrough\n> Step-by-step code demonstration.\n\n',
      info: '> [!NOTE] Additional Note\n> Supplementary context or information.\n\n',
    };
    insertText('\n' + templates[type]);
  };

  const insertCodeBlock = () => {
    insertText('\n```javascript\n', '\n```\n', '// Write your JavaScript example here\nconst result = true;');
  };

  const insertTable = () => {
    insertText(
      '\n| Feature | Description | Example |\n| :--- | :--- | :--- |\n| String | Primitive text value | `"hello"` |\n| Number | Numeric value | `42` |\n\n',
    );
  };

  return (
    <div className="space-y-4">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Lesson Content Editor</span>
              {isDirty ? (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-amber-400 font-normal">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Unsaved changes</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 font-normal">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Saved</span>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Author rich, structured lesson documentation with live preview</p>
          </div>
        </div>

        {/* View Mode Tabs on Tablet/Mobile + Action Buttons */}
        <div className="flex items-center space-x-3">
          <div className="flex lg:hidden bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </span>
            </button>
          </div>

          <Button
            onClick={handleSave}
            isLoading={isSaving}
            variant="primary"
            className="flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save Lesson</span>
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
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
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
            className="px-2 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors flex items-center space-x-1"
            title="Important Callout"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="text-[11px]">Important</span>
          </button>
          <button
            type="button"
            onClick={() => insertCallout('example')}
            className="px-2 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors flex items-center space-x-1"
            title="Example Walkthrough Callout"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="text-[11px]">Example</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Editor Pane */}
        <div className={`space-y-2 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Markdown Source</span>
            <span>{content.length} characters • {content.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
              setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="# Day 1: Values, Types & Operators&#10;&#10;## Learning Goals&#10;- Goal 1&#10;- Goal 2&#10;&#10;## Core Concepts&#10;..."
            rows={24}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y shadow-inner"
          />
        </div>

        {/* Live Student Preview Pane */}
        <div className={`space-y-2 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span className="flex items-center space-x-1.5 text-indigo-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Live Preview</span>
            </span>
            <span>Exact Student View</span>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-2xl max-h-[640px] overflow-y-auto">
            <LessonContentRenderer
              content={content}
              title={lessonTitle}
              dayNumber={dayNumber}
              showTocSidebar={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
