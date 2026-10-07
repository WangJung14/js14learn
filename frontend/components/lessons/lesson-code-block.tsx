'use client';

import React, { useState, useMemo } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface LessonCodeBlockProps {
  code: string;
  language?: string;
}

// Global LRU Cache for tokenized syntax output to avoid re-tokenizing identical code across renders
const HIGHLIGHT_CACHE_LIMIT = 300;
const highlightCache = new Map<string, React.ReactNode[]>();

// Regex patterns pre-compiled outside render
const COMMENT_REGEX = /^\s*\/\//;
const TOKEN_SPLIT_REGEX =
  /(\b(?:const|let|var|function|return|if|else|switch|case|break|for|while|do|try|catch|finally|throw|class|extends|import|export|from|default|async|await|typeof|instanceof|new|this|super|null|undefined|true|false|public|private|protected|static|final|void|int|double|float|long|boolean|char|byte|short|record|interface|implements|package)\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|\b\d+\b|[{}()[\].,;+\-*/%=<>!&|^~?:])/g;

const KEYWORD_REGEX =
  /^(const|let|var|function|return|if|else|switch|case|break|for|while|do|try|catch|finally|throw|class|extends|import|export|from|default|async|await|typeof|instanceof|new|this|super|public|private|protected|static|final|void|int|double|float|long|boolean|char|byte|short|record|interface|implements|package)$/;
const BOOLEAN_NULL_REGEX = /^(true|false|null|undefined)$/;
const STRING_PREFIX_REGEX = /^["'`]/;
const COMMENT_PREFIX_REGEX = /^\/\//;
const NUMBER_REGEX = /^\d+$/;
const OPERATOR_REGEX = /^[+\-*/%=<>!&|^~?:.,;]$/;
const BRACKET_REGEX = /^[{}()[\]]$/;

// Lightweight syntax token highlight for JS / Java / web code
function highlightSyntax(rawCode: string, lang: string): React.ReactNode[] {
  const cacheKey = `${lang}:${rawCode}`;
  if (highlightCache.has(cacheKey)) {
    return highlightCache.get(cacheKey)!;
  }

  const lines = rawCode.split('\n');

  const renderedLines = lines.map((line, lineIdx) => {
    if (COMMENT_REGEX.test(line)) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs">
            {lineIdx + 1}
          </span>
          <span className="table-cell text-slate-500 italic">{line}</span>
        </div>
      );
    }

    const tokens = line.split(TOKEN_SPLIT_REGEX);

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs font-mono">
          {lineIdx + 1}
        </span>
        <span className="table-cell font-mono whitespace-pre">
          {tokens.map((token, tokIdx) => {
            if (!token) return null;

            if (KEYWORD_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-purple-400 font-semibold">
                  {token}
                </span>
              );
            }
            if (BOOLEAN_NULL_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-amber-400 font-semibold">
                  {token}
                </span>
              );
            }
            if (STRING_PREFIX_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-emerald-300">
                  {token}
                </span>
              );
            }
            if (COMMENT_PREFIX_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-slate-500 italic">
                  {token}
                </span>
              );
            }
            if (NUMBER_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-cyan-300">
                  {token}
                </span>
              );
            }
            if (OPERATOR_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-indigo-300">
                  {token}
                </span>
              );
            }
            if (BRACKET_REGEX.test(token)) {
              return (
                <span key={tokIdx} className="text-slate-400">
                  {token}
                </span>
              );
            }

            return <React.Fragment key={tokIdx}>{token}</React.Fragment>;
          })}
        </span>
      </div>
    );
  });

  // LRU cache eviction
  if (highlightCache.size >= HIGHLIGHT_CACHE_LIMIT) {
    const firstKey = highlightCache.keys().next().value;
    if (firstKey) highlightCache.delete(firstKey);
  }
  highlightCache.set(cacheKey, renderedLines);

  return renderedLines;
}

export const LessonCodeBlock = React.memo(function LessonCodeBlock({
  code,
  language = 'javascript',
}: LessonCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const displayLang =
    language.toLowerCase() === 'js'
      ? 'JavaScript'
      : language.toLowerCase() === 'ts'
        ? 'TypeScript'
        : language.toUpperCase();

  const renderedTokens = useMemo(
    () => highlightSyntax(code, language),
    [code, language]
  );

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-xl group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono font-semibold text-slate-300">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium border border-slate-700/60"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Highlighted Code Lines Display */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed select-text">
        <div className="table w-full">{renderedTokens}</div>
      </div>
    </div>
  );
});
