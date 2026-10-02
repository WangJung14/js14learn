'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { TocItem } from '@/lib/markdown-parser';

interface LessonTocProps {
  items: TocItem[];
  activeId?: string;
  onSelectSection?: (id: string) => void;
  className?: string;
}

export function LessonToc({ items, activeId, onSelectSection, className = '' }: LessonTocProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [currentActiveId, setCurrentActiveId] = useState<string>(activeId || (items[0]?.id ?? ''));

  useEffect(() => {
    if (activeId) {
      setCurrentActiveId(activeId);
    }
  }, [activeId]);

  if (!items || items.length === 0) return null;

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentActiveId(id);
    if (onSelectSection) {
      onSelectSection(id);
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Header offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden ${className}`}>
      {/* Mobile Toggle Header */}
      <div className="flex sm:hidden items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <List className="w-4 h-4 text-indigo-400" />
          <span>Table of Contents ({items.length})</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1 rounded-md text-slate-400 hover:text-white"
          aria-expanded={isOpenMobile}
          aria-label="Toggle table of contents"
        >
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:flex items-center space-x-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <List className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          On This Page
        </span>
      </div>

      {/* TOC Item List */}
      <nav
        className={`${isOpenMobile ? 'block' : 'hidden'} sm:block p-3 sm:p-4 max-h-[70vh] overflow-y-auto space-y-1 text-xs`}
        aria-label="Table of contents"
      >
        {items.map((item, idx) => {
          const isActive = currentActiveId === item.id;
          const isH3 = item.level === 3;

          return (
            <a
              key={`${item.id}-${idx}`}
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(item.id, e)}
              className={`block rounded-lg px-2.5 py-1.5 transition-all text-left truncate ${
                isH3 ? 'pl-6 text-[11px]' : 'font-medium'
              } ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-2'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
