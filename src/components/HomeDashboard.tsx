import React, { useState } from 'react';
import {
  Heart,
  Thermometer,
  Activity,
  Wind,
  TrendingUp,
  RefreshCw,
  Plus,
  AlertCircle,
  FileText,
  Pill,
  Clock,
  ChevronRight,
  Eye,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { UserProfile, HealthMetricPoint, TimelineItem, MedicineScanResult, NavTab } from '../types';

interface HomeDashboardProps {
  userProfile: UserProfile;
  healthMetrics: HealthMetricPoint[];
  timeline: TimelineItem[];
  scannedMedicines: MedicineScanResult[];
  setActiveTab: (tab: NavTab) => void;
  onLogVitalsClick: () => void;
  onOpenDoctorSummary: () => void;
  onSyncData?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  healthMetrics,
  timeline,
  scannedMedicines,
  setActiveTab,
  onLogVitalsClick,
  onOpenDoctorSummary,
  onSyncData,
}) => {
  const [trendDays, setTrendDays] = useState<7 | 30 | 90>(7);
  const [selectedMetrics, setSelectedMetrics] = useState({
    heartRate: true,
    bloodPressure: true,
    spO2: true,
  });

  // Get current vital readings from latest health metric point or defaults
  const latestMetric = healthMetrics[healthMetrics.length - 1] || {
    heartRate: 67,
    temperature: 98.3,
    systolic: 115,
    diastolic: 75,
    spO2: 98,
    readinessScore: 95,
  };

  // Sample static fallback reports for "RECENT REPORTS"
  const recentReports = [
    { id: 'rep-1', name: 'Blood Test Report', date: 'May 10, 2026', status: 'Completed', type: 'Lab Work' },
    { id: 'rep-2', name: 'Chest X-Ray', date: 'Apr 28, 2026', status: 'Normal', type: 'Imaging' },
    { id: 'rep-3', name: 'ECG Report', date: 'Apr 15, 2026', status: 'Normal', type: 'Cardiology' },
  ];

  // Prepare chart dataset based on filter
  const chartData = (healthMetrics.length > 0 ? healthMetrics : [
    { date: 'May 8', heartRate: 72, systolic: 120, diastolic: 80, spO2: 97 },
    { date: 'May 9', heartRate: 70, systolic: 118, diastolic: 78, spO2: 98 },
    { date: 'May 10', heartRate: 68, systolic: 116, diastolic: 76, spO2: 98 },
    { date: 'May 11', heartRate: 69, systolic: 117, diastolic: 77, spO2: 99 },
    { date: 'May 12', heartRate: 66, systolic: 115, diastolic: 75, spO2: 98 },
    { date: 'May 13', heartRate: 68, systolic: 116, diastolic: 76, spO2: 98 },
    { date: 'May 14', heartRate: 67, systolic: 115, diastolic: 75, spO2: 98 },
  ]).slice(-trendDays);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, {userProfile.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your health overview for today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSyncData}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Sync Data</span>
          </button>

          <button
            onClick={onLogVitalsClick}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Vitals</span>
          </button>
        </div>
      </div>

      {/* Four Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Heart Rate</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {latestMetric.heartRate} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">bpm</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              Normal
            </span>
          </div>
        </div>

        {/* Temperature */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Temperature</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {latestMetric.temperature}°F
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              Normal
            </span>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Blood Pressure</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {latestMetric.systolic}/{latestMetric.diastolic} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">mmHg</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              Normal
            </span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">SpO₂ Oxygen</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {latestMetric.spO2}%
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              Normal
            </span>
          </div>
        </div>
      </div>

      {/* HEALTH TRENDS Chart + AI HEALTH INSIGHTS Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 cols on desktop) */}
        <div className="lg:col-span-2 saas-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                HEALTH TRENDS
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Continuous physiological metric tracking
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {([7, 30, 90] as const).map((days) => (
                <button
                  key={days}
                  onClick={() => setTrendDays(days)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    trendDays === days
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Metric Toggles */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-800 dark:text-slate-200">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMetrics.heartRate}
                onChange={(e) =>
                  setSelectedMetrics((prev) => ({ ...prev, heartRate: e.target.checked }))
                }
                className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-indigo-600 focus:ring-0"
              />
              <span>Heart Rate</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMetrics.bloodPressure}
                onChange={(e) =>
                  setSelectedMetrics((prev) => ({ ...prev, bloodPressure: e.target.checked }))
                }
                className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sky-500 focus:ring-0"
              />
              <span>Blood Pressure</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMetrics.spO2}
                onChange={(e) =>
                  setSelectedMetrics((prev) => ({ ...prev, spO2: e.target.checked }))
                }
                className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-emerald-500 focus:ring-0"
              />
              <span>SpO₂</span>
            </label>
          </div>

          {/* Clean Line Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" stroke="#334155" fontSize={11} fontWeight={600} tickLine={false} className="dark:stroke-slate-300" />
                <YAxis stroke="#334155" fontSize={11} fontWeight={600} tickLine={false} domain={['auto', 'auto']} className="dark:stroke-slate-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600', paddingTop: '8px' }} />
                {selectedMetrics.heartRate && (
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    name="Heart Rate (bpm)"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4f46e5' }}
                  />
                )}
                {selectedMetrics.bloodPressure && (
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    name="Blood Pressure (Systolic)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7' }}
                  />
                )}
                {selectedMetrics.spO2 && (
                  <Line
                    type="monotone"
                    dataKey="spO2"
                    name="SpO₂ (%)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#059669' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI HEALTH INSIGHTS (Compact Card) */}
        <div className="saas-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                AI Health Insights
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                "Your vitals are stable and showing normal patterns."
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Heart rate (67 bpm) and blood pressure (115/75 mmHg) are currently matching your baseline average.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Resting heart rate has remained consistent at 65–68 bpm this week.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Oxygen saturation (98%) indicates optimal respiratory function.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>No active fever or abnormal physiological spikes detected.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('assistant')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Ask Aura Health Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Symptoms, Medications, Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT SYMPTOMS */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              RECENT SYMPTOMS
            </h3>
            <button
              onClick={() => setActiveTab('symptoms')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Assess</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* HEADACHE */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
                  Headache
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">May 14 • 9:30 AM</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                Mild
              </span>
            </div>

            {/* FATIGUE */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
                  Fatigue
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">May 13 • 7:15 PM</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                Moderate
              </span>
            </div>

            {/* SORE THROAT */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
                  Sore Throat
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">May 12 • 6:40 PM</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                Mild
              </span>
            </div>
          </div>
        </div>

        {/* MEDICATIONS */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              MEDICATIONS
            </h3>
            <button
              onClick={() => setActiveTab('medications')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {scannedMedicines.length > 0 ? (
              scannedMedicines.slice(0, 3).map((med) => (
                <div key={med.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{med.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                      {med.strength}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{med.dosage}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                    <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>8:00 AM, 4:00 PM, 12:00 AM</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Amoxicillin Trihydrate</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                    500 mg
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">1 capsule every 8 hours after meals</p>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                  <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>8:00 AM, 4:00 PM, 12:00 AM</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT REPORTS */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              RECENT REPORTS
            </h3>
            <button
              onClick={onOpenDoctorSummary}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Export</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{report.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {report.date}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 font-mono">
                    Status: {report.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenDoctorSummary}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button
                      onClick={onOpenDoctorSummary}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
