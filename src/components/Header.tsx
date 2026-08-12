import React, { useState } from 'react';
import { Activity, ShieldAlert, FileText, RefreshCw, Plus, Search, Menu } from 'lucide-react';
import { NavTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  onOpenSOS: () => void;
  onOpenSummary: () => void;
  onSyncData?: () => void;
  onLogVitals?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSOS,
  onOpenSummary,
  onSyncData,
  onLogVitals,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    if (onSyncData) onSyncData();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        return 'Overview';
      case 'symptoms':
      case 'triage':
        return 'Symptom Assessment';
      case 'assistant':
        return 'AI Assistant';
      case 'scanner':
        return 'Medication Scanner';
      case 'records':
        return 'Health Records';
      case 'medications':
        return 'Medication Management';
      case 'reports':
        return 'Clinical Reports';
      case 'profile':
        return 'Personal Health Profile';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'Health Dashboard';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between shrink-0 shadow-sm transition-colors">
      {/* Mobile Branding Logo (Shown when desktop sidebar is hidden) */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
            Aura<span className="text-indigo-600 dark:text-indigo-400">Copilot</span>
          </span>
        </button>
      </div>

      {/* Desktop Page Title Header */}
      <div className="hidden lg:flex items-center gap-4">
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          {getPageTitle(activeTab)}
        </h1>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={handleSyncClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          title="Sync Health Metrics"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>

        {onLogVitals && (
          <button
            onClick={onLogVitals}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Vitals</span>
          </button>
        )}

        <button
          onClick={onOpenSummary}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-all"
          title="Export Doctor Summary Report"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Doctor Report</span>
        </button>

        {/* Emergency Red SOS Button */}
        <button
          onClick={onOpenSOS}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
          title="Emergency Medical SOS"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
