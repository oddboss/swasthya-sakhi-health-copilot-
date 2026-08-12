import React from 'react';
import {
  Home,
  Stethoscope,
  Bot,
  Camera,
  History,
  Pill,
  FileText,
  User,
  Settings,
  Activity,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  onOpenSOS: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSOS,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
    { id: 'assistant', label: 'Assistant', icon: Bot },
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'records', label: 'Records', icon: History },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'AM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 z-30 select-none transition-colors">
      {/* Top Branding Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
              Aura <span className="text-indigo-600 dark:text-indigo-400">Copilot</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
              Clinical Health SaaS
            </span>
          </div>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          // Map symptoms / triage
          const isSelected =
            activeTab === item.id ||
            (item.id === 'symptoms' && activeTab === 'triage');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
            </button>
          );
        })}

        {/* Emergency Medical SOS button */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onOpenSOS}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Emergency SOS</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 uppercase font-mono">
              911
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Profile Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
        <button
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 dark:border-indigo-500/40 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
            {getInitials(userProfile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userProfile.name || 'Alex Morgan'}</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 block transition-colors">
              View profile
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
