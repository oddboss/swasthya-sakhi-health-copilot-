import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Sparkles, Send, RefreshCw } from 'lucide-react';
import { OrbState, ChatMessage } from '../types';

interface OrbCoreProps {
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  onSendMessage: (text: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickPromptSelect?: (prompt: string) => void;
}

export const OrbCore: React.FC<OrbCoreProps> = ({
  orbState,
  setOrbState,
  onSendMessage,
  messages,
  isLoading,
  onQuickPromptSelect,
}) => {
  const [inputText, setInputText] = useState('');
  const [transcript, setTranscript] = useState('Tap to speak or type your symptoms...');
  const [isDictating, setIsDictating] = useState(false);
  const [audioBars, setAudioBars] = useState<number[]>([30, 60, 45, 80, 50, 90, 40, 70, 35, 65, 85, 40]);

  // Audio waveform animation loop when listening or speaking
  useEffect(() => {
    if (orbState === 'listening' || orbState === 'speaking') {
      const interval = setInterval(() => {
        setAudioBars((prev) =>
          prev.map(() => Math.floor(Math.random() * (orbState === 'speaking' ? 80 : 60) + 20))
        );
      }, 120);
      return () => clearInterval(interval);
    } else {
      setAudioBars([20, 35, 25, 40, 30, 45, 25, 35, 20, 30, 25, 20]);
    }
  }, [orbState]);

  // Handle Speech Recognition if supported, or simulated dictation
  const handleToggleVoice = () => {
    if (orbState === 'listening') {
      setOrbState('idle');
      setIsDictating(false);
      setTranscript('Tap to speak or type your symptoms...');
    } else {
      setOrbState('listening');
      setIsDictating(true);
      setTranscript('Listening... Describe how you are feeling...');

      // Browser SpeechRecognition fallback
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
            setTranscript(text);
            setInputText(text);
          };

          recognition.onend = () => {
            setOrbState('speaking');
            setTimeout(() => {
              setOrbState('idle');
              setIsDictating(false);
            }, 3000);
          };

          recognition.start();
        } catch {
          // simulated fallback if error
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    const mockSpeeches = [
      "I'm feeling a bit dizzy and lightheaded after sitting at my desk.",
      "I have a throbbing headache on my right side that started two hours ago.",
      "My throat feels sore and scratchy, and I have a low fever.",
      "I'm experiencing mild nausea and tightness in my neck muscles."
    ];
    const speech = mockSpeeches[Math.floor(Math.random() * mockSpeeches.length)];
    let index = 0;

    const interval = setInterval(() => {
      index += 3;
      setTranscript(speech.slice(0, index));
      setInputText(speech.slice(0, index));
      if (index >= speech.length) {
        clearInterval(interval);
        setOrbState('speaking');
        setTimeout(() => {
          setOrbState('idle');
          setIsDictating(false);
        }, 2000);
      }
    }, 100);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText('');
    setTranscript('Processing your response with Aura AI...');
    setOrbState('listening');

    try {
      await onSendMessage(textToSend);
      setOrbState('speaking');
      setTimeout(() => {
        setOrbState('idle');
        setTranscript('Tap to speak or type your symptoms...');
      }, 3500);
    } catch {
      setOrbState('idle');
      setTranscript('Tap to speak or type your symptoms...');
    }
  };

  const latestCopilotMessage = [...messages].reverse().find((m) => m.sender === 'copilot');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-6 relative overflow-hidden">
      {/* Background radial ambient light behind orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-sky-500/15 to-emerald-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Orb State Switcher Buttons (for testing & state preview) */}
      <div className="absolute top-2 right-2 sm:right-6 flex items-center gap-1.5 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs z-20">
        <span className="text-[10px] font-semibold text-purple-300/70 uppercase px-2 hidden sm:inline tracking-wider">
          Orb State:
        </span>
        <button
          onClick={() => setOrbState('idle')}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            orbState === 'idle'
              ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Idle
        </button>
        <button
          onClick={() => setOrbState('listening')}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            orbState === 'listening'
              ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Listening
        </button>
        <button
          onClick={() => setOrbState('speaking')}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            orbState === 'speaking'
              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Speaking
        </button>
      </div>

      {/* Zero-Gravity Concentric Depth Rings & Floating Particles */}
      <div className="relative flex items-center justify-center my-8">
        {/* Outer concentric zero-gravity rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-white/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] rounded-full border border-dashed border-purple-400/20 pointer-events-none"
        />

        {/* Radiating pastel glow rings when active */}
        <AnimatePresence>
          {(orbState === 'listening' || orbState === 'speaking') && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-52 h-52 rounded-full border-2 border-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.3)] pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
                className="absolute w-52 h-52 rounded-full border-2 border-sky-400/30 shadow-[0_0_30px_rgba(56,189,248,0.3)] pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>

        {/* 3D Glassmorphic Voice Orb */}
        <motion.div
          animate={
            orbState === 'idle'
              ? {
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                  borderRadius: [
                    '50%',
                    '48% 52% 51% 49% / 51% 49% 52% 48%',
                    '50%',
                  ],
                }
              : orbState === 'listening'
              ? {
                  scale: [1, 1.12, 1.02, 1.15, 1],
                  borderRadius: [
                    '50%',
                    '42% 58% 65% 35% / 45% 55% 45% 55%',
                    '55% 45% 38% 62% / 60% 40% 60% 40%',
                    '50%',
                  ],
                }
              : {
                  scale: [1, 1.18, 0.98, 1.12, 1],
                  borderRadius: [
                    '50%',
                    '60% 40% 50% 50% / 40% 60% 50% 50%',
                    '45% 55% 60% 40% / 50% 50% 40% 60%',
                    '50%',
                  ],
                }
          }
          transition={{
            duration: orbState === 'idle' ? 4 : orbState === 'listening' ? 1.8 : 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full cursor-pointer group flex items-center justify-center select-none"
          onClick={handleToggleVoice}
          title="Click to activate voice interaction"
        >
          {/* Glass Orb Inner Layers for Glass Refraction & Light */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              orbState === 'idle'
                ? 'bg-gradient-to-tr from-purple-600/30 via-indigo-500/20 to-sky-400/30 shadow-[0_0_60px_rgba(168,85,247,0.35),inset_0_0_35px_rgba(255,255,255,0.4)]'
                : orbState === 'listening'
                ? 'bg-gradient-to-tr from-sky-500/40 via-purple-500/30 to-emerald-400/30 shadow-[0_0_80px_rgba(56,189,248,0.5),inset_0_0_45px_rgba(255,255,255,0.6)]'
                : 'bg-gradient-to-tr from-emerald-500/40 via-sky-400/30 to-purple-500/40 shadow-[0_0_90px_rgba(52,211,153,0.6),inset_0_0_50px_rgba(255,255,255,0.7)]'
            } backdrop-blur-2xl border border-white/30`}
          />

          {/* Liquid Core Radial Swirl */}
          <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.6),_rgba(168,85,247,0.2)_40%,_transparent_70%)] opacity-80" />

          {/* Top Glass Highlight Arc */}
          <div className="absolute top-4 left-8 right-8 h-10 rounded-t-full bg-gradient-to-b from-white/60 to-transparent blur-[1px] opacity-70 pointer-events-none" />

          {/* Center Orb Icon / Wave Trigger */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white space-y-1">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${
                orbState === 'listening'
                  ? 'bg-sky-500/40 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                  : orbState === 'speaking'
                  ? 'bg-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                  : 'bg-white/10 group-hover:bg-purple-500/30 text-white'
              }`}
            >
              {orbState === 'listening' ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : orbState === 'speaking' ? (
                <Volume2 className="w-8 h-8 animate-bounce" />
              ) : (
                <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
            </div>

            <span className="text-[11px] font-medium tracking-widest uppercase text-white/80">
              {orbState === 'listening'
                ? 'Listening...'
                : orbState === 'speaking'
                ? 'Aura Speaking'
                : 'Aura Core'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Audio Waveform Bar (Screen 2 Reactive Audio Bar) */}
      <div className="flex items-center justify-center gap-1.5 h-10 my-2">
        {audioBars.map((height, idx) => (
          <motion.div
            key={idx}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.15, ease: 'linear' }}
            className={`w-1 rounded-full transition-colors ${
              orbState === 'listening'
                ? 'bg-gradient-to-t from-sky-500 to-purple-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                : orbState === 'speaking'
                ? 'bg-gradient-to-t from-emerald-400 to-sky-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                : 'bg-white/20'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Live Transcript / Caption Glass Strip */}
      <div className="w-full max-w-xl my-3 px-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-3 text-center sm:text-left border border-white/15 relative shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
            <p className="text-sm text-slate-200 font-medium truncate italic leading-relaxed">
              "{transcript}"
            </p>
          </div>
          <button
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl shrink-0 transition-all ${
              orbState === 'listening'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-purple-500/30 text-purple-200 border border-purple-400/40 hover:bg-purple-500/50'
            }`}
            title={orbState === 'listening' ? 'Stop Listening' : 'Start Voice Input'}
          >
            {orbState === 'listening' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Recent AI Response Glass Box if available */}
      {latestCopilotMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl my-2 glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-xs text-slate-200 space-y-2"
        >
          <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Aura Intelligence Analysis
            </span>
            <span>{latestCopilotMessage.timestamp}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{latestCopilotMessage.text}</p>
        </motion.div>
      )}

      {/* Input Box + Submit Button */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type symptoms or ask health questions..."
            disabled={isLoading}
            className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all backdrop-blur-md"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-xl glass-button-glow text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {/* Quick Prompt Chips */}
      <div className="w-full max-w-xl mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mr-1">
          Quick Prompts:
        </span>
        {[
          'Dizzy & lightheaded for 20 mins',
          'Sharp headache on left temple',
          'Sore throat & low fever',
          'Check drug interactions',
        ].map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(promptText);
              if (onQuickPromptSelect) onQuickPromptSelect(promptText);
            }}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-300 hover:text-white transition-all backdrop-blur-sm"
          >
            {promptText}
          </button>
        ))}
      </div>
    </div>
  );
};
