export type CalloutType = 'info' | 'tip' | 'warning' | 'important' | 'example';

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface InlineToken {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link';
  content: string;
  href?: string;
}

export interface TableCell {
  tokens: InlineToken[];
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  cells: TableCell[];
}

export interface ContentBlock {
  type:
    | 'heading'
    | 'paragraph'
    | 'code'
    | 'callout'
    | 'list'
    | 'table'
    | 'quote'
    | 'divider';
  level?: 1 | 2 | 3 | 4;
  id?: string;
  title?: string;
  tokens?: InlineToken[];
  language?: string;
  code?: string;
  calloutType?: CalloutType;
  calloutTitle?: string;
  blocks?: ContentBlock[]; // For callout or quote children
  listType?: 'bullet' | 'number';
  items?: InlineToken[][];
  headers?: TableCell[];
  rows?: TableRow[];
}

export interface LessonSection {
  id: string;
  title: string;
  level: 2;
  blocks: ContentBlock[];
}

export interface ParsedLesson {
  title?: string;
  introBlocks: ContentBlock[];
  sections: LessonSection[];
  toc: TocItem[];
  estimatedMinutes: number;
}

// Generate URL-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

// Parse inline formatting: **bold**, *italic*, `code`, [text](url)
export function parseInlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let remaining = text;

  // Regex patterns
  // 1. Code: `...`
  // 2. Bold: **...** or __...__
  // 3. Italic: *...* or _..._
  // 4. Link: [text](url)
  const regex = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(\[([^\]]+)\]\(([^)]+)\))/;

  while (remaining) {
    const match = remaining.match(regex);
    if (!match || match.index === undefined) {
      if (remaining) {
        tokens.push({ type: 'text', content: remaining });
      }
      break;
    }

    const index = match.index;
    if (index > 0) {
      tokens.push({ type: 'text', content: remaining.slice(0, index) });
    }

    const fullMatch = match[0];

    if (match[2] !== undefined) {
      // Code
      tokens.push({ type: 'code', content: match[2] });
    } else if (match[4] !== undefined) {
      // **Bold**
      tokens.push({ type: 'bold', content: match[4] });
    } else if (match[6] !== undefined) {
      // __Bold__
      tokens.push({ type: 'bold', content: match[6] });
    } else if (match[8] !== undefined) {
      // *Italic*
      tokens.push({ type: 'italic', content: match[8] });
    } else if (match[10] !== undefined) {
      // _Italic_
      tokens.push({ type: 'italic', content: match[10] });
    } else if (match[12] !== undefined && match[13] !== undefined) {
      // [text](url)
      tokens.push({ type: 'link', content: match[12], href: match[13] });
    } else {
      tokens.push({ type: 'text', content: fullMatch });
    }

    remaining = remaining.slice(index + fullMatch.length);
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', content: text }];
}

// Parse Markdown String into raw Structured Blocks
export function parseMarkdownBlocks(markdown: string): ContentBlock[] {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Horizontal Rule (---, ___, ***)
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // 2. Fenced Code Block (```lang)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim() || 'javascript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // consume closing ```
      }
      blocks.push({
        type: 'code',
        language,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // 3. GitHub / Custom Callouts (> [!TIP], > [!NOTE], [!TIP], :::tip)
    if (
      trimmed.startsWith('> [!') ||
      trimmed.startsWith('[!') ||
      trimmed.startsWith(':::')
    ) {
      let calloutType: CalloutType = 'info';
      let calloutTitle = 'Note';
      const calloutLines: string[] = [];

      if (trimmed.startsWith('> [!') || trimmed.startsWith('[!')) {
        const typeMatch = trimmed.match(/^>?\s*\[!([A-Za-z]+)\]\s*(.*)$/);
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
          (lines[i].trim().startsWith('>') || (trimmed.startsWith('[!') && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('```')))
        ) {
          calloutLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
      } else if (trimmed.startsWith(':::')) {
        const typeMatch = trimmed.match(/^:::\s*([A-Za-z]+)(?:\s+(.*))?$/);
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
          i++; // consume closing :::
        }
      }

      blocks.push({
        type: 'callout',
        calloutType,
        calloutTitle,
        blocks: [
          {
            type: 'paragraph',
            tokens: parseInlineTokens(calloutLines.join('\n').trim()),
          },
        ],
      });
      continue;
    }

    // 4. Standard Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'quote',
        blocks: [
          {
            type: 'paragraph',
            tokens: parseInlineTokens(quoteLines.join('\n').trim()),
          },
        ],
      });
      continue;
    }

    // 5. Headings (# H1, ## H2, ### H3, #### H4)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4;
      const title = headingMatch[2].trim();
      const id = slugify(title);

      blocks.push({
        type: 'heading',
        level,
        id,
        title,
        tokens: parseInlineTokens(title),
      });
      i++;
      continue;
    }

    // 6. Tables (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => ({ tokens: parseInlineTokens(c.trim()) }));

        const rows: TableRow[] = [];
        const startIndex = /^[|\s-:]+$/.test(tableLines[1]) ? 2 : 1;

        for (let r = startIndex; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split('|')
            .slice(1, -1)
            .map((c) => ({ tokens: parseInlineTokens(c.trim()) }));
          rows.push({ cells });
        }

        blocks.push({
          type: 'table',
          headers: headerCells,
          rows,
        });
        continue;
      }
    }

    // 7. Lists (Bullet: -, *, + or Numbered: 1., 2.)
    const isBullet = /^[-*+]\s+/.test(trimmed);
    const isNumber = /^\d+\.\s+/.test(trimmed);

    if (isBullet || isNumber) {
      const listType: 'bullet' | 'number' = isBullet ? 'bullet' : 'number';
      const items: InlineToken[][] = [];

      while (i < lines.length) {
        const currentTrim = lines[i].trim();
        const currentBullet = /^[-*+]\s+(.+)$/.exec(currentTrim);
        const currentNumber = /^\d+\.\s+(.+)$/.exec(currentTrim);

        if (listType === 'bullet' && currentBullet) {
          items.push(parseInlineTokens(currentBullet[1].trim()));
          i++;
        } else if (listType === 'number' && currentNumber) {
          items.push(parseInlineTokens(currentNumber[1].trim()));
          i++;
        } else if (currentTrim === '') {
          if (
            i + 1 < lines.length &&
            (/^[-*+]\s+/.test(lines[i + 1].trim()) ||
              /^\d+\.\s+/.test(lines[i + 1].trim()))
          ) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      blocks.push({
        type: 'list',
        listType,
        items,
      });
      continue;
    }

    // 8. Paragraphs
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('[!') &&
      !lines[i].trim().startsWith(':::') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(---|___|\*\*\*)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        tokens: parseInlineTokens(paraLines.join(' ')),
      });
    }
  }

  return blocks;
}

// Parse Markdown String into Structured Blocks
export function parseLessonContent(markdown: string): ParsedLesson {
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
  const toc: TocItem[] = [];
  let mainTitle: string | undefined = undefined;

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

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));



  // Structure blocks into Collapsible Major Sections based on H2 headings
  const introBlocks: ContentBlock[] = [];
  const sections: LessonSection[] = [];
  let currentSection: LessonSection | null = null;

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
