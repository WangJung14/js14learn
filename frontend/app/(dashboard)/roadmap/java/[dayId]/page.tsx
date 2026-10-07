'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  FileText,
} from 'lucide-react';
import { JAVA_ROADMAP_DAYS, getJavaDayById } from '@/lib/roadmaps/java-roadmap-data';
import { getJavaDayContent } from '@/lib/roadmaps/java-content-store';
import { LessonContentRenderer } from '@/components/lessons/lesson-content-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';

const CHECKLIST_STORAGE_PREFIX = 'study_hub_java_day_checklist_v1_';

export default function JavaDayDetailPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = use(params);
  const day = getJavaDayById(dayId);

  const [lessonContent, setLessonContent] = useState<string>('');
  const [showCurriculumSyllabus, setShowCurriculumSyllabus] = useState(true);

  // Separate Checklist items for this study day
  const [checklistCompleted, setChecklistCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!day) return;
    const content = getJavaDayContent(day.id);
    setLessonContent(content);

    // Load checklist state
    try {
      const stored = localStorage.getItem(`${CHECKLIST_STORAGE_PREFIX}${day.id}`);
      if (stored) {
        setChecklistCompleted(JSON.parse(stored));
      }
    } catch {
      // Ignore storage error
    }
  }, [day]);

  const defaultChecklistItems = [
    { id: 'read_theory', title: 'Đọc và nghiên cứu toàn bộ tài liệu lý thuyết của ngày học', type: 'LESSON' },
    { id: 'run_examples', title: 'Thực hành gõ và chạy thử các ví dụ mã nguồn mẫu', type: 'EXERCISE' },
    { id: 'master_topics', title: `Nắm vững ${day?.topics.length || 0} chuyên đề trọng tâm và các thuật ngữ Java Core`, type: 'CHECKPOINT' },
    { id: 'summary_notes', title: 'Tự tổng kết các quy tắc cốt lõi và ghi chú vào sổ tay lập trình', type: 'CUSTOM' },
  ];

  const toggleChecklistItem = (itemId: string) => {
    if (!day) return;
    setChecklistCompleted((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem(`${CHECKLIST_STORAGE_PREFIX}${day.id}`, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  if (!day) {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-bold">Java Study Day Not Found</h2>
        <p>The requested Java curriculum day could not be found.</p>
        <Link href="/roadmap?track=java">
          <Button variant="outline" size="sm">
            Back to Java Roadmap
          </Button>
        </Link>
      </div>
    );
  }

  const prevDay = day.dayNumber > 1 ? JAVA_ROADMAP_DAYS[day.dayNumber - 2] : null;
  const nextDay = day.dayNumber < JAVA_ROADMAP_DAYS.length ? JAVA_ROADMAP_DAYS[day.dayNumber] : null;

  const completedChecklistCount = defaultChecklistItems.filter((i) => checklistCompleted[i.id]).length;
  const checklistPercentage = Math.round((completedChecklistCount / defaultChecklistItems.length) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/roadmap?track=java"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Java Core Roadmap</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link href="/admin/java-roadmap">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              <span>Biên Soạn Tài Liệu (Admin)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-lg border border-indigo-500/30 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-indigo-400" />
            <span>DAY {String(day.dayNumber).padStart(2, '0')}</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
            {day.phaseTitle}
          </span>
          <Badge variant={checklistPercentage === 100 ? 'COMPLETED' : checklistPercentage > 0 ? 'IN_PROGRESS' : 'LOCKED'} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{day.title}</h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">{day.description}</p>
      </div>

      {/* SECTION 1: CURRICULUM SYLLABUS / TOPIC BREAKDOWN (Mục Lục Chuyên Đề & Subtopics) */}
      <Card className="border-slate-800/80 bg-slate-900/60 overflow-hidden">
        <CardHeader
          className="p-5 bg-slate-950/40 border-b border-slate-800/60 flex flex-row items-center justify-between cursor-pointer select-none"
          onClick={() => setShowCurriculumSyllabus(!showCurriculumSyllabus)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Khung Chương Trình & Chuyên Đề Bài Học</span>
                <span className="text-xs font-mono text-slate-400 font-normal">
                  ({day.topics.length} Topics • {day.totalSubtopics} Subtopics)
                </span>
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu trúc phân cấp chuẩn Level 1 (DAY) → Level 2 (TOPIC) → Level 3 (SUBTOPIC)
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {showCurriculumSyllabus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </CardHeader>

        {showCurriculumSyllabus && (
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {day.topics.map((topic, tIdx) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      Topic #{tIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{topic.title}</h4>
                  </div>

                  <ul className="space-y-1.5 pl-2 text-xs text-slate-300">
                    {topic.subtopics.map((sub) => (
                      <li key={sub.id} className="flex items-start space-x-2 leading-relaxed">
                        <span className="text-indigo-400 font-mono mt-0.5">•</span>
                        <div className="flex-1 flex flex-wrap items-center gap-1.5">
                          <span>{sub.title}</span>
                          {sub.tags && sub.tags.length > 0 && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {sub.tags.join(', ')}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* SECTION 2: RICH LESSON THEORY DOCUMENTATION (Tài Liệu Bài Học) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Tài Liệu Bài Học & Lý Thuyết Chi Tiết</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Interactive Documentation Reader
          </span>
        </div>

        {lessonContent ? (
          <LessonContentRenderer
            content={lessonContent}
            title={day.title}
            dayNumber={day.dayNumber}
            showTocSidebar={true}
          />
        ) : (
          <Card className="p-8 text-center text-slate-400 text-sm">
            Đang tải tài liệu bài học...
          </Card>
        )}
      </div>

      {/* SECTION 3: STUDY DAY CHECKLIST (Phần Kiểm Tra Tiến Độ Riêng Biệt) */}
      <Card className="border-slate-800/80 bg-slate-900/70">
        <CardHeader className="p-5 border-b border-slate-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-100">
                  Nhiệm Vụ & Checklist Hoàn Thành Day {day.dayNumber}
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đánh dấu các mục tiêu học tập bạn đã hoàn thành trong ngày
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right space-y-1">
                <span className="text-xs text-slate-300 font-bold font-mono">
                  {completedChecklistCount} / {defaultChecklistItems.length} ({checklistPercentage}%)
                </span>
                <div className="w-28">
                  <ProgressBar value={checklistPercentage} showLabel={false} />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-2.5">
          {defaultChecklistItems.map((item) => {
            const isChecked = !!checklistCompleted[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/30 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {item.title}
                  </span>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.type}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Prev / Next Day Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
        {prevDay ? (
          <Link href={`/roadmap/java/${prevDay.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full justify-start space-x-2 border-slate-800 hover:border-indigo-500/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left truncate">
                <span className="text-[10px] text-slate-500 block">PREVIOUS DAY {prevDay.dayNumber}</span>
                <span className="text-xs font-semibold truncate">{prevDay.title}</span>
              </div>
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextDay ? (
          <Link href={`/roadmap/java/${nextDay.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full justify-end space-x-2 border-slate-800 hover:border-indigo-500/40 text-right"
            >
              <div className="text-right truncate">
                <span className="text-[10px] text-slate-500 block">NEXT DAY {nextDay.dayNumber}</span>
                <span className="text-xs font-semibold truncate">{nextDay.title}</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
