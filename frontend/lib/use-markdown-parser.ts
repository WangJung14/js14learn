'use client';

import { useState, useEffect, useRef, useDeferredValue } from 'react';
import { ParsedLesson, parseLessonContent } from './markdown-parser';

// High-performance self-contained Web Worker script with termination guarantee
const WORKER_SCRIPT = `
function slugify(text) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\\w\\s-]/g, '')
      .replace(/[\\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

const INLINE_TOKEN_REGEX =
  /(\`([^\`]+)\`)|(\\*\\*([^*]+)\\*\\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(\\[([^\\]]+)\\]\\(([^)]+)\\))/g;

function parseInlineTokens(text) {
  if (!text) return [];

  // Fast path for plain text
  if (
    text.indexOf('\`') === -1 &&
    text.indexOf('*') === -1 &&
    text.indexOf('_') === -1 &&
    text.indexOf('[') === -1
  ) {
    return [{ type: 'text', content: text }];
  }

  const tokens = [];
  INLINE_TOKEN_REGEX.lastIndex = 0;
  let lastIndex = 0;
  let match;

  while ((match = INLINE_TOKEN_REGEX.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex, matchIndex),
      });
    }

    const fullMatch = match[0];
    if (match[2] !== undefined) {
      tokens.push({ type: 'code', content: match[2] });
    } else if (match[4] !== undefined) {
      tokens.push({ type: 'bold', content: match[4] });
    } else if (match[6] !== undefined) {
      tokens.push({ type: 'bold', content: match[6] });
    } else if (match[8] !== undefined) {
      tokens.push({ type: 'italic', content: match[8] });
    } else if (match[10] !== undefined) {
      tokens.push({ type: 'italic', content: match[10] });
    } else if (match[12] !== undefined && match[13] !== undefined) {
      tokens.push({ type: 'link', content: match[12], href: match[13] });
    } else {
      tokens.push({ type: 'text', content: fullMatch });
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', content: text }];
}

function countWords(str) {
  let count = 0;
  let inWord = false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const isSpace = code === 32 || code === 10 || code === 13 || code === 9;
    if (!isSpace && !inWord) {
      inWord = true;
      count++;
    } else if (isSpace) {
      inWord = false;
    }
  }
  return count;
}

function parseMarkdownBlocks(markdown) {
  if (!markdown || !markdown.trim()) return [];
  const lines = markdown.replace(/\\r\\n/g, '\\n').split('\\n');
  const blocks = [];
  let i = 0;
  let blockCounter = 0;

  while (i < lines.length) {
    const startI = i; // Guaranteed progress sentinel
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    blockCounter++;
    const blockId = 'block-' + blockCounter;

    // 1. Horizontal Rule
    if (trimmed === '---' || trimmed === '___' || trimmed === '***') {
      blocks.push({ type: 'divider', id: blockId });
      i++;
      continue;
    }

    // 2. Fenced Code Block
    if (trimmed.startsWith('\`\`\`')) {
      const language = trimmed.slice(3).trim() || 'javascript';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('\`\`\`')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('\`\`\`')) {
        i++;
      }
      blocks.push({
        type: 'code',
        id: blockId,
        language,
        code: codeLines.join('\\n'),
      });
      continue;
    }

    // 3. Callouts
    if (
      trimmed.startsWith('> [!') ||
      trimmed.startsWith('[!') ||
      trimmed.startsWith(':::')
    ) {
      let calloutType = 'info';
      let calloutTitle = 'Note';
      const calloutLines = [];

      if (trimmed.startsWith('> [!') || trimmed.startsWith('[!')) {
        const typeMatch = trimmed.match(/^>?\\s*\\[!([A-Za-z]+)\\]\\s*(.*)$/);
        const tag = (typeMatch?.[1] || 'note').toLowerCase();
        if (tag === 'tip') {
          calloutType = 'tip';
          calloutTitle = 'Pro Tip';
        } else if (tag === 'warning' || tag === 'caution') {
          calloutType = 'warning';
          calloutTitle = 'Warning';
        } else if (tag === 'important') {
          calloutType = 'important';
          calloutTitle = 'Important';
        } else if (tag === 'example') {
          calloutType = 'example';
          calloutTitle = 'Example Walkthrough';
        } else {
          calloutType = 'info';
          calloutTitle = 'Information';
        }
        if (typeMatch?.[2]) calloutTitle = typeMatch[2];

        i++;
        while (
          i < lines.length &&
          (lines[i].trim().startsWith('>') ||
            (trimmed.startsWith('[!') &&
              lines[i].trim() &&
              !lines[i].trim().startsWith('#') &&
              !lines[i].trim().startsWith('\`\`\`')))
        ) {
          calloutLines.push(lines[i].replace(/^>\\s?/, ''));
          i++;
        }
      } else if (trimmed.startsWith(':::')) {
        const typeMatch = trimmed.match(/^:::\\s*([A-Za-z]+)(?:\\s+(.*))?$/);
        const tag = (typeMatch?.[1] || 'info').toLowerCase();
        if (tag === 'tip') {
          calloutType = 'tip';
          calloutTitle = 'Pro Tip';
        } else if (tag === 'warning' || tag === 'danger') {
          calloutType = 'warning';
          calloutTitle = 'Warning';
        } else if (tag === 'important') {
          calloutType = 'important';
          calloutTitle = 'Important';
        } else if (tag === 'example') {
          calloutType = 'example';
          calloutTitle = 'Example Walkthrough';
        } else {
          calloutType = 'info';
          calloutTitle = 'Note';
        }
        if (typeMatch?.[2]) calloutTitle = typeMatch[2];

        i++;
        while (i < lines.length && !lines[i].trim().startsWith(':::')) {
          calloutLines.push(lines[i]);
          i++;
        }
        if (i < lines.length && lines[i].trim().startsWith(':::')) {
          i++;
        }
      }

      blocks.push({
        type: 'callout',
        id: blockId,
        calloutType,
        calloutTitle,
        blocks: [
          {
            type: 'paragraph',
            id: blockId + '-p',
            tokens: parseInlineTokens(calloutLines.join('\\n').trim()),
          },
        ],
      });
      continue;
    }

    // 4. Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'quote',
        id: blockId,
        blocks: [
          {
            type: 'paragraph',
            id: blockId + '-p',
            tokens: parseInlineTokens(quoteLines.join('\\n').trim()),
          },
        ],
      });
      continue;
    }

    // 5. Headings
    if (trimmed.charCodeAt(0) === 35) {
      const headingMatch = trimmed.match(/^(#{1,4})\\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();
        const id = slugify(title);

        blocks.push({
          type: 'heading',
          id,
          level,
          title,
          tokens: parseInlineTokens(title),
        });
        i++;
        continue;
      }
    }

    // 6. Tables
    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      const tableLines = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|')
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => ({ tokens: parseInlineTokens(c.trim()) }));

        const rows = [];
        const startIndex = /^[|\\s-:]+$/.test(tableLines[1]) ? 2 : 1;

        for (let r = startIndex; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split('|')
            .slice(1, -1)
            .map((c) => ({ tokens: parseInlineTokens(c.trim()) }));
          rows.push({ cells });
        }

        blocks.push({
          type: 'table',
          id: blockId,
          headers: headerCells,
          rows,
        });
        continue;
      } else if (tableLines.length === 1) {
        blocks.push({
          type: 'paragraph',
          id: blockId,
          tokens: parseInlineTokens(tableLines[0]),
        });
        continue;
      }
    }

    // 7. Lists
    const isBullet = /^[-*+]\\s*/.test(trimmed);
    const isNumber = /^\\d+\\.\\s*/.test(trimmed);

    if (isBullet || isNumber) {
      const listType = isBullet ? 'bullet' : 'number';
      const items = [];

      while (i < lines.length) {
        const currentTrim = lines[i].trim();
        if (!currentTrim) break;

        const currentBullet = /^[-*+]\\s*(.*)$/.exec(currentTrim);
        const currentNumber = /^\\d+\\.\\s*(.*)$/.exec(currentTrim);

        if (listType === 'bullet' && currentBullet) {
          items.push(parseInlineTokens((currentBullet[1] || '').trim()));
          i++;
        } else if (listType === 'number' && currentNumber) {
          items.push(parseInlineTokens((currentNumber[1] || '').trim()));
          i++;
        } else if (lines[i].startsWith('  ') || lines[i].startsWith('\\t')) {
          if (items.length > 0) {
            const lastTokens = items[items.length - 1];
            const addedTokens = parseInlineTokens(currentTrim);
            items[items.length - 1] = [...lastTokens, { type: 'text', content: ' ' }, ...addedTokens];
          }
          i++;
        } else {
          break;
        }
      }

      if (items.length > 0) {
        blocks.push({
          type: 'list',
          id: blockId,
          listType,
          items,
        });
        continue;
      }
    }

    // 8. Paragraphs
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('\`\`\`') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('[!') &&
      !lines[i].trim().startsWith(':::') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*+]\\s*/.test(lines[i].trim()) &&
      !/^\\d+\\.\\s*/.test(lines[i].trim()) &&
      lines[i].trim() !== '---' &&
      lines[i].trim() !== '___' &&
      lines[i].trim() !== '***'
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        id: blockId,
        tokens: parseInlineTokens(paraLines.join(' ')),
      });
      continue;
    }

    // 9. PROGRESS INVARIANT GUARANTEE: advance safely
    if (i === startI) {
      const fallbackLine = lines[i].trim();
      if (fallbackLine) {
        blocks.push({
          type: 'paragraph',
          id: blockId,
          tokens: parseInlineTokens(fallbackLine),
        });
      }
      i++;
    }
  }

  return blocks;
}

function parseMarkdownWorker(markdown) {
  if (!markdown || !markdown.trim()) {
    return {
      title: undefined,
      introBlocks: [],
      sections: [],
      toc: [],
      estimatedMinutes: 1,
    };
  }

  const blocks = parseMarkdownBlocks(markdown);
  const toc = [];
  let mainTitle = undefined;

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (block.level === 1 && !mainTitle) {
        mainTitle = block.title;
      }
      if ((block.level === 2 || block.level === 3) && block.title && block.id) {
        toc.push({ id: block.id, title: block.title, level: block.level });
      }
    }
  }

  const wordCount = countWords(markdown);
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const introBlocks = [];
  const sections = [];
  let currentSection = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: block.id || slugify(block.title || 'Section'),
        title: block.title || 'Section',
        level: 2,
        blocks: [],
      };
    } else if (currentSection) {
      currentSection.blocks.push(block);
    } else {
      introBlocks.push(block);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    title: mainTitle,
    introBlocks,
    sections,
    toc,
    estimatedMinutes,
  };
}

self.onmessage = function(e) {
  const { id, markdown } = e.data;
  try {
    const parsed = parseMarkdownWorker(markdown);
    self.postMessage({ id, parsed, error: null });
  } catch (err) {
    self.postMessage({ id, parsed: null, error: err.message || 'Worker parse error' });
  }
};
`;

export function useMarkdownParser(markdown: string): {
  parsed: ParsedLesson;
  isParsing: boolean;
} {
  const deferredMarkdown = useDeferredValue(markdown);
  const [parsed, setParsed] = useState<ParsedLesson>(() => parseLessonContent(markdown));
  const [isParsing, setIsParsing] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  // Initialize Worker once in browser environment
  useEffect(() => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return;

    try {
      const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (e: MessageEvent) => {
        const { id, parsed: workerResult, error } = e.data;
        // Anti-race-condition: Ignore stale response
        if (id === requestIdRef.current) {
          if (!error && workerResult) {
            setParsed(workerResult);
          }
          setIsParsing(false);
        }
      };

      workerRef.current = worker;

      return () => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    } catch {
      // Fallback to main thread if worker creation fails
      workerRef.current = null;
    }
  }, []);

  // Post parse job to Worker or perform deferred parsing
  useEffect(() => {
    const currentId = ++requestIdRef.current;

    if (workerRef.current) {
      setIsParsing(true);
      workerRef.current.postMessage({
        id: currentId,
        markdown: deferredMarkdown,
      });
    } else {
      // Synchronous fallback with deferred priority
      try {
        const res = parseLessonContent(deferredMarkdown);
        setParsed(res);
      } catch (err) {
        console.warn('Fallback markdown parse error:', err);
      }
    }
  }, [deferredMarkdown]);

  return { parsed, isParsing };
}
