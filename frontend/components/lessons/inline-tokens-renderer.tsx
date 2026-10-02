'use client';

import React from 'react';
import Link from 'next/link';
import { InlineToken } from '@/lib/markdown-parser';

interface InlineTokensRendererProps {
  tokens: InlineToken[];
}

export function InlineTokensRenderer({ tokens }: InlineTokensRendererProps) {
  if (!tokens || tokens.length === 0) return null;

  return (
    <>
      {tokens.map((token, idx) => {
        switch (token.type) {
          case 'bold':
            return (
              <strong key={idx} className="font-bold text-slate-100">
                {token.content}
              </strong>
            );
          case 'italic':
            return (
              <em key={idx} className="italic text-slate-200">
                {token.content}
              </em>
            );
          case 'code':
            return (
              <code
                key={idx}
                className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-indigo-300 font-mono text-[13px] font-semibold"
              >
                {token.content}
              </code>
            );
          case 'link':
            return (
              <Link
                key={idx}
                href={token.href || '#'}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/50 hover:decoration-indigo-400 transition-colors"
                target={token.href?.startsWith('http') ? '_blank' : undefined}
                rel={token.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {token.content}
              </Link>
            );
          case 'text':
          default:
            return <span key={idx}>{token.content}</span>;
        }
      })}
    </>
  );
}
