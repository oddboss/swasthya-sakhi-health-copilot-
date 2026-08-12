import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, PhoneCall, ShieldAlert, MapPin, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedSymptoms?: string[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  matchedSymptoms = ['Chest Pain / Tightness', 'Shortness of Breath', 'Sudden Dizziness'],
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl bg-rose-950/70 border-2 border-rose-500/60 p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.4)] backdrop-blur-2xl text-center space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Emergency Pulsing Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse">
            <AlertOctagon className="w-10 h-10 text-rose-400" />
          </div>

          {/* Headline & Body */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              This May Be A Medical Emergency
            </h2>
            <p className="text-xs sm:text-sm text-rose-200 leading-relaxed">
              Based on severe red-flag indicators detected, immediate medical evaluation is strongly advised.
            </p>
          </div>

          {/* Matched Red-Flag Indicators */}
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/30 text-left space-y-2">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block">
              Flagged Emergency Indicators:
            </span>
            <div className="flex flex-wrap gap-2">
              {matchedSymptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-xs font-semibold text-rose-200"
                >
                  ⚠️ {sym}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-3">
            <a
              href="tel:911"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(244,63,94,0.7)] transition-all transform hover:scale-[1.02]"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Call Emergency Services (911 / 108)</span>
            </a>

            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                onClick={() => {
                  alert("Locating nearby urgent care emergency rooms...");
                }}
                className="text-rose-300 hover:text-white flex items-center gap-1 font-medium underline underline-offset-4"
              >
                <MapPin className="w-3.5 h-3.5" /> Find Nearby ER
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 font-medium"
              >
                I'm okay, dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
