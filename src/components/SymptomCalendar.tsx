import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Plus, X, AlertCircle, Clock, CheckCircle2, Filter } from 'lucide-react';
import { TimelineItem, RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';

interface SymptomCalendarProps {
  timeline: TimelineItem[];
  onAddTimelineItem?: (item: Omit<TimelineItem, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onUpdateTimelineStatus?: (id: string, status: 'active' | 'resolved' | 'monitoring') => void;
  onDeleteTimelineItem?: (id: string) => void;
}

export const SymptomCalendar: React.FC<SymptomCalendarProps> = ({
  timeline,
  onAddTimelineItem,
  onUpdateTimelineStatus,
  onDeleteTimelineItem,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [isAddingForSelectedDate, setIsAddingForSelectedDate] = useState(false);
  const [newSymptomTitle, setNewSymptomTitle] = useState('');
  const [newSymptomRisk, setNewSymptomRisk] = useState<RiskLevel>('monitor');
  const [newSymptomDetails, setNewSymptomDetails] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar Math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateKey(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateKey(null);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDateKey(key);
  };

  // Helper to format date key YYYY-MM-DD
  const formatDateKey = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  // Map timeline items by date key (YYYY-MM-DD)
  const symptomsByDateMap: Record<string, TimelineItem[]> = {};

  timeline.forEach((item) => {
    let itemDate: Date;
    if (item.timestamp) {
      itemDate = new Date(item.timestamp);
    } else {
      itemDate = new Date();
    }
    const dateKey = formatDateKey(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    if (!symptomsByDateMap[dateKey]) {
      symptomsByDateMap[dateKey] = [];
    }
    symptomsByDateMap[dateKey].push(item);
  });

  // Today key
  const todayObj = new Date();
  const todayKey = formatDateKey(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

  // Count items for current month
  const monthSymptomsCount = Object.entries(symptomsByDateMap).reduce((acc, [key, items]) => {
    const [yStr, mStr] = key.split('-');
    if (parseInt(yStr, 10) === year && parseInt(mStr, 10) === month + 1) {
      return acc + items.length;
    }
    return acc;
  }, 0);

  // Get symptoms for selected date
  const selectedDateSymptoms = selectedDateKey ? (symptomsByDateMap[selectedDateKey] || []) : [];

  const handleAddSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptomTitle.trim() || !onAddTimelineItem) return;

    onAddTimelineItem({
      symptom: newSymptomTitle.trim(),
      riskLevel: newSymptomRisk,
      details: newSymptomDetails.trim() || 'Logged via Health Records Calendar.',
      status: 'monitoring',
    });

    setNewSymptomTitle('');
    setNewSymptomDetails('');
    setIsAddingForSelectedDate(false);
  };

  // Generate calendar grid cells
  const cells: { dayNum: number; monthOffset: -1 | 0 | 1; dateKey: string; isToday: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const key = formatDateKey(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), prevMonthDate.getDate());
    cells.push({
      dayNum: d,
      monthOffset: -1,
      dateKey: key,
      isToday: key === todayKey,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const key = formatDateKey(year, month, d);
    cells.push({
      dayNum: d,
      monthOffset: 0,
      dateKey: key,
      isToday: key === todayKey,
    });
  }

  // Next month leading days to complete week rows
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const key = formatDateKey(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), nextMonthDate.getDate());
    cells.push({
      dayNum: d,
      monthOffset: 1,
      dateKey: key,
      isToday: key === todayKey,
    });
  }

  return (
    <div className="w-full space-y-5">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Symptom Calendar Log
            </h3>
            <p className="text-xs text-slate-300">
              Severity-coded calendar tracking symptom occurrences and risk trends
            </p>
          </div>
        </div>

        {/* Severity Legend */}
        <div className="flex items-center gap-3 text-[11px] bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-slate-300">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-slate-300">Monitor</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="text-slate-300">See Doctor</span>
          </div>
        </div>
      </div>

      {/* Month Navigation & Grid */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/15 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-extrabold text-white">
              {monthNames[month]} {year}
            </h4>
            {monthSymptomsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-semibold">
                {monthSymptomsCount} {monthSymptomsCount === 1 ? 'symptom' : 'symptoms'} logged
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors mr-1"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-1 border-b border-white/10">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Month Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, idx) => {
            const daySymptoms = symptomsByDateMap[cell.dateKey] || [];
            const isSelected = selectedDateKey === cell.dateKey;
            const isCurrentMonth = cell.monthOffset === 0;

            // Highest severity among day's symptoms for border styling
            let highestRisk: RiskLevel | null = null;
            if (daySymptoms.length > 0) {
              if (daySymptoms.some((s) => s.riskLevel === 'see_doctor')) {
                highestRisk = 'see_doctor';
              } else if (daySymptoms.some((s) => s.riskLevel === 'monitor')) {
                highestRisk = 'monitor';
              } else {
                highestRisk = 'low';
              }
            }

            return (
              <button
                key={`${cell.dateKey}-${idx}`}
                onClick={() => setSelectedDateKey(cell.dateKey)}
                className={`min-h-[58px] sm:min-h-[64px] p-1.5 rounded-2xl flex flex-col items-center justify-between transition-all relative group border text-left ${
                  !isCurrentMonth
                    ? 'opacity-35 bg-white/[0.02] border-transparent text-slate-500'
                    : isSelected
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.02] z-10'
                    : cell.isToday
                    ? 'bg-sky-500/15 border-sky-400/50 text-white'
                    : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10 text-slate-200'
                }`}
              >
                {/* Date Number */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      cell.isToday
                        ? 'bg-sky-400 text-slate-950 font-bold'
                        : isSelected
                        ? 'text-purple-300 font-extrabold'
                        : ''
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {daySymptoms.length > 0 && (
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-white">
                      {daySymptoms.length}
                    </span>
                  )}
                </div>

                {/* Severity Dots */}
                <div className="w-full flex items-center justify-center gap-1 mt-1 min-h-[12px]">
                  {daySymptoms.slice(0, 3).map((symptom, sIdx) => {
                    const dotBg =
                      symptom.riskLevel === 'see_doctor'
                        ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]'
                        : symptom.riskLevel === 'monitor'
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                        : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]';

                    return (
                      <span
                        key={`${symptom.id}-${sIdx}`}
                        className={`w-2 h-2 rounded-full ${dotBg} transition-transform group-hover:scale-125`}
                        title={`${symptom.symptom} (${symptom.riskLevel})`}
                      />
                    );
                  })}
                  {daySymptoms.length > 3 && (
                    <span className="text-[8px] text-slate-400 font-mono font-bold">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <AnimatePresence mode="wait">
        {selectedDateKey && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-purple-400/30 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">
                  Symptoms for <span className="text-purple-300 font-mono">{selectedDateKey}</span>
                </h4>
                <span className="text-xs text-slate-400">
                  ({selectedDateSymptoms.length} logged)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onAddTimelineItem && (
                  <button
                    onClick={() => setIsAddingForSelectedDate(!isAddingForSelectedDate)}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Symptom</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedDateKey(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Add Form for Selected Date */}
            {isAddingForSelectedDate && (
              <form onSubmit={handleAddSymptomSubmit} className="p-4 rounded-2xl bg-white/5 border border-purple-400/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-300">Add Symptom Entry for {selectedDateKey}</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingForSelectedDate(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newSymptomTitle}
                      onChange={(e) => setNewSymptomTitle(e.target.value)}
                      placeholder="Symptom name (e.g., Mild Cough, Dizziness)..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <select
                      value={newSymptomRisk}
                      onChange={(e) => setNewSymptomRisk(e.target.value as RiskLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="low">Low Concern</option>
                      <option value="monitor">Monitor</option>
                      <option value="see_doctor">See Doctor</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={newSymptomDetails}
                  onChange={(e) => setNewSymptomDetails(e.target.value)}
                  placeholder="Notes or details (e.g. onset after dinner, lasted 2 hours)..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 resize-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl glass-button-glow text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Entry
                  </button>
                </div>
              </form>
            )}

            {/* List of Symptoms on Selected Date */}
            {selectedDateSymptoms.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDateSymptoms.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{item.symptom}</span>
                        <RiskBadge level={item.riskLevel} />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 capitalize">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {onUpdateTimelineStatus && (
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateTimelineStatus(item.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg bg-slate-950 border border-white/15 text-[11px] text-slate-300 focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="monitoring">Monitoring</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      )}

                      {onDeleteTimelineItem && (
                        <button
                          onClick={() => onDeleteTimelineItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete symptom log"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <Info className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                <p>No symptoms logged for this date.</p>
                {onAddTimelineItem && (
                  <button
                    onClick={() => setIsAddingForSelectedDate(true)}
                    className="text-purple-300 hover:underline font-semibold text-xs mt-1 inline-block"
                  >
                    + Add a symptom entry for {selectedDateKey}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
