'use client';

import React, { useMemo, useState } from 'react';
import { Clock, BookOpen, Layers } from 'lucide-react';
import { LessonToc } from './lesson-toc';
import {
  StudyMarkdownRenderer,
  buildStudyDocument,
  StudyDocument,
} from './study-markdown-renderer';
import { ParsedLesson } from '@/lib/markdown-parser';

interface LessonContentRendererProps {
  content?: string;
  parsedData?: ParsedLesson;
  title?: string;
  dayNumber?: number;
  showTocSidebar?: boolean;
}

export const LessonContentRenderer = React.memo(function LessonContentRenderer({
  content = '',
  parsedData,
  title,
  dayNumber,
  showTocSidebar = true,
}: LessonContentRendererProps) {
  // Build StudyDocument once from MDAST AST
  const doc = useMemo<StudyDocument>(() => {
    return buildStudyDocument(content);
  }, [content]);

  // Flatten all heading IDs for scroll spy observation
  const allHeadingIds = useMemo(() => {
    const ids: string[] = [];
    for (const item of doc.toc) {
      ids.push(item.id);
      if (item.children) {
        for (const child of item.children) {
          ids.push(child.id);
        }
      }
    }
    return ids;
  }, [doc.toc]);

  const [activeSectionId, setActiveSectionId] = useState<string>(
    doc.toc[0]?.id || ''
  );

  // Scroll Spy to highlight current TOC heading
  React.useEffect(() => {
    if (typeof window === 'undefined' || allHeadingIds.length === 0) return;

    const handleScroll = () => {
      const headingElements = allHeadingIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allHeadingIds]);

  const displayTitle = title || parsedData?.title || doc.title;
  const estimatedMinutes = parsedData?.estimatedMinutes || doc.estimatedMinutes;
  const topicsCount = allHeadingIds.length;

  return (
    <div className="space-y-6">
      {/* Overview Metadata Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              {dayNumber !== undefined ? `DAY ${String(dayNumber).padStart(2, '0')}: ` : ''}
              {displayTitle || 'Course Lesson Document'}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{estimatedMinutes} min read</span>
              </span>
              {topicsCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{topicsCount} topics</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Markdown Document Stream + Sticky Table of Contents Sidebar */}
      <div
        className={`grid grid-cols-1 ${
          showTocSidebar && doc.toc.length > 0 ? 'xl:grid-cols-12 gap-8' : ''
        } items-start`}
      >
        {/* Main Document Stream */}
        <div
          className={
            showTocSidebar && doc.toc.length > 0
              ? 'xl:col-span-9'
              : 'w-full'
          }
        >
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/85 backdrop-blur-md p-6 sm:p-10 lg:p-12 shadow-2xl">
            <StudyMarkdownRenderer doc={doc} />
          </div>
        </div>

        {/* Sticky Table of Contents Sidebar */}
        {showTocSidebar && doc.toc.length > 0 && (
          <aside className="hidden xl:block xl:col-span-3 sticky top-24">
            <LessonToc
              items={doc.toc}
              activeId={activeSectionId}
              onSelectSection={(id: string) => {
                setActiveSectionId(id);
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
});
