'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { TocNode } from '@/lib/study-section-builder';

interface LessonTocProps {
  items: TocNode[];
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
      const yOffset = -90; // Header offset
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

      {/* Hierarchical TOC Item List */}
      <nav
        className={`${isOpenMobile ? 'block' : 'hidden'} sm:block p-3 sm:p-4 max-h-[75vh] overflow-y-auto space-y-1 text-xs select-none`}
        aria-label="Table of contents"
      >
        {items.map((h2Item) => {
          const isH2Active = currentActiveId === h2Item.id;
          const hasChildren = Boolean(h2Item.children && h2Item.children.length > 0);

          return (
            <div key={h2Item.id} className="space-y-0.5 pt-2 first:pt-0">
              {/* Major H2 Section */}
              <a
                href={`#${h2Item.id}`}
                onClick={(e) => handleScrollTo(h2Item.id, e)}
                className={`flex items-center py-1 px-2 rounded-md transition-all text-left truncate font-semibold text-[13px] tracking-tight ${
                  isH2Active
                    ? 'text-indigo-300 bg-indigo-500/15'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/50'
                }`}
                title={h2Item.title}
              >
                <span className="truncate">{h2Item.title}</span>
              </a>

              {/* Nested H3 Subsections */}
              {hasChildren && (
                <div className="ml-2.5 pl-2 border-l border-slate-800/80 space-y-0.5 mt-0.5">
                  {h2Item.children!.map((h3Item) => {
                    const isH3Active = currentActiveId === h3Item.id;
                    return (
                      <a
                        key={h3Item.id}
                        href={`#${h3Item.id}`}
                        onClick={(e) => handleScrollTo(h3Item.id, e)}
                        className={`block py-1 px-2 rounded transition-all text-left truncate text-[12px] ${
                          isH3Active
                            ? 'text-indigo-300 font-medium bg-indigo-500/15 -ml-[9px] border-l-2 border-indigo-500 pl-[15px]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                        title={h3Item.title}
                      >
                        {h3Item.title}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
