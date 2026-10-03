'use client';

import React, { useMemo } from 'react';
import {
  parseMarkdownBlocks,
  ContentBlock,
} from '@/lib/markdown-parser';
import { InlineTokensRenderer } from '@/components/lessons/inline-tokens-renderer';
import { LessonCodeBlock } from '@/components/lessons/lesson-code-block';
import { LessonCallout } from '@/components/lessons/lesson-callout';
import {
  HelpCircle,
  ListChecks,
  Code2,
  AlertCircle,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';

interface ExerciseContentRendererProps {
  content: string;
  className?: string;
}

export function ExerciseContentRenderer({
  content,
  className = '',
}: ExerciseContentRendererProps) {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  if (!content || !content.trim()) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-sm italic">
        No problem statement provided for this exercise.
      </div>
    );
  }

  // Detect section theme for H2/H3 headings based on title keywords
  const getHeadingIcon = (title?: string) => {
    if (!title) return null;
    const lower = title.toLowerCase();
    if (lower.includes('problem') || lower.includes('bài toán') || lower.includes('đề bài') || lower.includes('mô tả')) {
      return <HelpCircle className="w-4 h-4 text-indigo-400" />;
    }
    if (lower.includes('task') || lower.includes('yêu cầu') || lower.includes('requirement') || lower.includes('nhiệm vụ')) {
      return <ListChecks className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('example') || lower.includes('ví dụ') || lower.includes('input') || lower.includes('output')) {
      return <Code2 className="w-4 h-4 text-cyan-400" />;
    }
    if (lower.includes('constraint') || lower.includes('ràng buộc') || lower.includes('lưu ý') || lower.includes('rule') || lower.includes('quy tắc')) {
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('table') || lower.includes('bảng')) {
      return <TableIcon className="w-4 h-4 text-purple-400" />;
    }
    return <Sparkles className="w-4 h-4 text-indigo-400/80" />;
  };

  const renderBlock = (block: ContentBlock, blockIdx: number) => {
    switch (block.type) {
      case 'heading': {
        const icon = getHeadingIcon(block.title);
        if (block.level === 1) {
          return (
            <h1
              key={blockIdx}
              id={block.id}
              className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-8 mb-4 tracking-tight border-b border-slate-800 pb-3"
            >
              {block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}
            </h1>
          );
        }
        if (block.level === 2) {
          return (
            <div key={blockIdx} className="mt-8 mb-3.5 pt-2">
              <h2
                id={block.id}
                className="text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2.5 pb-2 border-b border-slate-800/80 scroll-mt-24"
              >
                {icon && <span className="p-1 rounded-md bg-slate-900 border border-slate-800">{icon}</span>}
                <span>{block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}</span>
              </h2>
            </div>
          );
        }
        if (block.level === 3) {
          return (
            <h3
              key={blockIdx}
              id={block.id}
              className="text-base sm:text-lg font-semibold text-slate-200 mt-6 mb-2.5 flex items-center space-x-2 scroll-mt-24"
            >
              <span className="text-indigo-400 font-mono text-sm">#</span>
              <span>{block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}</span>
            </h3>
          );
        }
        return (
          <h4
            key={blockIdx}
            id={block.id}
            className="text-sm sm:text-base font-semibold text-slate-300 mt-4 mb-2 scroll-mt-24"
          >
            {block.tokens ? <InlineTokensRenderer tokens={block.tokens} /> : block.title}
          </h4>
        );
      }

      case 'paragraph':
        return (
          <p
            key={blockIdx}
            className="my-3 text-sm sm:text-[15px] text-slate-300 leading-relaxed font-sans"
          >
            {block.tokens && <InlineTokensRenderer tokens={block.tokens} />}
          </p>
        );

      case 'code':
        return (
          <div key={blockIdx} className="my-4">
            <LessonCodeBlock
              code={block.code || ''}
              language={block.language || 'javascript'}
            />
          </div>
        );

      case 'callout':
        return (
          <div key={blockIdx} className="my-4">
            <LessonCallout
              type={block.calloutType || 'info'}
              title={block.calloutTitle}
            >
              {block.blocks?.map((child, cIdx) => renderBlock(child, cIdx))}
            </LessonCallout>
          </div>
        );

      case 'list':
        if (block.listType === 'number') {
          return (
            <ol
              key={blockIdx}
              className="my-4 space-y-2 list-decimal list-outside text-sm sm:text-[15px] text-slate-300 leading-relaxed pl-6 marker:text-indigo-400 marker:font-mono marker:font-semibold"
            >
              {block.items?.map((itemTokens, iIdx) => (
                <li key={iIdx} className="pl-1">
                  <InlineTokensRenderer tokens={itemTokens} />
                </li>
              ))}
            </ol>
          );
        }
        return (
          <ul
            key={blockIdx}
            className="my-4 space-y-2 text-sm sm:text-[15px] text-slate-300 leading-relaxed pl-1"
          >
            {block.items?.map((itemTokens, iIdx) => (
              <li key={iIdx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <span className="flex-1">
                  <InlineTokensRenderer tokens={itemTokens} />
                </span>
              </li>
            ))}
          </ul>
        );

      case 'table':
        return (
          <div
            key={blockIdx}
            className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md"
          >
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[320px]">
              {block.headers && block.headers.length > 0 && (
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    {block.headers.map((header, hIdx) => (
                      <th key={hIdx} className="p-3 sm:p-3.5">
                        <InlineTokensRenderer tokens={header.tokens} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {block.rows?.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    {row.cells.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 sm:p-3.5 text-slate-300"
                      >
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
            className="my-4 border-l-4 border-indigo-500 bg-slate-900/40 pl-4 py-2.5 text-sm sm:text-[15px] text-slate-300 italic rounded-r-lg"
          >
            {block.blocks?.map((child, cIdx) => renderBlock(child, cIdx))}
          </blockquote>
        );

      case 'divider':
        return (
          <hr key={blockIdx} className="my-6 border-t border-slate-800/80" />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-1 text-slate-300 font-sans ${className}`}>
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}
