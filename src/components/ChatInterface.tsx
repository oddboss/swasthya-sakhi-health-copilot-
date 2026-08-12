import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QuickPrompt, UserProfile, TimelineItem } from '../types';
import { RiskBadge } from './RiskBadge';
import { SAMPLE_QUICK_PROMPTS } from '../data';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  User,
  PlusCircle,
  Check,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Mic,
  MicOff,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  userProfile: UserProfile;
  timeline: TimelineItem[];
  onAddSymptomToTimeline: (symptom: string, riskLevel: any, details: string) => void;
  onSelectQuickPrompt: (query: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  userProfile,
  timeline,
  onAddSymptomToTimeline,
  onSelectQuickPrompt,
}) => {
  const [inputText, setInputText] = useState('');
  const [loggedSymptomIds, setLoggedSymptomIds] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  // Browser speech recognition support
  const toggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
        {/* Welcome Banner / Empty state */}
        {messages.length === 0 && (
          <div className="py-6 px-4 text-center max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
              <Bot className="w-8 h-8 stroke-[2]" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Hello, {userProfile.name.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-6 leading-relaxed max-w-lg mx-auto">
              I'm <span className="font-semibold text-teal-700">Copilot for Health</span>. Tell me how you're feeling, ask about a symptom, or share a health question in plain language.
            </p>

            {/* Quick Prompts Grid */}
            <div className="text-left mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
                Popular Questions & Prompts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => onSelectQuickPrompt(prompt.query)}
                    className="p-3 bg-white hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-200 rounded-2xl text-left transition-all group shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800 text-xs group-hover:text-teal-900">
                        {prompt.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{prompt.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${
                  isUser
                    ? 'bg-slate-700 shadow-slate-200'
                    : 'bg-teal-600 shadow-teal-200'
                }`}
              >
                {isUser ? 'YOU' : 'AI'}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none shadow-teal-100'
                    : message.isError
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                ) : (
                  <div className="space-y-3">
                    {/* Copilot Header Analysis Bar */}
                    {message.analysis && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <RiskBadge
                          level={message.analysis.riskLevel}
                          label={message.analysis.riskLabel}
                          isEmergency={message.analysis.isEmergency}
                        />

                        {message.analysis.timelineReferenceNote && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase tracking-wider">
                            <Clock className="w-3 h-3 text-teal-600" />
                            {message.analysis.timelineReferenceNote}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Emergency Alert Banner if critical */}
                    {message.analysis?.isEmergency && message.analysis.emergencyWarning && (
                      <div className="p-3 bg-rose-100/90 border border-rose-200 rounded-xl text-rose-950 font-medium flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-rose-900 text-xs">Emergency Alert</p>
                          <p className="text-xs text-rose-900/90">{message.analysis.emergencyWarning}</p>
                        </div>
                      </div>
                    )}

                    {/* Main Explanation */}
                    {message.analysis ? (
                      <div className="markdown-body text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
                        <ReactMarkdown>{message.analysis.explanation}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-xs sm:text-sm">{message.text}</p>
                    )}

                    {/* Possible Causes List */}
                    {message.analysis?.possibleCauses && message.analysis.possibleCauses.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          Potential Non-Diagnostic Causes
                        </p>
                        <ul className="list-disc pl-4 text-slate-600 text-xs space-y-1">
                          {message.analysis.possibleCauses.map((cause, idx) => (
                            <li key={idx}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps List */}
                    {message.analysis?.nextSteps && message.analysis.nextSteps.length > 0 && (
                      <div className="p-3 bg-teal-50/50 rounded-xl text-xs text-slate-700 border border-teal-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          Immediate Recommendation & Care
                        </p>
                        <ul className="space-y-1.5 text-slate-700 text-xs">
                          {message.analysis.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Add to Timeline Action */}
                    {message.analysis?.symptomDetected && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          Identified symptom: <strong className="text-slate-800">{message.analysis.symptomDetected}</strong>
                        </span>

                        {loggedSymptomIds[message.id] ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Logged in Timeline
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onAddSymptomToTimeline(
                                message.analysis!.symptomDetected!,
                                message.analysis!.riskLevel,
                                message.analysis!.explanation.slice(0, 120) + '...'
                              );
                              setLoggedSymptomIds((prev) => ({ ...prev, [message.id]: true }));
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-teal-600" /> Log to Timeline
                          </button>
                        )}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-[10px] text-slate-400 text-right pt-1">
                      {message.timestamp}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs rounded-tl-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-medium text-slate-500 ml-1">Analyzing health query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                isListening
                  ? 'bg-rose-100 text-rose-600 animate-pulse'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice dictation'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Describe your symptom, question, or health concern..."
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none py-1.5 max-h-32 min-h-[2.25rem]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-all shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Copilot uses AI to provide educational health guidance. Always seek doctor advice for medical concerns.
          </p>
        </form>
      </div>
    </div>
  );
};
