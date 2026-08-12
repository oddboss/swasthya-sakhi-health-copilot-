import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Activity,
  Heart,
  Thermometer,
  ShieldAlert,
  Sparkles,
  Plus,
  MessageSquare,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { ChatMessage, UserProfile, HealthMetricPoint, TimelineItem, OrbState, RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';

interface AssistantPageProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  userProfile: UserProfile;
  healthMetrics: HealthMetricPoint[];
  timeline: TimelineItem[];
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({
  messages,
  onSendMessage,
  isLoading,
  userProfile,
  healthMetrics,
  timeline,
  orbState,
  setOrbState,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeThreadId, setActiveThreadId] = useState('current');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Explain my recent blood pressure trend',
    'Should I be concerned about my sleep?',
    'What can I do to improve my heart health?',
  ];

  const latestMetric = healthMetrics[healthMetrics.length - 1] || {
    heartRate: 67,
    temperature: 98.3,
    systolic: 115,
    diastolic: 75,
    spO2: 98,
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    await onSendMessage(text);
  };

  const handleQuickQuestionClick = (q: string) => {
    onSendMessage(q);
  };

  // Toggle Compact Voice Assistant State
  const handleToggleVoice = () => {
    if (orbState === 'listening' || orbState === 'speaking') {
      setOrbState('idle');
    } else {
      setOrbState('listening');

      // Speech recognition API support
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setInputText(text);
          };

          recognition.onend = () => {
            setOrbState('speaking');
            setTimeout(() => {
              setOrbState('idle');
            }, 2500);
          };

          recognition.start();
        } catch {
          simulateVoiceFallback();
        }
      } else {
        simulateVoiceFallback();
      }
    }
  };

  const simulateVoiceFallback = () => {
    setTimeout(() => {
      setInputText('How are my vitals doing today compared to my history?');
      setOrbState('speaking');
      setTimeout(() => setOrbState('idle'), 2000);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title & Subtitle */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Aura <span className="text-indigo-400">AI Health Assistant</span>
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Your personal health companion.
        </p>
      </div>

      {/* 3-Column SaaS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Conversation History */}
        <div className="hidden lg:block lg:col-span-3 saas-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recent Chats
            </span>
            <button
              onClick={() => setActiveThreadId(`t-${Date.now()}`)}
              className="p-1 rounded-lg hover:bg-slate-800 text-indigo-400 transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveThreadId('current')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeThreadId === 'current'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div className="truncate min-w-0">
                <span className="block truncate font-bold">Current Health Consultation</span>
                <span className="text-[10px] text-slate-300 block">Active thread</span>
              </div>
            </button>

            <button
              onClick={() => setActiveThreadId('t-1')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeThreadId === 't-1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div className="truncate min-w-0">
                <span className="block truncate font-medium">Blood Pressure & Vitals Query</span>
                <span className="text-[10px] text-slate-500 block">Yesterday</span>
              </div>
            </button>

            <button
              onClick={() => setActiveThreadId('t-2')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeThreadId === 't-2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div className="truncate min-w-0">
                <span className="block truncate font-medium">Mild Headache & Fatigue Assessment</span>
                <span className="text-[10px] text-slate-500 block">3 days ago</span>
              </div>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Large Clean Chat Interface */}
        <div className="lg:col-span-6 saas-card flex flex-col h-[640px] relative overflow-hidden">
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Aura Greeting */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <span className="font-bold text-sm text-white">Aura Assistant</span>
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Hi {userProfile.name?.split(' ')[0] || 'Alex'}, I'm Aura.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                How can I help you today? Ask me about your vitals, symptom trends, or general medical guidance.
              </p>

              {/* Suggested Questions */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Suggested Questions
                </span>
                <div className="flex flex-col gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestionClick(q)}
                      className="text-left px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center justify-between"
                    >
                      <span>"{q}"</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Message Stream */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>{msg.sender === 'user' ? 'You' : 'Aura Health Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Clinical Triage Badge / Analysis Card if available */}
                  {msg.analysis && (
                    <div className="pt-2 mt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={msg.analysis.riskLevel} />
                        <span className="text-[10px] text-slate-400">
                          {msg.analysis.riskLabel}
                        </span>
                      </div>

                      {msg.analysis.possibleCauses?.length > 0 && (
                        <div className="text-[11px] text-slate-300">
                          <strong className="text-slate-200">Considerations:</strong>{' '}
                          {msg.analysis.possibleCauses.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Aura is processing your query...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Compact Voice Interaction Bar State */}
          {(orbState === 'listening' || orbState === 'speaking') && (
            <div className="p-3 bg-indigo-950/90 border-t border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 h-5 px-1">
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-1" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-2" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-3" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {orbState === 'listening' ? 'Listening...' : 'Speaking...'}
                  </span>
                  <span className="text-[10px] text-indigo-300">
                    Describe your health query
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleVoice}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-[11px]"
              >
                Tap to stop
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                orbState === 'listening'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title={orbState === 'listening' ? 'Stop Listening' : 'Voice Assistant'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Health Context Panel */}
        <div className="hidden lg:block lg:col-span-3 saas-card p-4 space-y-4">
          <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Health Context
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Active
            </span>
          </div>

          {/* Profile Overview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-white">{userProfile.name || 'Alex Morgan'}</div>
            <div className="text-slate-400 flex items-center justify-between text-[11px]">
              <span>Age: {userProfile.age || 32} yrs</span>
              <span>Gender: {userProfile.gender || 'Male'}</span>
              <span>Blood: {userProfile.bloodType || 'A+'}</span>
            </div>
          </div>

          {/* Active Vitals Summary */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Recent Vitals
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                <span className="font-bold text-white">{latestMetric.heartRate} bpm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                <span className="font-bold text-white">{latestMetric.systolic}/{latestMetric.diastolic}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <span className="font-bold text-white">{latestMetric.temperature}°F</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SpO₂ Oxygen</span>
                <span className="font-bold text-white">{latestMetric.spO2}%</span>
              </div>
            </div>
          </div>

          {/* Known Conditions & Allergies */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Medical Profile
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 block">Conditions</span>
                <p className="text-slate-300 text-[11px]">
                  {userProfile.existingConditions?.join(', ') || 'Mild seasonal asthma, Tension headaches'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 block">Allergies</span>
                <p className="text-slate-300 text-[11px]">
                  {userProfile.allergies?.join(', ') || 'Penicillin, Dust mites'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
