import React, { useState, useEffect } from 'react';
import {
  ChatMessage,
  TimelineItem,
  UserProfile,
  RiskLevel,
  NavTab,
  OrbState,
  MedicineScanResult,
  HealthMetricPoint,
} from './types';
import { INITIAL_USER_PROFILE, INITIAL_TIMELINE_ITEMS, INITIAL_HEALTH_METRIC_POINTS } from './data';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { AssistantPage } from './components/AssistantPage';
import { SymptomTriage } from './components/SymptomTriage';
import { MedicineScanner } from './components/MedicineScanner';
import { RecordsDashboard } from './components/RecordsDashboard';
import { ProfileCard } from './components/ProfileCard';
import { SettingsPage } from './components/SettingsPage';
import { EmergencyModal } from './components/EmergencyModal';
import { DoctorSummaryModal } from './components/DoctorSummaryModal';
import { LogVitalsModal } from './components/LogVitalsModal';
import { AuraRightPanel } from './components/AuraRightPanel';
import { Bot, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Local Storage State Persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aura_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    const saved = localStorage.getItem('aura_health_timeline');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_ITEMS;
  });

  const [scannedMedicines, setScannedMedicines] = useState<MedicineScanResult[]>(() => {
    const saved = localStorage.getItem('aura_scanned_medicines');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'med-1',
            name: 'Amoxicillin Trihydrate',
            strength: '500 mg',
            batchNo: 'AMX-2024-8891',
            expiryDate: '11/2027',
            manufacturer: 'Aura BioPharm Inc.',
            dosage: '1 capsule every 8 hours after meals',
            activeIngredient: 'Amoxicillin 500mg',
            warnings: 'Complete full course.',
            scannedAt: 'Yesterday',
          },
        ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('aura_chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetricPoint[]>(() => {
    const saved = localStorage.getItem('aura_health_metrics');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_METRIC_POINTS;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('aura_health_timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem('aura_scanned_medicines', JSON.stringify(scannedMedicines));
  }, [scannedMedicines]);

  useEffect(() => {
    localStorage.setItem('aura_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('aura_health_metrics', JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
  };

  const handleAddHealthMetricPoint = (point: Omit<HealthMetricPoint, 'id' | 'timestamp'>) => {
    const newPoint: HealthMetricPoint = {
      ...point,
      id: `m-${Date.now()}`,
      timestamp: Date.now(),
    };
    setHealthMetrics((prev) => [...prev, newPoint]);
  };

  const handleAddTimelineItem = (item: Omit<TimelineItem, 'id' | 'timestamp' | 'dateFormatted'>) => {
    const newItem: TimelineItem = {
      ...item,
      id: `tl-${Date.now()}`,
      timestamp: Date.now(),
      dateFormatted: 'Just now',
    };
    setTimeline((prev) => [newItem, ...prev]);
  };

  const handleDeleteTimelineItem = (id: string) => {
    setTimeline((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateTimelineStatus = (id: string, status: 'active' | 'resolved' | 'monitoring') => {
    setTimeline((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleConfirmScanMedicine = (med: MedicineScanResult) => {
    setScannedMedicines((prev) => [med, ...prev.filter((m) => m.id !== med.id)]);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          chatHistory: messages,
          profile,
          timeline,
          healthMetrics,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to analyze health query.');
      }

      const aiData = result.data;

      const copilotMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        text: aiData.explanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: {
          riskLevel: aiData.riskLevel as RiskLevel,
          riskLabel: aiData.riskLabel,
          explanation: aiData.explanation,
          possibleCauses: aiData.possibleCauses || [],
          nextSteps: aiData.nextSteps || [],
          symptomDetected: aiData.symptomDetected || null,
          timelineReferenceNote: aiData.timelineReferenceNote || null,
          isEmergency: Boolean(aiData.isEmergency),
          emergencyWarning: aiData.emergencyWarning || null,
        },
      };

      setMessages((prev) => [...prev, copilotMsg]);

      if (aiData.isEmergency) {
        setIsEmergencyOpen(true);
      }

      if (aiData.symptomDetected) {
        const alreadyLogged = timeline.some(
          (t) => t.symptom.toLowerCase() === aiData.symptomDetected.toLowerCase()
        );
        if (!alreadyLogged) {
          const autoItem: TimelineItem = {
            id: `tl-auto-${Date.now()}`,
            timestamp: Date.now(),
            dateFormatted: 'Today',
            symptom: aiData.symptomDetected,
            riskLevel: (aiData.riskLevel as RiskLevel) || 'low',
            details: `Logged from health assistant query: "${text.slice(0, 80)}"`,
            status: 'monitoring',
          };
          setTimeline((prev) => [autoItem, ...prev]);
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'copilot',
        text: `Unable to complete query analysis right now. ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased flex flex-row transition-colors duration-200">
      {/* Persistent Left Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={profile}
        onOpenSOS={() => setIsEmergencyOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-20 lg:pb-8">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={profile}
          onOpenSOS={() => setIsEmergencyOpen(true)}
          onOpenSummary={() => setIsSummaryOpen(true)}
          onSyncData={() => {
            // Trigger quick sync refresh
          }}
          onLogVitals={() => setIsLogVitalsOpen(true)}
        />

        {/* Main View Switcher */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeDashboard
              userProfile={profile}
              healthMetrics={healthMetrics}
              timeline={timeline}
              scannedMedicines={scannedMedicines}
              setActiveTab={setActiveTab}
              onLogVitalsClick={() => setIsLogVitalsOpen(true)}
              onOpenDoctorSummary={() => setIsSummaryOpen(true)}
              onSyncData={() => {}}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              userProfile={profile}
              healthMetrics={healthMetrics}
              timeline={timeline}
              orbState={orbState}
              setOrbState={setOrbState}
            />
          )}

          {(activeTab === 'symptoms' || activeTab === 'triage') && (
            <SymptomTriage
              userProfile={profile}
              onAddTimelineItem={handleAddTimelineItem}
              onSelectEmergencySOS={() => setIsEmergencyOpen(true)}
            />
          )}

          {activeTab === 'scanner' && (
            <MedicineScanner onConfirmScan={handleConfirmScanMedicine} />
          )}

          {(activeTab === 'records' || activeTab === 'medications' || activeTab === 'reports') && (
            <RecordsDashboard
              timeline={timeline}
              scannedMedicines={scannedMedicines}
              userProfile={profile}
              healthMetrics={healthMetrics}
              onAddTimelineItem={handleAddTimelineItem}
              onDeleteTimelineItem={handleDeleteTimelineItem}
              onUpdateTimelineStatus={handleUpdateTimelineStatus}
              onOpenDoctorSummary={() => setIsSummaryOpen(true)}
              onAddHealthMetricPoint={handleAddHealthMetricPoint}
            />
          )}

          {activeTab === 'profile' && (
            <div className="py-6 px-4">
              <ProfileCard profile={profile} onUpdateProfile={handleUpdateProfile} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              userProfile={profile}
              onUpdateProfile={handleUpdateProfile}
              onOpenSOS={() => setIsEmergencyOpen(true)}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* RIGHT COLUMN: Persistent Aura AI Assistant Panel on Desktop */}
      {activeTab === 'home' && (
        <div className="hidden lg:flex w-80 xl:w-96 sticky top-0 h-screen shrink-0">
          <AuraRightPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            userProfile={profile}
            healthMetrics={healthMetrics}
            timeline={timeline}
            orbState={orbState}
            setOrbState={setOrbState}
            onExpandFull={() => setActiveTab('assistant')}
          />
        </div>
      )}

      {/* Mobile Floating Compact Aura AI Assistant Button */}
      {activeTab !== 'assistant' && (
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className="fixed bottom-20 right-4 lg:hidden z-40 px-4 py-3 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all border border-indigo-400/30"
        >
          <Bot className="w-5 h-5" />
          <span>Aura AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Mobile Bottom-Sheet Chat Panel Modal */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden flex flex-col justify-end">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl h-[85vh] w-full flex flex-col overflow-hidden shadow-2xl border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            <AuraRightPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              userProfile={profile}
              healthMetrics={healthMetrics}
              timeline={timeline}
              orbState={orbState}
              setOrbState={setOrbState}
              onExpandFull={() => {
                setIsMobileChatOpen(false);
                setActiveTab('assistant');
              }}
              onCloseMobilePanel={() => setIsMobileChatOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Doctor Summary Report Modal */}
      <DoctorSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        profile={profile}
        timeline={timeline}
        messages={messages}
      />

      {/* Quick Vitals Log Modal */}
      <LogVitalsModal
        isOpen={isLogVitalsOpen}
        onClose={() => setIsLogVitalsOpen(false)}
        onAddMetricPoint={handleAddHealthMetricPoint}
      />
    </div>
  );
}
