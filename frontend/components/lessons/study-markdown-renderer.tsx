'use client';

import React, { useMemo } from 'react';
import type { Components } from 'react-markdown';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toHast } from 'mdast-util-to-hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { defaultUrlTransform } from '@/lib/default-url-transform';
import { LessonCodeBlock } from './lesson-code-block';
import { LessonCallout } from './lesson-callout';
import { CalloutType, TocItem } from '@/lib/markdown-parser';
import {
  StudySection,
  StudyDocument,
  TocNode,
  buildStudyDocument,
  slugify,
} from '@/lib/study-section-builder';
import { Hash, ExternalLink } from 'lucide-react';

export { buildStudyDocument, slugify };
export type { StudySection, StudyDocument, TocNode, Components };

// Extract Table of Contents items (H2 and H3) in single O(N) scan
export function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown) return [];
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    const title = match[2].trim().replace(/[*_`[\]]/g, '');
    const id = slugify(title);
    if (title && id) {
      toc.push({ id, title, level });
    }
  }
  return toc;
}

// Fast word count & reading time calculator
export function estimateReadingTime(markdown: string): { wordCount: number; minutes: number } {
  if (!markdown) return { wordCount: 0, minutes: 1 };
  let count = 0;
  let inWord = false;
  for (let i = 0; i < markdown.length; i++) {
    const code = markdown.charCodeAt(i);
    const isSpace = code === 32 || code === 10 || code === 13 || code === 9;
    if (!isSpace && !inWord) {
      inWord = true;
      count++;
    } else if (isSpace) {
      inWord = false;
    }
  }
  return { wordCount: count, minutes: Math.max(1, Math.ceil(count / 180)) };
}

// GitHub Alert / Callout Parser helper from blockquote children
function parseCalloutTypeFromBlockquote(children: React.ReactNode): {
  isCallout: boolean;
  type: CalloutType;
  title: string;
  cleanedChildren: React.ReactNode;
} {
  let text = '';
  if (Array.isArray(children)) {
    const first = children[0];
    if (first && typeof first === 'object' && 'props' in first) {
      text = String(first.props?.children || '');
    }
  } else if (typeof children === 'string') {
    text = children;
  }

  const alertMatch = text.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|EXAMPLE)\](?:\s+(.*))?/i);
  if (alertMatch) {
    const tag = alertMatch[1].toLowerCase();
    let type: CalloutType = 'info';
    let defaultTitle = 'Note';

    if (tag === 'tip') {
      type = 'tip';
      defaultTitle = 'Pro Tip';
    } else if (tag === 'warning' || tag === 'caution') {
      type = 'warning';
      defaultTitle = 'Warning';
    } else if (tag === 'important') {
      type = 'important';
      defaultTitle = 'Important';
    } else if (tag === 'example') {
      type = 'example';
      defaultTitle = 'Example Walkthrough';
    }

    const customTitle = alertMatch[2]?.trim() || defaultTitle;
    return {
      isCallout: true,
      type,
      title: customTitle,
      cleanedChildren: children,
    };
  }

  return {
    isCallout: false,
    type: 'info',
    title: 'Note',
    cleanedChildren: children,
  };
}

// Comprehensive custom component mapping for high-end learning platform typography
export const studyMarkdownComponents: Components = {
  h1: ({ children, ...props }) => {
    const title = String(children || '');
    const id = slugify(title);
    return (
      <h1
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight mt-10 mb-6 pb-4 border-b border-slate-800/80 scroll-mt-28"
        {...props}
      >
        {children}
      </h1>
    );
  },

  h2: ({ children, ...props }) => {
    const title = String(children || '');
    const id = slugify(title);
    return (
      <h2
        id={id}
        className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-12 mb-4 pt-6 border-t border-slate-800/70 first:mt-0 first:pt-0 first:border-t-0 flex items-center justify-between group scroll-mt-28"
        {...props}
      >
        <a
          href={`#${id}`}
          className="group-hover:text-indigo-300 transition-colors flex items-center gap-2"
        >
          <span>{children}</span>
          <span className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity text-base font-mono font-normal">
            #
          </span>
        </a>
      </h2>
    );
  },

  h3: ({ children, ...props }) => {
    const title = String(children || '');
    const id = slugify(title);
    return (
      <h3
        id={id}
        className="text-lg sm:text-xl font-semibold text-slate-200 tracking-tight mt-8 mb-3 flex items-center group scroll-mt-28"
        {...props}
      >
        <a
          href={`#${id}`}
          className="group-hover:text-indigo-300 transition-colors flex items-center gap-2"
        >
          <span>{children}</span>
          <span className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-mono font-normal">
            #
          </span>
        </a>
      </h3>
    );
  },

  h4: ({ children, ...props }) => {
    const title = String(children || '');
    const id = slugify(title);
    return (
      <h4
        id={id}
        className="text-base sm:text-lg font-semibold text-slate-300 tracking-tight mt-6 mb-2.5 scroll-mt-28"
        {...props}
      >
        {children}
      </h4>
    );
  },

  p: ({ children, ...props }) => (
    <p
      className="my-4 text-[15px] sm:text-[16px] text-slate-300 leading-[1.75] font-normal"
      {...props}
    >
      {children}
    </p>
  ),

  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const isMultiLine = codeString.includes('\n');

    // Code block with language tag or multi-line code
    if (match || isMultiLine) {
      return (
        <LessonCodeBlock
          code={codeString}
          language={match ? match[1] : ''}
        />
      );
    }

    // Single inline code tag with modern documentation styling
    return (
      <code
        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-emerald-300 font-mono text-[13.5px] font-medium selection:bg-emerald-500 selection:text-slate-950"
        {...props}
      >
        {children}
      </code>
    );
  },

  blockquote: ({ children }) => {
    const callout = parseCalloutTypeFromBlockquote(children);
    if (callout.isCallout) {
      return (
        <LessonCallout type={callout.type} title={callout.title}>
          {callout.cleanedChildren}
        </LessonCallout>
      );
    }

    return (
      <blockquote className="my-6 pl-4 border-l-2 border-indigo-500/80 bg-indigo-950/20 py-3.5 pr-4 sm:pr-6 rounded-r-xl text-slate-300 text-[15px] leading-[1.75] not-italic shadow-sm [&>p]:my-2 [&>p]:leading-relaxed [&>p]:not-italic [&>ul]:my-2 [&>ul]:space-y-1.5 [&>ul]:pl-1 [&>ul_li]:not-italic [&>ol]:my-2 [&>ol]:space-y-1.5 [&>ol]:pl-2 [&>ol_li]:not-italic [&_strong]:text-slate-100 [&_strong]:font-bold">
        {children}
      </blockquote>
    );
  },

  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-lg">
      <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead className="bg-slate-900/95 border-b border-slate-800 text-slate-200 font-semibold uppercase text-[11px] tracking-wider font-mono" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40" {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }) => (
    <tr className="even:bg-slate-900/30 hover:bg-slate-800/40 transition-colors" {...props}>
      {children}
    </tr>
  ),

  th: ({ children, ...props }) => (
    <th className="px-4 py-3.5 font-semibold text-slate-200" {...props}>
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td className="px-4 py-3 leading-relaxed text-slate-300" {...props}>
      {children}
    </td>
  ),

  ul: ({ children, ...props }) => (
    <ul className="my-4 space-y-2 text-[15px] sm:text-[16px] text-slate-300 leading-[1.75] pl-1" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol className="my-4 space-y-2 list-decimal list-inside text-[15px] sm:text-[16px] text-slate-300 leading-[1.75] pl-2" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => {
    // Check if it's a task list checkbox item from GFM
    const isTaskItem = Array.isArray(children) && children.some(
      (c) => typeof c === 'object' && c && 'props' in c && c.props?.type === 'checkbox'
    );

    if (isTaskItem) {
      return (
        <li className="flex items-start space-x-2.5 my-1.5 list-none text-[15px] sm:text-[16px]" {...props}>
          {children}
        </li>
      );
    }

    return (
      <li className="flex items-start space-x-2.5 my-1.5" {...props}>
        <span className="text-indigo-400 font-mono select-none mt-1 text-xs">•</span>
        <span className="flex-1">{children}</span>
      </li>
    );
  },

  input: ({ type, checked, disabled, ...props }) => {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          readOnly
          className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/20 cursor-default"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },

  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http') || href?.startsWith('//');
    return (
      <a
        href={href || '#'}
        className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40 hover:decoration-indigo-400 transition-colors font-medium"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        <span>{children}</span>
        {isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />}
      </a>
    );
  },

  hr: (props) => <hr className="my-10 border-slate-800/80" {...props} />,

  del: ({ children, ...props }) => (
    <del className="line-through text-slate-500 opacity-80" {...props}>
      {children}
    </del>
  ),

  img: ({ src, alt, ...props }) => (
    <div className="my-6 space-y-2">
      <img
        src={src}
        alt={alt || 'Lesson Image'}
        className="max-w-full rounded-2xl border border-slate-800 shadow-xl object-contain mx-auto max-h-[600px]"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-center text-xs text-slate-500 italic">
          {alt}
        </p>
      )}
    </div>
  ),
};

export interface StudySectionRendererProps {
  section: StudySection;
  className?: string;
}

/**
 * Renders a single StudySection directly from its MDAST nodes into an independent semantic <section id="...">
 * without re-parsing raw Markdown.
 */
export const StudySectionRenderer = React.memo(function StudySectionRenderer({
  section,
  className = '',
}: StudySectionRendererProps) {
  const jsxContent = useMemo(() => {
    if (!section.nodes || section.nodes.length === 0) return null;
    try {
      const hast = toHast(
        { type: 'root', children: section.nodes as any },
        { allowDangerousHtml: true }
      );
      return toJsxRuntime(hast, {
        Fragment,
        jsx,
        jsxs,
        components: studyMarkdownComponents as any,
      });
    } catch {
      return null;
    }
  }, [section]);

  if (!jsxContent) return null;

  return (
    <section
      id={section.id}
      key={section.id}
      className={`study-section scroll-mt-28 space-y-4 ${className}`}
    >
      {jsxContent}
    </section>
  );
});

export interface StudyMarkdownRendererProps {
  content?: string;
  doc?: StudyDocument;
  className?: string;
}

export const StudyMarkdownRenderer = React.memo(function StudyMarkdownRenderer({
  content = '',
  doc: externalDoc,
  className = '',
}: StudyMarkdownRendererProps) {
  const doc = useMemo(() => {
    if (externalDoc) return externalDoc;
    return buildStudyDocument(content);
  }, [externalDoc, content]);

  if (!doc || (!doc.introSection && (!doc.sections || doc.sections.length === 0))) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm font-mono bg-slate-950/40 rounded-2xl border border-slate-800/60">
        No lesson content to preview yet. Start typing in the editor.
      </div>
    );
  }

  return (
    <div className={`study-markdown-content max-w-none text-slate-300 font-sans space-y-12 ${className}`}>
      {doc.introSection && (
        <StudySectionRenderer
          section={doc.introSection}
          key="section-intro"
          className="study-section-intro border-b border-slate-800/60 pb-8 mb-8"
        />
      )}
      {doc.sections.map((section) => (
        <StudySectionRenderer
          section={section}
          key={section.id}
        />
      ))}
    </div>
  );
});
