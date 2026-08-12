import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, ShieldAlert, ChevronRight, RotateCcw, Plus, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { RiskLevel, UserProfile, TimelineItem } from '../types';

interface SymptomTriageProps {
  userProfile: UserProfile;
  onAddTimelineItem: (item: Omit<TimelineItem, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onSelectEmergencySOS: () => void;
}

export const SymptomTriage: React.FC<SymptomTriageProps> = ({
  userProfile,
  onAddTimelineItem,
  onSelectEmergencySOS,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [onsetDuration, setOnsetDuration] = useState('Less than 24 hours');
  const [customNotes, setCustomNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const symptomOptions = [
    { id: 'chest_tightness', label: 'Chest tightness', isEmergency: true },
    { id: 'shortness_breath', label: 'Shortness of breath', isEmergency: true },
    { id: 'pain_arm', label: 'Pain spreading to arm or neck', isEmergency: true },
    { id: 'headache', label: 'Headache or Pressure', isEmergency: false },
    { id: 'fatigue', label: 'Fatigue or Lethargy', isEmergency: false },
    { id: 'none', label: 'None of these / Other mild symptoms', isEmergency: false },
  ];

  const handleSymptomToggle = (id: string) => {
    if (id === 'none') {
      setSelectedSymptoms(['none']);
      return;
    }
    setSelectedSymptoms((prev) => {
      const filtered = prev.filter((s) => s !== 'none');
      if (filtered.includes(id)) {
        return filtered.filter((s) => s !== id);
      } else {
        return [...filtered, id];
      }
    });
  };

  const hasEmergencySymptom = selectedSymptoms.some((s) =>
    ['chest_tightness', 'shortness_breath', 'pain_arm'].includes(s)
  );

  const handleNextStep = () => {
    if (hasEmergencySymptom) {
      onSelectEmergencySOS();
      return;
    }
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleSaveToRecords = () => {
    const riskLevel: RiskLevel = hasEmergencySymptom
      ? 'see_doctor'
      : severity === 'severe'
      ? 'see_doctor'
      : severity === 'moderate'
      ? 'monitor'
      : 'low';

    const symptomLabels = selectedSymptoms
      .map((s) => symptomOptions.find((o) => o.id === s)?.label)
      .filter(Boolean)
      .join(', ');

    onAddTimelineItem({
      symptom: customNotes.trim() || symptomLabels || 'General Symptom Check',
      riskLevel,
      details: `Clinical Questionnaire: Symptoms (${symptomLabels || 'None'}); Severity (${severity}); Onset (${onsetDuration}).`,
      status: riskLevel === 'see_doctor' ? 'active' : 'monitoring',
    });

    setIsCompleted(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setSeverity('mild');
    setOnsetDuration('Less than 24 hours');
    setCustomNotes('');
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Symptom Assessment
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured clinical evaluation to gauge health risk and recommended steps.
          </p>
        </div>

        {!isCompleted && (
          <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            Step {step} of 3
          </span>
        )}
      </div>

      {/* Emergency Alert Banner if acute high-risk symptom selected */}
      {hasEmergencySymptom && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 space-y-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Warning Detected
            </h3>
          </div>
          <p className="text-xs leading-relaxed">
            You selected symptoms associated with acute cardiovascular or respiratory distress. Please seek immediate emergency care.
          </p>
          <button
            onClick={onSelectEmergencySOS}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Open Emergency SOS (Call 911)</span>
          </button>
        </div>
      )}

      {!isCompleted ? (
        <div className="saas-card p-6 sm:p-8 space-y-6">
          {/* STEP 1: Symptom Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Are you currently experiencing any of these symptoms?
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select all that apply for clinical assessment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptomOptions.map((opt) => {
                  const isSelected = selectedSymptoms.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSymptomToggle(opt.id)}
                      className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-white text-indigo-600 border-white' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={selectedSymptoms.length === 0}
                  className="btn-primary disabled:opacity-40 text-xs px-6 py-2.5"
                >
                  <span>Continue to Severity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Severity & Onset */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  How severe are your symptoms?
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Rate the current intensity of your discomfort.
                </p>
              </div>

              {/* Severity Cards */}
              <div className="grid grid-cols-3 gap-3">
                {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`p-4 rounded-2xl border text-center uppercase tracking-wider text-xs font-bold transition-all ${
                      severity === sev
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Onset Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  How long have these symptoms lasted?
                </label>
                <select
                  value={onsetDuration}
                  onChange={(e) => setOnsetDuration(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Less than 2 hours">Less than 2 hours</option>
                  <option value="24 to 48 hours">24 to 48 hours</option>
                  <option value="More than 3 days">More than 3 days</option>
                  <option value="Persistent / Recurring">Persistent / Recurring</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Back
                </button>
                <button onClick={handleNextStep} className="btn-primary text-xs px-6 py-2.5">
                  <span>Continue to Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Notes & Final Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Additional Notes & Symptom Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add any specific observations for your health record.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Describe where the pain is located, what triggers it, or related medications..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveToRecords}
                  className="btn-primary text-xs px-6 py-2.5"
                >
                  <span>Save Assessment Result</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Summary View */
        <div className="saas-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Assessment Complete</h2>
            </div>
            <RiskBadge
              level={
                hasEmergencySymptom || severity === 'severe'
                  ? 'see_doctor'
                  : severity === 'moderate'
                  ? 'monitor'
                  : 'low'
              }
              size="lg"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-indigo-300">Assessment Summary</div>
            <p className="text-slate-300 leading-relaxed">
              Your reported symptoms have been saved to your health timeline. Vitals and symptom logs will continue to monitor your condition.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="btn-secondary text-xs py-2.5 flex-1 justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Perform Another Check</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
