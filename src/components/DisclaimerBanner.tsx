import React, { useState } from 'react';
import { PhoneCall, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <>
      <footer className="h-8 bg-slate-900 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 border-t border-slate-800">
        <p className="text-[9px] text-slate-400 font-medium tracking-[0.1em] uppercase truncate max-w-4xl">
          <span className="text-rose-400 mr-1 font-black">Important Disclaimer:</span> Copilot for Health provides general guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>

        <button
          onClick={() => setShowEmergencyModal(true)}
          className="shrink-0 flex items-center gap-1 text-rose-300 hover:text-rose-200 font-semibold text-[10px] uppercase tracking-wider bg-rose-950/80 hover:bg-rose-900 px-2 py-0.5 rounded border border-rose-800/60 transition-all ml-3"
        >
          <PhoneCall className="w-3 h-3 text-rose-400" />
          <span className="hidden sm:inline">Emergency Contacts</span>
          <span className="sm:hidden">911</span>
        </button>
      </footer>

      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Medical Contacts</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              If you are experiencing severe chest pain, extreme shortness of breath, sudden weakness or numbness, or any life-threatening emergency, please seek immediate help:
            </p>

            <div className="space-y-2 mb-6">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-rose-900 text-sm">Emergency Services</p>
                  <p className="text-xs text-rose-700">Immediate dispatch (US/Canada)</p>
                </div>
                <a
                  href="tel:911"
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Call 911
                </a>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-teal-900 text-sm">24/7 Nurse Advice Line</p>
                  <p className="text-xs text-teal-700">Non-emergency triage guidance</p>
                </div>
                <span className="text-xs font-medium text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                  Contact Insurance / Local Provider
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};

