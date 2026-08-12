import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Heart,
  Thermometer,
  Activity,
  Zap,
  TrendingUp,
  Plus,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wind,
} from 'lucide-react';
import { HealthMetricPoint } from '../types';

interface HealthTrendsViewProps {
  metrics: HealthMetricPoint[];
  onAddMetricPoint: (point: Omit<HealthMetricPoint, 'id' | 'timestamp'>) => void;
}

type MetricType = 'heartRate' | 'temperature' | 'bloodPressure' | 'spO2' | 'readiness';

export const HealthTrendsView: React.FC<HealthTrendsViewProps> = ({
  metrics,
  onAddMetricPoint,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('heartRate');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | 'all'>('7d');
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state for logging new measurement
  const [formHR, setFormHR] = useState('70');
  const [formRestingHR, setFormRestingHR] = useState('63');
  const [formTemp, setFormTemp] = useState('98.6');
  const [formSystolic, setFormSystolic] = useState('118');
  const [formDiastolic, setFormDiastolic] = useState('78');
  const [formSpO2, setFormSpO2] = useState('99');
  const [formReadiness, setFormReadiness] = useState('88');
  const [formNotes, setFormNotes] = useState('');

  // Filter metrics based on selected time range
  const filteredMetrics = React.useMemo(() => {
    let sorted = [...metrics].sort((a, b) => a.timestamp - b.timestamp);
    if (timeRange === '7d') return sorted.slice(-7);
    if (timeRange === '14d') return sorted.slice(-14);
    return sorted;
  }, [metrics, timeRange]);

  // Convert dataset for Recharts with optional temp unit conversion
  const chartData = React.useMemo(() => {
    return filteredMetrics.map((item) => {
      const tempVal =
        tempUnit === 'C'
          ? parseFloat((((item.temperature - 32) * 5) / 9).toFixed(1))
          : item.temperature;

      return {
        ...item,
        displayTemp: tempVal,
      };
    });
  }, [filteredMetrics, tempUnit]);

  // Calculated Vitals Summaries
  const latest = filteredMetrics[filteredMetrics.length - 1] || metrics[metrics.length - 1];

  const avgHR = Math.round(
    filteredMetrics.reduce((acc, m) => acc + m.heartRate, 0) / (filteredMetrics.length || 1)
  );

  const maxTempF = Math.max(...filteredMetrics.map((m) => m.temperature));
  const maxTempDisplay =
    tempUnit === 'C'
      ? `${(((maxTempF - 32) * 5) / 9).toFixed(1)}°C`
      : `${maxTempF.toFixed(1)}°F`;

  const avgSystolic = Math.round(
    filteredMetrics.reduce((acc, m) => acc + m.systolic, 0) / (filteredMetrics.length || 1)
  );
  const avgDiastolic = Math.round(
    filteredMetrics.reduce((acc, m) => acc + m.diastolic, 0) / (filteredMetrics.length || 1)
  );

  const avgSpO2 = (
    filteredMetrics.reduce((acc, m) => acc + m.spO2, 0) / (filteredMetrics.length || 1)
  ).toFixed(1);

  const avgReadiness = Math.round(
    filteredMetrics.reduce((acc, m) => acc + m.readinessScore, 0) / (filteredMetrics.length || 1)
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    onAddMetricPoint({
      date: todayStr,
      heartRate: Number(formHR) || 72,
      restingHeartRate: Number(formRestingHR) || 64,
      temperature: Number(formTemp) || 98.6,
      systolic: Number(formSystolic) || 120,
      diastolic: Number(formDiastolic) || 80,
      spO2: Number(formSpO2) || 98,
      readinessScore: Number(formReadiness) || 85,
      notes: formNotes.trim() || undefined,
    });

    setIsLogModalOpen(false);
    setFormNotes('');
  };

  // Custom Glassmorphic Tooltip Component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as HealthMetricPoint & { displayTemp: number };

      return (
        <div className="bg-slate-900/95 border border-white/20 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl text-white text-xs space-y-2 max-w-xs z-50">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold">
            <span className="text-purple-300 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {dataPoint.date}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              Readiness: {dataPoint.readinessScore}%
            </span>
          </div>

          <div className="space-y-1.5 py-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 font-semibold">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-mono text-white">
                  {entry.value}{' '}
                  {entry.dataKey === 'displayTemp'
                    ? `°${tempUnit}`
                    : entry.dataKey === 'heartRate' || entry.dataKey === 'restingHeartRate'
                    ? 'bpm'
                    : entry.dataKey === 'systolic' || entry.dataKey === 'diastolic'
                    ? 'mmHg'
                    : entry.dataKey === 'spO2'
                    ? '%'
                    : ''}
                </span>
              </div>
            ))}
          </div>

          {dataPoint.notes && (
            <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300/90 italic">
              "{dataPoint.notes}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Health Trends & Vitals Analytics</h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time visual tracking of heart rate, temperature, blood pressure, and recovery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/15 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '7d'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '14d'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === 'all'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Log Measurement Button */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl glass-button-glow text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4 text-purple-300" /> Log Vitals
          </button>
        </div>
      </div>

      {/* Interactive Vitals Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Heart Rate Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMetric('heartRate')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMetric('heartRate'); }}
          className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
            selectedMetric === 'heartRate'
              ? 'bg-purple-500/20 border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.25)]'
              : 'bg-white/5 border-white/10 hover:border-purple-400/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" /> Heart Rate
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Optimal
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">{latest?.heartRate || '--'}</span>
            <span className="text-xs text-slate-400">bpm</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Resting: {latest?.restingHeartRate || '--'} bpm • Avg: {avgHR}
          </p>
        </div>

        {/* Temperature Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMetric('temperature')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMetric('temperature'); }}
          className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
            selectedMetric === 'temperature'
              ? 'bg-rose-500/20 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
              : 'bg-white/5 border-white/10 hover:border-rose-400/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperature
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUnit((prev) => (prev === 'F' ? 'C' : 'F'));
              }}
              className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-mono"
            >
              °{tempUnit}
            </button>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">
              {tempUnit === 'C'
                ? (((latest?.temperature || 98.6) - 32) * 5 / 9).toFixed(1)
                : (latest?.temperature || 98.6).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">°{tempUnit}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Peak: {maxTempDisplay} • Normal
          </p>
        </div>

        {/* Blood Pressure Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMetric('bloodPressure')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMetric('bloodPressure'); }}
          className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
            selectedMetric === 'bloodPressure'
              ? 'bg-teal-500/20 border-teal-400/50 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
              : 'bg-white/5 border-white/10 hover:border-teal-400/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" /> Blood Pressure
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
              Normal
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">
              {latest?.systolic}/{latest?.diastolic}
            </span>
            <span className="text-xs text-slate-400">mmHg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Avg: {avgSystolic}/{avgDiastolic} mmHg
          </p>
        </div>

        {/* SpO2 & Readiness Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMetric('spO2')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMetric('spO2'); }}
          className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
            selectedMetric === 'spO2' || selectedMetric === 'readiness'
              ? 'bg-sky-500/20 border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
              : 'bg-white/5 border-white/10 hover:border-sky-400/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-400" /> SpO2 & Readiness
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
              {latest?.spO2}% SpO2
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">
              {latest?.readinessScore}%
            </span>
            <span className="text-xs text-slate-400">Readiness</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Avg Readiness: {avgReadiness}%
          </p>
        </div>
      </div>

      {/* Main Interactive Recharts Graph Panel */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/15 shadow-2xl relative space-y-4">
        {/* Metric Switcher Tab Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedMetric('heartRate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMetric === 'heartRate'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> Heart Rate (bpm)
            </button>

            <button
              onClick={() => setSelectedMetric('temperature')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMetric === 'temperature'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" /> Temperature (°{tempUnit})
            </button>

            <button
              onClick={() => setSelectedMetric('bloodPressure')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMetric === 'bloodPressure'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Blood Pressure
            </button>

            <button
              onClick={() => setSelectedMetric('spO2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMetric === 'spO2'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Wind className="w-3.5 h-3.5" /> SpO2 & Oxygen
            </button>

            <button
              onClick={() => setSelectedMetric('readiness')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedMetric === 'readiness'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Wellness Score
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            {chartData.length} records • Updated Today
          </span>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'heartRate' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 110]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Upper Rest Target (80 bpm)', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                <Area type="monotone" dataKey="heartRate" name="Active Heart Rate" stroke="#c084fc" strokeWidth={3} fillOpacity={1} fill="url(#colorHR)" />
                <Area type="monotone" dataKey="restingHeartRate" name="Resting Heart Rate" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResting)" />
              </AreaChart>
            ) : selectedMetric === 'temperature' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={tempUnit === 'C' ? [36, 39] : [97, 102]}
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine
                  y={tempUnit === 'C' ? 38.0 : 100.4}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Fever Threshold (${tempUnit === 'C' ? '38.0°C' : '100.4°F'})`,
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="displayTemp"
                  name={`Body Temp (°${tempUnit})`}
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                />
              </AreaChart>
            ) : selectedMetric === 'bloodPressure' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 150]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine
                  y={120}
                  stroke="#2dd4bf"
                  strokeDasharray="3 3"
                  label={{ value: 'Systolic Target (120)', fill: '#2dd4bf', fontSize: 10, position: 'insideTopRight' }}
                />
                <ReferenceLine
                  y={80}
                  stroke="#818cf8"
                  strokeDasharray="3 3"
                  label={{ value: 'Diastolic Target (80)', fill: '#818cf8', fontSize: 10, position: 'insideBottomRight' }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic (mmHg)"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2dd4bf' }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic (mmHg)"
                  stroke="#818cf8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#818cf8' }}
                />
              </LineChart>
            ) : selectedMetric === 'spO2' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[92, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine
                  y={95}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  label={{ value: 'Normal Threshold (95%)', fill: '#f43f5e', fontSize: 10, position: 'top' }}
                />
                <Area
                  type="monotone"
                  dataKey="spO2"
                  name="Blood Oxygen SpO2 (%)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSpO2)"
                />
              </AreaChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="readinessScore"
                  name="Daily Readiness & Wellness Score (%)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorReadiness)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Trend Insights & Clinical Observations Card */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 p-5 rounded-3xl border border-purple-500/20 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Clinical Vitals & Pattern Insight</h4>
            <span className="text-[11px] text-slate-400">Automated AI health correlation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200 leading-relaxed">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="font-semibold text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Temperature & Recovery
            </span>
            <p className="text-slate-300 text-[11px]">
              Your body temperature peaked at 100.2°F on Aug 08 (coinciding with logged fatigue) and has successfully returned to your optimal baseline of 98.3°F over the last 3 days.
            </p>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Cardiovascular & Oxygen
            </span>
            <p className="text-slate-300 text-[11px]">
              Resting heart rate decreased by 12 bpm from its peak to 61 bpm today. SpO2 has remained steady at 99%, indicating stable cardiovascular recovery and respiration.
            </p>
          </div>
        </div>
      </div>

      {/* Log Measurement Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/20 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-white shadow-2xl relative space-y-5 my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Log Today's Health Vitals</h3>
                    <p className="text-xs text-slate-400">
                      Record measurements to update your health trends chart
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Active Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={formHR}
                      onChange={(e) => setFormHR(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Resting HR (bpm)</label>
                    <input
                      type="number"
                      value={formRestingHR}
                      onChange={(e) => setFormRestingHR(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Body Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formTemp}
                      onChange={(e) => setFormTemp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={formSpO2}
                      onChange={(e) => setFormSpO2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={formSystolic}
                      onChange={(e) => setFormSystolic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={formDiastolic}
                      onChange={(e) => setFormDiastolic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Readiness Score (%)</label>
                  <input
                    type="number"
                    value={formReadiness}
                    onChange={(e) => setFormReadiness(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Optional Notes / Context</label>
                  <input
                    type="text"
                    placeholder="e.g., Felt energized after morning walk..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-purple-400 focus:outline-none placeholder-slate-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl glass-button-glow text-white font-semibold text-xs shadow-lg"
                  >
                    Save Measurement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
