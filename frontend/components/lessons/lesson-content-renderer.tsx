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
  ParsedLesson,
} from '@/lib/markdown-parser';
import { InlineTokensRenderer } from './inline-tokens-renderer';
import { LessonCodeBlock } from './lesson-code-block';
import { LessonCallout } from './lesson-callout';
import { LessonToc } from './lesson-toc';

interface LessonContentRendererProps {
  content?: string;
  parsedData?: ParsedLesson;
  title?: string;
  dayNumber?: number;
  showTocSidebar?: boolean;
}

// Memoized Block Renderer
const RenderBlock = React.memo(function RenderBlock({
  block,
  blockIdx,
}: {
  block: ContentBlock;
  blockIdx: number;
}) {
  const blockKey = block.id || `block-${blockIdx}`;

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="my-3.5 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          {block.tokens && <InlineTokensRenderer tokens={block.tokens} />}
        </p>
      );

    case 'heading':
      if (block.level === 3) {
        return (
          <h3
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
          key={blockKey}
          code={block.code || ''}
          language={block.language || 'javascript'}
        />
      );

    case 'callout':
      return (
        <LessonCallout
          key={blockKey}
          type={block.calloutType || 'info'}
          title={block.calloutTitle}
        >
          {block.blocks?.map((child, cIdx) => (
            <RenderBlock key={child.id || cIdx} block={child} blockIdx={cIdx} />
          ))}
        </LessonCallout>
      );

    case 'list':
      if (block.listType === 'number') {
        return (
          <ol className="my-4 space-y-2 list-decimal list-inside text-sm sm:text-base text-slate-300 leading-relaxed pl-2">
            {block.items?.map((itemTokens, iIdx) => (
              <li key={iIdx} className="pl-1">
                <InlineTokensRenderer tokens={itemTokens} />
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="my-4 space-y-2 text-sm sm:text-base text-slate-300 leading-relaxed pl-1">
          {block.items?.map((itemTokens, iIdx) => (
            <li key={iIdx} className="flex items-start space-x-2">
              <span className="text-indigo-400 font-mono select-none mt-1 text-xs">•</span>
              <span className="flex-1">
                <InlineTokensRenderer tokens={itemTokens} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div className="my-5 overflow-x-auto rounded-xl border border-slate-800/90 shadow-md">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
            {block.headers && block.headers.length > 0 && (
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  {block.headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-mono">
                      <InlineTokensRenderer tokens={h.tokens} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
              {block.rows?.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 leading-relaxed">
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
        <blockquote className="my-4 pl-4 border-l-2 border-indigo-500/50 bg-indigo-500/5 py-2 pr-3 rounded-r-lg text-slate-300 text-sm sm:text-base italic">
          {block.blocks?.map((child, cIdx) => (
            <RenderBlock key={child.id || cIdx} block={child} blockIdx={cIdx} />
          ))}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-8 border-slate-800/80" />;

    default:
      return null;
  }
});

// Memoized Section Card with smart equality comparator
const LessonSectionCard = React.memo(
  function LessonSectionCard({
    section,
    isCollapsed,
    onToggle,
  }: {
    section: LessonSection;
    isCollapsed: boolean;
    onToggle: (id: string) => void;
  }) {
    return (
      <div
        id={section.id}
        className={`rounded-2xl border transition-all duration-200 scroll-mt-20 overflow-hidden ${
          isCollapsed
            ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
            : 'bg-slate-900/60 border-slate-800/90 shadow-xl'
        }`}
      >
        <button
          type="button"
          onClick={() => onToggle(section.id)}
          className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-800/40 group"
        >
          <div className="flex items-center space-x-3 pr-4">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
              <Hash className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {section.title}
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 group-hover:text-slate-200">
            <span className="text-xs font-mono hidden sm:inline-block">
              {section.blocks.length} {section.blocks.length === 1 ? 'block' : 'blocks'}
            </span>
            <div
              className={`p-1 rounded-md transition-transform duration-200 ${
                isCollapsed ? '' : 'rotate-180'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Section Body is ONLY mounted into DOM when expanded (90%+ DOM reduction) */}
        {!isCollapsed && (
          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/60 space-y-2 text-slate-300 animate-in fade-in-50 duration-150">
            {section.blocks.map((block, bIdx) => (
              <RenderBlock key={block.id || bIdx} block={block} blockIdx={bIdx} />
            ))}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    // If collapse status changed, must re-render
    if (prev.isCollapsed !== next.isCollapsed) return false;
    // If both collapsed, skip re-rendering child blocks entirely
    if (
      prev.isCollapsed &&
      next.isCollapsed &&
      prev.section.id === next.section.id &&
      prev.section.title === next.section.title &&
      prev.section.blocks.length === next.section.blocks.length
    ) {
      return true;
    }
    return prev.section === next.section;
  }
);

export function LessonContentRenderer({
  content = '',
  parsedData,
  title,
  dayNumber,
  showTocSidebar = true,
}: LessonContentRendererProps) {
  // Use pre-parsed data (from Web Worker) if provided, otherwise compute AST with fallback memo
  const parsed = useMemo(() => {
    if (parsedData) return parsedData;
    return parseLessonContent(content);
  }, [parsedData, content]);

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Initialize or preserve section collapse state without blowing away user interaction
  useEffect(() => {
    setCollapsedSections((prev) => {
      const nextState: Record<string, boolean> = { ...prev };
      const total = parsed.sections.length;
      parsed.sections.forEach((section, idx) => {
        if (nextState[section.id] === undefined) {
          // Default: If doc has > 3 sections, expand first 2 and collapse the rest
          nextState[section.id] = total > 3 ? idx >= 2 : false;
        }
      });
      return nextState;
    });

    if (parsed.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(parsed.sections[0].id);
    }
  }, [parsed, activeSectionId]);

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

  const displayTitle = title || parsed.title;

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
                <span>{parsed.estimatedMinutes} min read</span>
              </span>
              <span>•</span>
              <span>{parsed.sections.length} core sections</span>
            </div>
          </div>
        </div>

        {/* Global Expand / Collapse Control */}
        {parsed.sections.length > 0 && (
          <button
            type="button"
            onClick={areAllCollapsed ? expandAll : collapseAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
          >
            {areAllCollapsed ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Expand All</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Collapse All</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Grid: Content + Optional Table of Contents Sticky Sidebar */}
      <div className={`grid grid-cols-1 ${showTocSidebar && parsed.toc.length > 0 ? 'lg:grid-cols-12 gap-8' : ''} items-start`}>
        {/* Main Document Stream */}
        <div className={showTocSidebar && parsed.toc.length > 0 ? 'lg:col-span-8 space-y-6' : 'space-y-6'}>
          {/* Intro Blocks before first H2 */}
          {parsed.introBlocks.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-slate-300 shadow-md">
              {parsed.introBlocks.map((block, bIdx) => (
                <RenderBlock key={block.id || bIdx} block={block} blockIdx={bIdx} />
              ))}
            </div>
          )}

          {/* Collapsible H2 Sections */}
          <div className="space-y-4">
            {parsed.sections.map((section) => (
              <LessonSectionCard
                key={section.id}
                section={section}
                isCollapsed={collapsedSections[section.id] || false}
                onToggle={toggleSection}
              />
            ))}
          </div>
        </div>

        {/* Sticky Table of Contents Sidebar */}
        {showTocSidebar && parsed.toc.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-20">
            <LessonToc
              items={parsed.toc}
              activeId={activeSectionId}
              onSelectSection={(id: string) => {
                setActiveSectionId(id);
                setCollapsedSections((prev) => ({
                  ...prev,
                  [id]: false,
                }));
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
