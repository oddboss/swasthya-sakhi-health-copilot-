import React, { useState } from 'react';
import { TimelineItem, RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';
import { History, Plus, Trash2, CheckCircle, Clock, Search, Filter, Sparkles, AlertCircle } from 'lucide-react';

interface HealthTimelineProps {
  timeline: TimelineItem[];
  onAddTimelineItem: (item: Omit<TimelineItem, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onDeleteTimelineItem: (id: string) => void;
  onUpdateStatus: (id: string, status: 'active' | 'resolved' | 'monitoring') => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  timeline,
  onAddTimelineItem,
  onDeleteTimelineItem,
  onUpdateStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');

  // Form state for adding new item manually
  const [symptom, setSymptom] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'active' | 'resolved' | 'monitoring'>('monitoring');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    onAddTimelineItem({
      symptom: symptom.trim(),
      riskLevel,
      details: details.trim() || 'Log created manually in Health Timeline.',
      status,
    });
    setSymptom('');
    setDetails('');
    setShowAddModal(false);
  };

  const filteredTimeline = timeline.filter((item) => {
    const matchesSearch =
      item.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-3xl mx-auto">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Health Timeline & Memory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of logged symptoms and questions referenced automatically by Copilot AI
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-xs shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Symptom</span>
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-slate-600">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-800">Context Memory:</span> When you talk to Copilot, it checks this timeline so it can notice patterns (e.g. connecting a new headache to fatigue logged 3 days ago).
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low concern</option>
            <option value="monitor">Monitor</option>
            <option value="see_doctor">See a doctor soon</option>
          </select>
        </div>
      </div>

      {/* Timeline Items List */}
      {filteredTimeline.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No timeline entries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Mention symptoms during your AI chat or log a symptom manually to build your session health memory.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl hover:bg-teal-100"
          >
            <Plus className="w-3.5 h-3.5" /> Log First Symptom
          </button>
        </div>
      ) : (
        <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-6">
          {filteredTimeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot on timeline line */}
              <div
                className={`absolute -left-[21px] sm:-left-[29px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                  item.riskLevel === 'see_doctor'
                    ? 'border-rose-500 bg-rose-50'
                    : item.riskLevel === 'monitor'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-emerald-500 bg-emerald-50'
                }`}
              />

              <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.symptom}</h3>
                    <RiskBadge level={item.riskLevel} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.dateFormatted}
                    </span>

                    <button
                      onClick={() => onDeleteTimelineItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.details}</p>

                {/* Status selector */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                  <span className="text-[11px] font-medium text-slate-400">Status:</span>
                  <div className="flex items-center gap-1">
                    {(['monitoring', 'resolved', 'active'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateStatus(item.id, st)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium capitalize transition-colors ${
                          item.status === st
                            ? st === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800 font-semibold'
                              : st === 'monitoring'
                              ? 'bg-amber-100 text-amber-800 font-semibold'
                              : 'bg-rose-100 text-rose-800 font-semibold'
                            : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Log Symptom to Timeline
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Symptom / Concern Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild Frontal Headache, Sore Throat"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Risk Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRiskLevel('low')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center ${
                      riskLevel === 'low'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Low concern
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskLevel('monitor')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center ${
                      riskLevel === 'monitor'
                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Monitor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskLevel('see_doctor')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center ${
                      riskLevel === 'see_doctor'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    See Doctor
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-500"
                >
                  <option value="monitoring">Monitoring</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Details / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe when it started, triggers, or severity..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700"
                >
                  Add to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
