'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface LessonCodeBlockProps {
  code: string;
  language?: string;
}

// Lightweight syntax token highlight for JS / web code
function highlightSyntax(rawCode: string): React.ReactNode[] {
  const lines = rawCode.split('\n');

  return lines.map((line, lineIdx) => {
    // Basic regex-based token highlighting for read-only educational snippets
    // 1. Comments
    if (/^\s*\/\//.test(line)) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs">
            {lineIdx + 1}
          </span>
          <span className="table-cell text-slate-500 italic">{line}</span>
        </div>
      );
    }

    const tokens = line.split(
      /(\b(?:const|let|var|function|return|if|else|switch|case|break|for|while|do|try|catch|finally|throw|class|extends|import|export|from|default|async|await|typeof|instanceof|new|this|super|null|undefined|true|false)\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|\b\d+\b|[{}()[\].,;+\-*/%=<>!&|^~?:])/g,
    );

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell pr-4 select-none text-slate-600 text-right w-8 text-xs font-mono">
          {lineIdx + 1}
        </span>
        <span className="table-cell font-mono whitespace-pre">
          {tokens.map((token, tokIdx) => {
            if (!token) return null;

            // Keywords
            if (
              /^(const|let|var|function|return|if|else|switch|case|break|for|while|do|try|catch|finally|throw|class|extends|import|export|from|default|async|await|typeof|instanceof|new|this|super)$/.test(
                token,
              )
            ) {
              return (
                <span key={tokIdx} className="text-purple-400 font-semibold">
                  {token}
                </span>
              );
            }
            // Booleans & Null
            if (/^(true|false|null|undefined)$/.test(token)) {
              return (
                <span key={tokIdx} className="text-amber-400 font-semibold">
                  {token}
                </span>
              );
            }
            // Strings
            if (/^["'`]/.test(token)) {
              return (
                <span key={tokIdx} className="text-emerald-300">
                  {token}
                </span>
              );
            }
            // Comments at end of line
            if (/^\/\//.test(token)) {
              return (
                <span key={tokIdx} className="text-slate-500 italic">
                  {token}
                </span>
              );
            }
            // Numbers
            if (/^\d+$/.test(token)) {
              return (
                <span key={tokIdx} className="text-cyan-300">
                  {token}
                </span>
              );
            }
            // Operators & Punctuation
            if (/^[+\-*/%=<>!&|^~?:.,;]$/.test(token)) {
              return (
                <span key={tokIdx} className="text-indigo-300">
                  {token}
                </span>
              );
            }
            // Brackets
            if (/^[{}()[\]]$/.test(token)) {
              return (
                <span key={tokIdx} className="text-slate-400">
                  {token}
                </span>
              );
            }

            return <span key={tokIdx} className="text-slate-200">{token}</span>;
          })}
        </span>
      </div>
    );
  });
}

export function LessonCodeBlock({ code, language = 'javascript' }: LessonCodeBlockProps) {
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

  const displayLang = language.toLowerCase() === 'js' ? 'JavaScript' : language.toUpperCase();

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-xl group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs">
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

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
        <div className="table w-full border-collapse">
          {highlightSyntax(code)}
        </div>
      </div>
    </div>
  );
}
