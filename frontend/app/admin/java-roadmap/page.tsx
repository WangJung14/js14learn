'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Coffee,
  BookOpen,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { JAVA_ROADMAP_DAYS } from '@/lib/roadmaps/java-roadmap-data';
import { getJavaDayContent, saveJavaDayContent, resetJavaDayContent } from '@/lib/roadmaps/java-content-store';
import { AdminLessonEditor } from '@/components/lessons/admin-lesson-editor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminJavaRoadmapPage() {
  const [selectedDayId, setSelectedDayId] = useState<string>(JAVA_ROADMAP_DAYS[0].id);
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedDay = JAVA_ROADMAP_DAYS.find((d) => d.id === selectedDayId) || JAVA_ROADMAP_DAYS[0];

  useEffect(() => {
    const loadedContent = getJavaDayContent(selectedDay.id);
    setContent(loadedContent);
  }, [selectedDay.id]);

  const handleSave = async (newContent: string) => {
    setSaving(true);
    try {
      saveJavaDayContent(selectedDay.id, newContent);
      setContent(newContent);
      setToastMessage(`Đã lưu tài liệu bài học DAY ${selectedDay.dayNumber} thành công!`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm(`Bạn có chắc muốn đặt lại tài liệu của DAY ${selectedDay.dayNumber} về cấu trúc mặc định theo roadmap?`)) {
      const defaultContent = resetJavaDayContent(selectedDay.id);
      setContent(defaultContent);
      setToastMessage(`Đã khôi phục tài liệu DAY ${selectedDay.dayNumber} về mẫu mặc định.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-2 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang Admin Overview</span>
          </Link>
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Biên Soạn Tài Liệu Java Core Roadmap (30 Days)
              </h1>
              <p className="text-xs text-slate-400">
                Quản lý và biên soạn tài liệu lý thuyết, chuyên đề cho từng Day & Topic theo cấu trúc Level 1 → Level 2 → Level 3
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/roadmap/java/${selectedDay.id}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs border-slate-700 hover:border-indigo-500/40">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              <span>Xem Giao Diện Học Viên</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            title="Khôi phục lại template bài học chuẩn"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Mẫu Chuẩn</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 30-Day Curriculum Selector & Topics Hierarchy */}
        <div className="lg:col-span-4 space-y-4">
          {/* Day Selector Card */}
          <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
            <CardHeader className="p-4 border-b border-slate-800/60 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Chọn Ngày Học (30 Days)</span>
                </CardTitle>
                <span className="text-[10px] font-mono text-slate-400">
                  {JAVA_ROADMAP_DAYS.length} Days / 7 Phases
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-3 max-h-[340px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {JAVA_ROADMAP_DAYS.map((day) => {
                const isSelected = day.id === selectedDay.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDayId(day.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-md shadow-indigo-600/10'
                        : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate pr-2">
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-indigo-500/30 text-indigo-200'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        D{String(day.dayNumber).padStart(2, '0')}
                      </span>
                      <span className="truncate">{day.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                      {day.topics.length} topics
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Current Selected Day Syllabus Tree */}
          <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
            <CardHeader className="p-4 border-b border-slate-800/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <CardTitle className="text-sm font-bold text-slate-200">
                    Cấu Trúc Chuyên Đề DAY {selectedDay.dayNumber}
                  </CardTitle>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{selectedDay.title}</p>
              </div>
            </CardHeader>

            <CardContent className="p-3 max-h-[380px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
              {selectedDay.topics.map((topic, tIdx) => (
                <div key={topic.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      T{tIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{topic.title}</span>
                  </div>

                  <ul className="pl-4 space-y-1 border-l border-slate-800 text-[11px] text-slate-400">
                    {topic.subtopics.map((sub) => (
                      <li key={sub.id} className="leading-snug list-disc ml-2">
                        <span>{sub.title}</span>
                        {sub.tags.length > 0 && (
                          <span className="ml-1.5 text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-indigo-300">
                            {sub.tags.join(', ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Markdown Lesson Content Editor */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-slate-900/60 border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  DAY {String(selectedDay.dayNumber).padStart(2, '0')} • {selectedDay.phaseTitle}
                </span>
                <h2 className="text-lg font-bold text-slate-100">{selectedDay.title}</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {selectedDay.totalSubtopics} Subtopics trong bài học
              </span>
            </div>

            <AdminLessonEditor
              key={selectedDay.id}
              initialContent={content}
              lessonTitle={selectedDay.title}
              dayNumber={selectedDay.dayNumber}
              onSave={handleSave}
              isSaving={saving}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
