import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Sparkles,
  ChevronRight,
  X,
  Maximize2,
  HelpCircle,
  Clock,
  Loader2,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ChatMessage, UserProfile, HealthMetricPoint, TimelineItem, OrbState } from '../types';
import { RiskBadge } from './RiskBadge';

interface AuraRightPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  userProfile: UserProfile;
  healthMetrics: HealthMetricPoint[];
  timeline: TimelineItem[];
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  onExpandFull?: () => void;
  onCloseMobilePanel?: () => void;
}

export const AuraRightPanel: React.FC<AuraRightPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  userProfile,
  healthMetrics,
  timeline,
  orbState,
  setOrbState,
  onExpandFull,
  onCloseMobilePanel,
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceStatusText, setVoiceStatusText] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickPrompts = [
    'Explain my recent vitals',
    'Should I be concerned?',
    'What can I do to improve my health?',
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

  // Voice Interaction - Speech Recognition (ChatGPT / Claude style)
  const handleStartListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (orbState === 'listening') {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setOrbState('idle');
      setVoiceStatusText(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      setOrbState('listening');
      setVoiceStatusText('Listening...');

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setOrbState('idle');
        setVoiceStatusText(null);
      };

      recognition.onend = () => {
        setOrbState('idle');
        setVoiceStatusText(null);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      setOrbState('idle');
      setVoiceStatusText(null);
    }
  };

  // Text To Speech Playback
  const handleSpeakResponse = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setOrbState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      setOrbState('speaking');
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setOrbState('idle');
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
      setOrbState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

    const text = inputText.trim();
    setInputText('');
    setOrbState('thinking');
    setVoiceStatusText('Thinking...');

    try {
      await onSendMessage(text);
    } finally {
      setOrbState('idle');
      setVoiceStatusText(null);
    }
  };

  const handleSelectQuickPrompt = async (prompt: string) => {
    if (isLoading) return;
    setInputText('');
    setOrbState('thinking');
    setVoiceStatusText('Thinking...');
    try {
      await onSendMessage(prompt);
    } finally {
      setOrbState('idle');
      setVoiceStatusText(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 select-none transition-colors">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              Aura <span className="text-indigo-600 dark:text-indigo-400">Assistant</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
              AI Health Companion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onExpandFull && (
            <button
              onClick={onExpandFull}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Expand to Full Page View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          {onCloseMobilePanel && (
            <button
              onClick={onCloseMobilePanel}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Vitals Context Bar */}
      <div className="px-4 py-2.5 bg-indigo-50/80 dark:bg-slate-950 border-b border-indigo-100 dark:border-slate-800 text-[11px] font-semibold flex items-center justify-between text-indigo-900 dark:text-indigo-300 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">
            Context: {latestMetric.heartRate} bpm • {latestMetric.systolic}/{latestMetric.diastolic} mmHg • {latestMetric.temperature}°F
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Vitals Sync" />
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Initial Greeting & Quick Prompts */}
        {messages.length === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Welcome to Aura Copilot
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Hi {userProfile.name?.split(' ')[0] || 'Alex'}, how can I help with your health today? You can ask about your vitals, symptoms, or general medical guidance.
              </p>
            </div>

            {/* Quick Prompts List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block px-1">
                Quick Prompts
              </span>
              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuickPrompt(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group shadow-xs"
                  >
                    <span>"{prompt}"</span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 px-1">
                <span>{isUser ? 'You' : 'Aura Assistant'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white font-semibold rounded-tr-none shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Risk Analysis Card */}
                {msg.analysis && (
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <RiskBadge level={msg.analysis.riskLevel} />
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        {msg.analysis.riskLabel}
                      </span>
                    </div>

                    {msg.analysis.possibleCauses?.length > 0 && (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Considerations:</strong>{' '}
                        {msg.analysis.possibleCauses.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Text To Speech Control on AI Response */}
                {!isUser && (
                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => handleSpeakResponse(msg.id, msg.text)}
                      className={`p-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                        isSpeaking
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Read</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Thinking... Analyzing query</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Indicator Banner */}
      {orbState === 'listening' && (
        <div className="px-4 py-2 bg-rose-500/10 dark:bg-rose-950/80 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 font-semibold animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening... Speak your query</span>
          </div>
          <button
            onClick={handleStartListening}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white"
          >
            Stop
          </button>
        </div>
      )}

      {orbState === 'speaking' && (
        <div className="px-4 py-2 bg-indigo-500/10 dark:bg-indigo-950/80 border-t border-indigo-500/30 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-bounce" />
            <span>Aura is speaking...</span>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setSpeakingMessageId(null);
              setOrbState('idle');
            }}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white"
          >
            Stop
          </button>
        </div>
      )}

      {/* Message Composer Footer with ChatGPT-Style Voice Mic */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0"
      >
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-xs">
          {/* Small Microphone Button inside Composer */}
          <button
            type="button"
            onClick={handleStartListening}
            className={`p-2 rounded-lg transition-all shrink-0 ${
              orbState === 'listening'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/50 animate-pulse'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={orbState === 'listening' ? 'Stop Listening' : 'Voice Input'}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              orbState === 'listening'
                ? 'Listening... Speak now'
                : 'Type your message...'
            }
            className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none py-1.5 px-1 min-w-0 font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white font-bold transition-all shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
