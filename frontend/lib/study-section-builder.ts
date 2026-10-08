import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, RootContent, Heading } from 'mdast';

export interface TocNode {
  id: string;
  title: string;
  level: 2 | 3 | 4;
  children?: TocNode[];
}

export interface StudySubsection {
  id: string;
  title: string;
  level: number;
}

export interface StudySection {
  id: string;
  title: string;
  level: number;
  headingNode?: Heading;
  nodes: RootContent[];
  subsections: StudySubsection[];
}

export interface StudyDocument {
  title?: string;
  introSection?: StudySection;
  sections: StudySection[];
  toc: TocNode[];
  estimatedMinutes: number;
  wordCount: number;
}

// URL-friendly slug generator with support for Vietnamese characters and numbers
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u00C0-\u1EF9-]/g, '') // Support Vietnamese accented characters & alphanumeric
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

// Generate unique slug by tracking occurrences
export function generateUniqueSlug(title: string, seenSlugs: Map<string, number>): string {
  const base = slugify(title) || 'section';
  const count = seenSlugs.get(base) || 0;
  seenSlugs.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

// Recursively extract plain text from an mdast node
export function extractTextFromMdast(node: any): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromMdast).join('');
  }
  return '';
}

// Fast word counter for mdast tree
function countWordsInMdast(node: any): number {
  if (!node) return 0;
  let count = 0;
  if (typeof node.value === 'string') {
    const str = node.value;
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
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countWordsInMdast(child);
    }
  }
  return count;
}

// Singleton Unified processor instance
const mdastProcessor = unified().use(remarkParse).use(remarkGfm);

/**
 * Parses Raw Markdown String into a structured StudyDocument with independent StudySection[]
 * and a hierarchical TocNode[] tree in a single O(N) AST traversal pass.
 *
 * Supports both:
 * 1. Multi-H1 documents (where `# 1. ...`, `# 2. ...` define major sections and `## ...` define subsections)
 * 2. Standard H2 documents (where single `# Title` is document title and `## ...` define major sections)
 */
export function buildStudyDocument(markdown: string): StudyDocument {
  if (!markdown || !markdown.trim()) {
    return {
      title: undefined,
      introSection: undefined,
      sections: [],
      toc: [],
      estimatedMinutes: 1,
      wordCount: 0,
    };
  }

  // 1. ONE-TIME parse into MDAST
  const root = mdastProcessor.parse(markdown) as Root;
  const children = root.children || [];

  // Count H1 headings to determine document structure style
  let h1Count = 0;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === 'heading' && node.depth === 1) {
      h1Count++;
    }
  }

  const isMultiH1Document = h1Count > 1;

  let mainTitle: string | undefined = undefined;
  const introNodes: RootContent[] = [];
  const sections: StudySection[] = [];
  const toc: TocNode[] = [];
  const seenSlugs = new Map<string, number>();

  let currentSection: StudySection | null = null;
  let currentParentTocNode: TocNode | null = null;
  let sectionIndex = 0;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    // Case 1: First H1 at the very beginning of the document is the document title
    if (node.type === 'heading' && node.depth === 1 && !mainTitle && sections.length === 0) {
      mainTitle = extractTextFromMdast(node);
      introNodes.push(node);
      continue;
    }

    // Case 2: Major Section Boundary
    // In multi-H1 docs: any subsequent H1 is a major section.
    // In standard docs: any H2 is a major section.
    const isMajorSectionHeading =
      (isMultiH1Document && node.type === 'heading' && node.depth === 1) ||
      (!isMultiH1Document && node.type === 'heading' && node.depth === 2);

    if (isMajorSectionHeading) {
      sectionIndex++;
      const title = extractTextFromMdast(node);
      const id = generateUniqueSlug(title, seenSlugs) || `section-${sectionIndex}`;

      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        id,
        title,
        level: node.depth,
        headingNode: node,
        nodes: [node],
        subsections: [],
      };

      // Add to TOC as top-level item
      currentParentTocNode = {
        id,
        title,
        level: 2,
        children: [],
      };
      toc.push(currentParentTocNode);
      continue;
    }

    // Case 3: Subsections
    // In multi-H1 docs: H2, H3, H4 are subsections
    // In standard docs: H3, H4 are subsections
    const isSubsectionHeading =
      (isMultiH1Document && node.type === 'heading' && (node.depth === 2 || node.depth === 3 || node.depth === 4)) ||
      (!isMultiH1Document && node.type === 'heading' && (node.depth === 3 || node.depth === 4));

    if (isSubsectionHeading) {
      const title = extractTextFromMdast(node);
      const id = generateUniqueSlug(title, seenSlugs) || `sub-${node.depth}-${i}`;

      const subsection: StudySubsection = {
        id,
        title,
        level: node.depth,
      };

      if (currentSection) {
        currentSection.nodes.push(node);
        currentSection.subsections.push(subsection);
      } else {
        introNodes.push(node);
      }

      // Add to TOC hierarchy
      const tocSubNode: TocNode = {
        id,
        title,
        level: (isMultiH1Document && node.depth === 2 ? 3 : 4) as 3 | 4,
        children: [],
      };

      if (currentParentTocNode) {
        currentParentTocNode.children = currentParentTocNode.children || [];
        currentParentTocNode.children.push(tocSubNode);
      } else {
        toc.push(tocSubNode);
      }
      continue;
    }

    // Case 4: General content nodes (Paragraph, Code, Blockquote, Table, List, etc.)
    if (currentSection) {
      currentSection.nodes.push(node);
    } else {
      introNodes.push(node);
    }
  }

  // Push final section
  if (currentSection) {
    sections.push(currentSection);
  }

  // Build Intro section if any intro nodes exist
  let introSection: StudySection | undefined = undefined;
  if (introNodes.length > 0) {
    introSection = {
      id: 'section-intro',
      title: mainTitle || 'Introduction',
      level: 1,
      nodes: introNodes,
      subsections: [],
    };
  }

  const wordCount = countWordsInMdast(root);
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return {
    title: mainTitle,
    introSection,
    sections,
    toc,
    estimatedMinutes,
    wordCount,
  };
}

