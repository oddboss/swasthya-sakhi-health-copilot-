import React, { useState } from 'react';
import { X, Heart, Thermometer, Activity, Wind, Plus } from 'lucide-react';
import { HealthMetricPoint } from '../types';

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMetricPoint: (point: Omit<HealthMetricPoint, 'id' | 'timestamp'>) => void;
}

export const LogVitalsModal: React.FC<LogVitalsModalProps> = ({
  isOpen,
  onClose,
  onAddMetricPoint,
}) => {
  const [heartRate, setHeartRate] = useState(68);
  const [temperature, setTemperature] = useState(98.4);
  const [systolic, setSystolic] = useState(116);
  const [diastolic, setDiastolic] = useState(76);
  const [spO2, setSpO2] = useState(98);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    onAddMetricPoint({
      date: dateStr,
      heartRate: Number(heartRate),
      restingHeartRate: Number(heartRate) - 3,
      temperature: Number(temperature),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      spO2: Number(spO2),
      readinessScore: 92,
      notes: 'Logged via Quick Vitals Entry',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md saas-card p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Log Vital Readings</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Systolic (mmHg)
              </label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" /> SpO₂ Oxygen Saturation (%)
            </label>
            <input
              type="number"
              value={spO2}
              onChange={(e) => setSpO2(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs px-5 py-2"
            >
              Save Readings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
