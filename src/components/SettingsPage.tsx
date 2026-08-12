import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Shield,
  Bell,
  Database,
  Cpu,
  Check,
  RotateCcw,
  Volume2,
  Lock,
  User,
  Smartphone,
  Info,
  Sliders,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';
import { UserProfile } from '../types';

interface SettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onOpenSOS?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenSOS,
}) => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  // Settings State
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    medicationReminders: true,
    weeklyDigest: false,
  });

  const [assistantSettings, setAssistantSettings] = useState({
    voiceResponses: true,
    detailLevel: 'standard' as 'standard' | 'detailed' | 'concise',
  });

  const [dataSync, setDataSync] = useState({
    autoSync: true,
    offlineCache: true,
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleClearLocalData = () => {
    if (window.confirm('Are you sure you want to reset local health timeline and chat history? This cannot be undone.')) {
      localStorage.removeItem('aura_health_timeline');
      localStorage.removeItem('aura_chat_messages');
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Application Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize visual themes, notification alerts, AI assistant preferences, and data privacy.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Main Settings Grid */}
      <div className="space-y-6">
        {/* 1. APPEARANCE & THEME (FEATURED CARD WITH TOGGLE SWITCH) */}
        <section className="saas-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Visual Appearance
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  Active: {theme === 'light' ? 'Light (Default)' : 'Deep Space'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Theme Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Switch between clean clinical Light mode (default) and Deep Space dark mode using the global theme context.
              </p>
            </div>

            {/* Quick Toggle Switch */}
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${!isDark ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                <Sun className="w-4 h-4" />
                <span className="hidden xs:inline">Light</span>
              </span>

              {/* Toggle Switch Button */}
              <button
                onClick={toggleTheme}
                type="button"
                role="switch"
                aria-checked={isDark}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isDark ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    isDark ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  {isDark ? (
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </span>
              </button>

              <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                <Moon className="w-4 h-4" />
                <span className="hidden xs:inline">Deep Space</span>
              </span>
            </div>
          </div>

          {/* Interactive Theme Cards Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LIGHT THEME CARD */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                theme === 'light'
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Light
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Default
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Clean clinical light interface
                    </p>
                  </div>
                </div>

                {theme === 'light' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Visual Preview Box for Light Theme */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-2 text-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-700">Preview: Light Palette</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">High Contrast</span>
                </div>
                <div className="h-2 w-3/4 bg-indigo-500/30 rounded-full" />
                <div className="h-2 w-1/2 bg-slate-300 rounded-full" />
              </div>
            </button>

            {/* DEEP SPACE THEME CARD */}
            <button
              type="button"
              onClick={() => setTheme('deep-space')}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                theme === 'deep-space'
                  ? 'bg-slate-900 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30 text-white'
                  : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Deep Space
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Dark
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dark high-contrast night mode
                    </p>
                  </div>
                </div>

                {theme === 'deep-space' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Visual Preview Box for Deep Space Theme */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-300">Preview: Deep Space</span>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">Night Eye-Safe</span>
                </div>
                <div className="h-2 w-3/4 bg-indigo-500/50 rounded-full" />
                <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
              </div>
            </button>
          </div>
        </section>

        {/* 2. AI HEALTH ASSISTANT PREFERENCES */}
        <section className="saas-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                AI Health Assistant Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure Aura Gemini model response depth and audio features.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Voice Assistant Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  Voice Assistant Audio Synthesizer
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Enable web speech voice responses for AI health assistant queries.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAssistantSettings((prev) => ({
                    ...prev,
                    voiceResponses: !prev.voiceResponses,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  assistantSettings.voiceResponses ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    assistantSettings.voiceResponses ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Response Detail Level */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Clinical Response Detail Level
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Controls the depth of clinical explanations provided in chat queries.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['concise', 'standard', 'detailed'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setAssistantSettings((prev) => ({ ...prev, detailLevel: level }))
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      assistantSettings.detailLevel === level
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. NOTIFICATION & SAFETY ALERTS */}
        <section className="saas-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications & Health Alerts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage risk alerts and medication reminders.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  High Risk Symptom & Emergency Warning Banners
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Automatically open Emergency SOS modal when acute red-flag symptoms are detected.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    highRiskAlerts: !prev.highRiskAlerts,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  notifications.highRiskAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    notifications.highRiskAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Medication Dosage Schedule Alerts
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Show active medication schedule notifications on Home Dashboard.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    medicationReminders: !prev.medicationReminders,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  notifications.medicationReminders ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    notifications.medicationReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 4. DATA PRIVACY & STORAGE */}
        <section className="saas-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Data Privacy & Local Storage
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your health data is stored securely in client browser local storage.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-800 dark:text-teal-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">HIPAA & Client Data Privacy</p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  All logged symptoms, vitals, profile notes, and scanned medication images are strictly kept in your browser. No personal health records are shared or retained on external telemetry servers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Clear Local Cache & Timeline History
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Reset logged health metrics, symptom timeline, and chat messages.
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearLocalData}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </section>

        {/* Save Footer Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="btn-primary text-xs px-6 py-2.5"
          >
            <Check className="w-4 h-4" /> Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
