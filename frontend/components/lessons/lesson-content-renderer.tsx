'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  Clock,
  BookOpen,
  Maximize2,
  Minimize2,
  Hash,
} from 'lucide-react';
import {
  parseLessonContent,
  ContentBlock,
  LessonSection,
} from '@/lib/markdown-parser';
import { InlineTokensRenderer } from './inline-tokens-renderer';
import { LessonCodeBlock } from './lesson-code-block';
import { LessonCallout } from './lesson-callout';
import { LessonToc } from './lesson-toc';

interface LessonContentRendererProps {
  content: string;
  title?: string;
  dayNumber?: number;
  showTocSidebar?: boolean;
}

export function LessonContentRenderer({
  content,
  title,
  dayNumber,
  showTocSidebar = true,
}: LessonContentRendererProps) {
  const parsed = useMemo(() => parseLessonContent(content), [content]);

  // Collapsible state for each H2 section
  // Default: first 2 sections expanded, remaining collapsed
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  useEffect(() => {
    const initialCollapsed: Record<string, boolean> = {};
    parsed.sections.forEach((section, idx) => {
      // First 2 sections are expanded by default
      initialCollapsed[section.id] = idx >= 2;
    });
    setCollapsedSections(initialCollapsed);
    if (parsed.sections.length > 0) {
      setActiveSectionId(parsed.sections[0].id);
    }
  }, [parsed]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAll = () => {
    const updated: Record<string, boolean> = {};
    parsed.sections.forEach((s) => {
      updated[s.id] = false;
    });
    setCollapsedSections(updated);
  };

  const collapseAll = () => {
    const updated: Record<string, boolean> = {};
    parsed.sections.forEach((s) => {
      updated[s.id] = true;
    });
    setCollapsedSections(updated);
  };

  const areAllCollapsed =
    parsed.sections.length > 0 &&
    parsed.sections.every((s) => collapsedSections[s.id]);

  const renderBlock = (block: ContentBlock, blockIdx: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={blockIdx} className="my-3.5 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {block.tokens && <InlineTokensRenderer tokens={block.tokens} />}
          </p>
        );

      case 'heading':
        if (block.level === 3) {
          return (
            <h3
              key={blockIdx}
              id={block.id}
              className="text-base sm:text-lg font-bold text-slate-100 mt-6 mb-2.5 flex items-center space-x-2 group scroll-mt-24"
            >
              <span className="text-indigo-400/60 font-mono text-sm group-hover:text-indigo-400">#</span>
              <span>{block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}</span>
            </h3>
          );
        }
        if (block.level === 4) {
          return (
            <h4
              key={blockIdx}
              id={block.id}
              className="text-sm sm:text-base font-semibold text-slate-200 mt-4 mb-2 scroll-mt-24"
            >
              {block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}
            </h4>
          );
        }
        return null;

      case 'code':
        return (
          <LessonCodeBlock
            key={blockIdx}
            code={block.code || ''}
            language={block.language || 'javascript'}
          />
        );

      case 'callout':
        return (
          <LessonCallout
            key={blockIdx}
            type={block.calloutType || 'info'}
            title={block.calloutTitle}
          >
            {block.blocks?.map((child, cIdx) => renderBlock(child, cIdx))}
          </LessonCallout>
        );

      case 'list':
        if (block.listType === 'number') {
          return (
            <ol key={blockIdx} className="my-4 space-y-2 list-decimal list-inside text-sm sm:text-base text-slate-300 leading-relaxed pl-2">
              {block.items?.map((itemTokens, iIdx) => (
                <li key={iIdx} className="pl-1">
                  <InlineTokensRenderer tokens={itemTokens} />
                </li>
              ))}
            </ol>
          );
        }
        return (
          <ul key={blockIdx} className="my-4 space-y-2 text-sm sm:text-base text-slate-300 leading-relaxed pl-1">
            {block.items?.map((itemTokens, iIdx) => (
              <li key={iIdx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0" />
                <span className="flex-1">
                  <InlineTokensRenderer tokens={itemTokens} />
                </span>
              </li>
            ))}
          </ul>
        );

      case 'table':
        return (
          <div key={blockIdx} className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              {block.headers && block.headers.length > 0 && (
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    {block.headers.map((header, hIdx) => (
                      <th key={hIdx} className="p-3.5">
                        <InlineTokensRenderer tokens={header.tokens} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-800/60">
                {block.rows?.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                    {row.cells.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3.5 text-slate-300">
                        <InlineTokensRenderer tokens={cell.tokens} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'quote':
        return (
          <blockquote
            key={blockIdx}
            className="my-5 border-l-4 border-indigo-500 bg-slate-900/40 pl-4 py-2 text-sm sm:text-base text-slate-300 italic rounded-r-lg"
          >
            {block.blocks?.map((child, cIdx) => renderBlock(child, cIdx))}
          </blockquote>
        );

      case 'divider':
        return <hr key={blockIdx} className="my-6 border-t border-slate-800" />;

      default:
        return null;
    }
  };

  const displayTitle = title || parsed.title || (dayNumber ? `Day ${dayNumber} Lesson` : 'Lesson Content');

  return (
    <div className="space-y-6">
      {/* 1. Lesson Document Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Structured Study Lesson
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>~{parsed.estimatedMinutes} min read</span>
            </div>

            {parsed.sections.length > 1 && (
              <button
                onClick={areAllCollapsed ? expandAll : collapseAll}
                type="button"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all font-medium text-xs border border-slate-700"
              >
                {areAllCollapsed ? (
                  <>
                    <Maximize2 className="w-3 h-3 text-indigo-400" />
                    <span>Expand All</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3 h-3 text-indigo-400" />
                    <span>Collapse All</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {displayTitle}
        </h2>
      </div>

      {/* 2. Main Content Grid (Document + Optional TOC Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Document Body (3 cols on desktop) */}
        <div className={`${showTocSidebar && parsed.toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-5 max-w-[860px]`}>
          {/* Mobile TOC */}
          {parsed.toc.length > 0 && (
            <div className="block lg:hidden">
              <LessonToc
                items={parsed.toc}
                activeId={activeSectionId}
                onSelectSection={(id) => {
                  setActiveSectionId(id);
                  // Auto expand target section if collapsed
                  setCollapsedSections((prev) => ({ ...prev, [id]: false }));
                }}
              />
            </div>
          )}

          {/* Intro Blocks (before first H2) */}
          {parsed.introBlocks.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
              {parsed.introBlocks.map((block, idx) => renderBlock(block, idx))}
            </div>
          )}

          {/* Collapsible Sections (H2) */}
          {parsed.sections.length > 0 ? (
            parsed.sections.map((section: LessonSection) => {
              const isCollapsed = Boolean(collapsedSections[section.id]);
              const sectionId = section.id;

              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg overflow-hidden transition-all scroll-mt-24"
                >
                  {/* Collapsible Section Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSection(sectionId);
                      }
                    }}
                    aria-expanded={!isCollapsed}
                    aria-controls={`section-content-${sectionId}`}
                    className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-950/60 hover:bg-slate-900 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                        <Hash className="w-4 h-4" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate">
                        {section.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono shrink-0">
                      <span className="hidden sm:inline-block">
                        {isCollapsed ? 'Expand' : 'Collapse'}
                      </span>
                      <div className={`p-1 rounded bg-slate-800/80 text-slate-300 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Section Body */}
                  <div
                    id={`section-content-${sectionId}`}
                    className={`transition-all duration-300 ease-in-out ${
                      isCollapsed ? 'hidden' : 'block p-5 sm:p-6 border-t border-slate-800/80'
                    }`}
                  >
                    {section.blocks.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No additional content in this section.</p>
                    ) : (
                      section.blocks.map((block, bIdx) => renderBlock(block, bIdx))
                    )}
                  </div>
                </section>
              );
            })
          ) : (
            // If content has no H2 headings, render regular container
            parsed.introBlocks.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm border border-slate-800 rounded-2xl bg-slate-900/40">
                No lesson content written yet.
              </div>
            )
          )}
        </div>

        {/* Desktop Sticky Table of Contents (1 col) */}
        {showTocSidebar && parsed.toc.length > 0 && (
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <LessonToc
              items={parsed.toc}
              activeId={activeSectionId}
              onSelectSection={(id) => {
                setActiveSectionId(id);
                setCollapsedSections((prev) => ({ ...prev, [id]: false }));
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
