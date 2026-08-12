import React, { useState } from 'react';
import { Home, Stethoscope, Bot, History, User, Camera, Pill, FileText, Settings, MoreHorizontal, X } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
    { id: 'assistant', label: 'Assistant', icon: Bot },
    { id: 'records', label: 'Records', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const secondaryTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile Secondary Menu Drawer */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                More Features
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 py-2 px-3 z-40 backdrop-blur-lg transition-colors">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected =
              activeTab === tab.id ||
              (tab.id === 'symptoms' && activeTab === 'triage');

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              isMoreOpen || ['scanner', 'medications', 'reports', 'settings'].includes(activeTab)
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
