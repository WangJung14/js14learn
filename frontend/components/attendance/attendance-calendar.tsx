'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Attendance } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceCalendarProps {
  records: Attendance[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);

  const activeDatesMap = new Map<string, Attendance>();
  records.forEach((r) => {
    activeDatesMap.set(r.date, r);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="border-slate-800/80 bg-slate-900/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <CardTitle className="text-lg font-bold text-slate-100">
            Attendance Calendar
          </CardTitle>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-slate-200">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 text-slate-400 hover:text-white bg-slate-950 rounded border border-slate-800"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 text-slate-400 hover:text-white bg-slate-950 rounded border border-slate-800"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty padding slots */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 rounded-lg bg-slate-950/20" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const formattedDayStr = String(dayNum).padStart(2, '0');
            const formattedMonthStr = String(month + 1).padStart(2, '0');
            const dateKey = `${year}-${formattedMonthStr}-${formattedDayStr}`;

            const record = activeDatesMap.get(dateKey);
            const isAttended = Boolean(record);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => isAttended && setSelectedRecord(record || null)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-medium ${
                  isAttended
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-sm cursor-pointer'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800/60 cursor-default'
                }`}
              >
                <span>{dayNum}</span>
                {isAttended && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Record Detail Callout */}
        {selectedRecord && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs mt-2 animate-in fade-in">
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-400">
                Study Attendance on {selectedRecord.date}
              </span>
              <p className="text-slate-300">
                Checked in: {new Date(selectedRecord.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {selectedRecord.checkedOutAt
                  ? ` → Checked out: ${new Date(selectedRecord.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : ' (Studying now)'}
              </p>
            </div>

            <div className="text-right font-mono font-bold text-slate-200">
              {selectedRecord.durationMinutes > 0
                ? `${selectedRecord.durationMinutes} minutes`
                : 'Active session'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
