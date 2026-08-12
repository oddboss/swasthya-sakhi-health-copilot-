import React, { useState } from 'react';
import { History, Pill, FileText, Users, Plus, TrendingUp, Calendar, CheckCircle2, AlertCircle, Clock, Trash2, Download, Printer } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { HealthTrendsView } from './HealthTrendsView';
import { HealthSummaryPDFModal } from './HealthSummaryPDFModal';
import { SymptomCalendar } from './SymptomCalendar';
import { RecordSubTab, TimelineItem, MedicineScanResult, UserProfile, HealthMetricPoint } from '../types';

interface RecordsDashboardProps {
  timeline: TimelineItem[];
  scannedMedicines: MedicineScanResult[];
  userProfile: UserProfile;
  healthMetrics: HealthMetricPoint[];
  onAddTimelineItem: (item: Omit<TimelineItem, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onDeleteTimelineItem: (id: string) => void;
  onUpdateTimelineStatus: (id: string, status: 'active' | 'resolved' | 'monitoring') => void;
  onOpenDoctorSummary: () => void;
  onAddHealthMetricPoint: (point: Omit<HealthMetricPoint, 'id' | 'timestamp'>) => void;
}

export const RecordsDashboard: React.FC<RecordsDashboardProps> = ({
  timeline,
  scannedMedicines,
  userProfile,
  healthMetrics,
  onAddTimelineItem,
  onDeleteTimelineItem,
  onUpdateTimelineStatus,
  onOpenDoctorSummary,
  onAddHealthMetricPoint,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<RecordSubTab>('trends');
  const [newSymptomText, setNewSymptomText] = useState('');
  const [isPDFSummaryOpen, setIsPDFSummaryOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7' | '14' | '30' | 'all'>('30');

  const handleAddManualSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptomText.trim()) return;

    onAddTimelineItem({
      symptom: newSymptomText.trim(),
      riskLevel: 'monitor',
      details: 'Logged manually into health records dashboard.',
      status: 'monitoring',
    });

    setNewSymptomText('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Health Records & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized timeline of symptoms, vitals metrics, and medication records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPDFSummaryOpen(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            <Printer className="w-4 h-4" />
            <span>Export Summary (PDF)</span>
          </button>
          <button
            onClick={onOpenDoctorSummary}
            className="btn-secondary text-xs px-4 py-2"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Doctor Visit Notes</span>
          </button>
        </div>
      </div>

      {/* Main SaaS Dashboard Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav Categories */}
        <div className="lg:col-span-3 saas-card p-4 space-y-2 h-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
            Categories
          </span>

          <button
            onClick={() => setActiveSubTab('trends')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              activeSubTab === 'trends'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-indigo-300" />
              <span>Health Trends</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-200">
              Vitals
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeSubTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-indigo-300" />
            <span>Symptom History</span>
          </button>

          <button
            onClick={() => setActiveSubTab('medications')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeSubTab === 'medications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Pill className="w-4 h-4 text-indigo-300" />
            <span>Medications ({scannedMedicines.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reports')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeSubTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-300" />
            <span>Clinical Reports</span>
          </button>

          <button
            onClick={() => setActiveSubTab('family')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeSubTab === 'family'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Family Profiles</span>
          </button>
        </div>

        {/* Content View Area */}
        <div className="lg:col-span-9 saas-card p-6 space-y-6">
          {/* Time Filter Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {activeSubTab === 'trends'
                ? 'Vitals & Metric Analytics'
                : activeSubTab === 'history'
                ? 'Symptom Records & Calendar'
                : activeSubTab === 'medications'
                ? 'Prescription & Medicine Log'
                : activeSubTab === 'reports'
                ? 'Clinical Summary Reports'
                : 'Family Profiles'}
            </span>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['7', '14', '30', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timeFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'All Time' : `${filter} Days`}
                </button>
              ))}
            </div>
          </div>

          {activeSubTab === 'trends' && (
            <HealthTrendsView
              metrics={healthMetrics}
              onAddMetricPoint={onAddHealthMetricPoint}
            />
          )}

          {activeSubTab === 'history' && (
            <div className="space-y-6">
              {/* Calendar Widget */}
              <SymptomCalendar
                timeline={timeline}
                onAddTimelineItem={onAddTimelineItem}
                onUpdateTimelineStatus={onUpdateTimelineStatus}
                onDeleteTimelineItem={onDeleteTimelineItem}
              />

              {/* Symptom Log */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Symptom Log
                  </h3>

                  <form onSubmit={handleAddManualSymptom} className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newSymptomText}
                      onChange={(e) => setNewSymptomText(e.target.value)}
                      placeholder="Add symptom note..."
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button type="submit" className="btn-primary text-xs px-3 py-1.5">
                      <Plus className="w-3.5 h-3.5" /> Log
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  {timeline.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.symptom}</span>
                          <RiskBadge level={item.riskLevel} />
                        </div>
                        <p className="text-slate-400 text-[11px] truncate">{item.details}</p>
                      </div>

                      <button
                        onClick={() => onDeleteTimelineItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'medications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Scanned Medications & Prescriptions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scannedMedicines.map((med) => (
                  <div key={med.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{med.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                        {med.strength}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{med.dosage}</p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
                      <span>Batch: {med.batchNo}</span>
                      <span>Expires: {med.expiryDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Clinical Reports & Export Documents
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Complete Health Summary Export</span>
                    <span className="text-slate-400 text-[11px]">Includes all vitals, symptoms, and active medications</span>
                  </div>
                  <button
                    onClick={() => setIsPDFSummaryOpen(true)}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Doctor Visit Notes Sheet</span>
                    <span className="text-slate-400 text-[11px]">Printable structured summary for clinical appointments</span>
                  </div>
                  <button
                    onClick={onOpenDoctorSummary}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    <FileText className="w-4 h-4" /> View Notes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'family' && (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <Users className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Family Profiles</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Manage health records for dependants or family members under a single Aura Copilot account.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Summary Export Modal */}
      <HealthSummaryPDFModal
        isOpen={isPDFSummaryOpen}
        onClose={() => setIsPDFSummaryOpen(false)}
        userProfile={userProfile}
        timeline={timeline}
        scannedMedicines={scannedMedicines}
        healthMetrics={healthMetrics}
      />
    </div>
  );
};
