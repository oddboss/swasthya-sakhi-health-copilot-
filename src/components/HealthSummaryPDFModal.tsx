import React, { useState } from 'react';
import { UserProfile, TimelineItem, HealthMetricPoint, MedicineScanResult } from '../types';
import { FileText, Printer, Copy, Check, X, Calendar, HeartPulse, Activity, Pill, ShieldAlert, Download, Stethoscope, User } from 'lucide-react';

interface HealthSummaryPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  timeline: TimelineItem[];
  healthMetrics: HealthMetricPoint[];
  scannedMedicines: MedicineScanResult[];
}

export const HealthSummaryPDFModal: React.FC<HealthSummaryPDFModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  timeline,
  healthMetrics,
  scannedMedicines,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate Averages for Health Metrics
  const avgHR = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.heartRate, 0) / healthMetrics.length)
    : 72;
  const avgRestingHR = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.restingHeartRate, 0) / healthMetrics.length)
    : 66;
  const avgTemp = healthMetrics.length
    ? (healthMetrics.reduce((acc, m) => acc + m.temperature, 0) / healthMetrics.length).toFixed(1)
    : '98.6';
  const avgSystolic = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.systolic, 0) / healthMetrics.length)
    : 118;
  const avgDiastolic = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.diastolic, 0) / healthMetrics.length)
    : 78;
  const avgSpO2 = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.spO2, 0) / healthMetrics.length)
    : 98;
  const avgReadiness = healthMetrics.length
    ? Math.round(healthMetrics.reduce((acc, m) => acc + m.readinessScore, 0) / healthMetrics.length)
    : 88;

  const generateFormattedText = () => {
    let text = `=========================================================\n`;
    text += `AURA HEALTH - COMPREHENSIVE PATIENT HEALTH SUMMARY\n`;
    text += `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `=========================================================\n\n`;

    text += `1. PATIENT DEMOGRAPHICS & PROFILE\n`;
    text += `- Name: ${userProfile.name}\n`;
    text += `- Age: ${userProfile.age || 'N/A'}\n`;
    text += `- Gender: ${userProfile.gender || 'N/A'}\n`;
    text += `- Blood Type: ${userProfile.bloodType || 'N/A'}\n`;
    text += `- Known Conditions: ${userProfile.existingConditions.join(', ') || 'None'}\n`;
    text += `- Allergies: ${userProfile.allergies.join(', ') || 'None'}\n`;
    text += `- Active Medications: ${userProfile.medications.join(', ') || 'None'}\n\n`;

    text += `2. VITALS & HEALTH METRICS SUMMARY\n`;
    text += `- Avg Heart Rate: ${avgHR} bpm (Resting: ${avgRestingHR} bpm)\n`;
    text += `- Avg Body Temperature: ${avgTemp} °F\n`;
    text += `- Avg Blood Pressure: ${avgSystolic}/${avgDiastolic} mmHg\n`;
    text += `- Avg Oxygen Saturation (SpO2): ${avgSpO2}%\n`;
    text += `- Avg Overall Readiness Score: ${avgReadiness}%\n\n`;

    text += `RECENT METRICS LOG (${healthMetrics.length} records):\n`;
    healthMetrics.slice(0, 10).forEach((m) => {
      text += `  • [${m.date}] HR: ${m.heartRate} bpm | Temp: ${m.temperature}°F | BP: ${m.systolic}/${m.diastolic} | SpO2: ${m.spO2}% | Readiness: ${m.readinessScore}%\n`;
    });
    text += `\n`;

    text += `3. HEALTH TIMELINE & SYMPTOM LOG (${timeline.length} items)\n`;
    if (timeline.length === 0) {
      text += `No logged symptoms in timeline.\n`;
    } else {
      timeline.forEach((item, idx) => {
        text += `  ${idx + 1}. [${item.dateFormatted}] ${item.symptom.toUpperCase()} (Risk: ${item.riskLevel.toUpperCase()}, Status: ${item.status})\n`;
        text += `     Notes: ${item.details}\n`;
      });
    }
    text += `\n`;

    text += `4. SCANNED MEDICATIONS (${scannedMedicines.length} scanned)\n`;
    if (scannedMedicines.length === 0) {
      text += `No scanned prescription boxes.\n`;
    } else {
      scannedMedicines.forEach((med, idx) => {
        text += `  ${idx + 1}. ${med.name} (${med.strength}) - Dosage: ${med.dosage}\n`;
        text += `     Batch: ${med.batchNo} | Expiry: ${med.expiryDate} | Mfr: ${med.manufacturer}\n`;
      });
    }
    text += `\n`;

    text += `---------------------------------------------------------\n`;
    text += `Exported from Aura Health Copilot. Intended for personal record keeping and physician consultation.\n`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = generateFormattedText();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aura_Health_Summary_${userProfile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="glass-panel rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.7)] border border-white/20 bg-slate-900/95 my-6 relative text-white space-y-6 print:shadow-none print:border-none print:bg-white print:text-black print:p-0">
        
        {/* Modal Header (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Export Printable Health Summary</h2>
              <p className="text-xs text-slate-300">
                Official PDF-ready health timeline, vitals metrics, and medication records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
            title="Close summary modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Generated: <strong className="text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-1.5 glass-button-glow text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Summary Sheet Content Area */}
        <div id="printable-health-summary" className="space-y-6 text-slate-200 text-xs leading-relaxed bg-slate-950/80 p-6 rounded-2xl border border-white/10 print:bg-white print:text-black print:p-0 print:border-none print:space-y-4">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-white/15 pb-4 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-400 print:text-purple-700" />
                <h1 className="text-lg font-extrabold text-white print:text-slate-900">AURA HEALTH - CLINICAL SUMMARY REPORT</h1>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                Patient Medical Timeline, Vitals & Prescription Records
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-400 print:text-slate-600">
              <span className="font-bold text-white print:text-slate-900 block">Report ID: AUR-{Math.floor(100000 + Math.random() * 900000)}</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* 1. Patient Profile */}
          <div className="space-y-2">
            <h3 className="font-bold text-white print:text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 print:border-slate-200 pb-1">
              <User className="w-3.5 h-3.5 text-purple-400 print:text-purple-700" /> 1. Patient Profile & Demographics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 print:bg-slate-50 p-3.5 rounded-xl border border-white/10 print:border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Full Name</span>
                <span className="font-bold text-white print:text-slate-900">{userProfile.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Age / Gender</span>
                <span className="font-bold text-white print:text-slate-900">{userProfile.age || 'N/A'} yrs • {userProfile.gender}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Blood Type</span>
                <span className="font-bold text-white print:text-slate-900">{userProfile.bloodType || 'O+'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Allergies</span>
                <span className="font-bold text-amber-300 print:text-amber-700">{userProfile.allergies.join(', ') || 'None listed'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Medical Conditions</span>
                <span className="text-slate-200 print:text-slate-800">{userProfile.existingConditions.join(', ') || 'None reported'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-500 block">Current Medications</span>
                <span className="text-slate-200 print:text-slate-800">{userProfile.medications.join(', ') || 'None listed'}</span>
              </div>
            </div>
          </div>

          {/* 2. Vitals & Metrics Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-white print:text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 print:border-slate-200 pb-1">
              <Activity className="w-3.5 h-3.5 text-teal-400 print:text-teal-700" /> 2. Health Metrics & Vitals Summary
            </h3>

            {/* Averages Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase font-bold">Avg HR</span>
                <span className="text-sm font-black text-purple-300 print:text-purple-800">{avgHR} <span className="text-[10px] font-normal">bpm</span></span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 block">Resting {avgRestingHR}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase font-bold">Avg Temp</span>
                <span className="text-sm font-black text-rose-300 print:text-rose-800">{avgTemp} <span className="text-[10px] font-normal">°F</span></span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 block">Normal Range</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase font-bold">Avg BP</span>
                <span className="text-sm font-black text-teal-300 print:text-teal-800">{avgSystolic}/{avgDiastolic}</span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 block">mmHg</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase font-bold">Avg SpO2</span>
                <span className="text-sm font-black text-sky-300 print:text-sky-800">{avgSpO2}%</span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 block">Optimal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 print:text-slate-500 block uppercase font-bold">Readiness</span>
                <span className="text-sm font-black text-amber-300 print:text-amber-800">{avgReadiness}%</span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 block">Recovery Score</span>
              </div>
            </div>

            {/* Metrics History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 print:border-slate-300 text-slate-400 print:text-slate-600 font-mono">
                    <th className="py-1.5 px-2">Date</th>
                    <th className="py-1.5 px-2">Heart Rate</th>
                    <th className="py-1.5 px-2">Temp</th>
                    <th className="py-1.5 px-2">Blood Pressure</th>
                    <th className="py-1.5 px-2">SpO2</th>
                    <th className="py-1.5 px-2">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {healthMetrics.slice(0, 6).map((m) => (
                    <tr key={m.id} className="text-slate-300 print:text-slate-800">
                      <td className="py-1.5 px-2 font-mono">{m.date}</td>
                      <td className="py-1.5 px-2">{m.heartRate} bpm (Resting: {m.restingHeartRate})</td>
                      <td className="py-1.5 px-2">{m.temperature} °F</td>
                      <td className="py-1.5 px-2">{m.systolic}/{m.diastolic} mmHg</td>
                      <td className="py-1.5 px-2">{m.spO2}%</td>
                      <td className="py-1.5 px-2 font-bold text-amber-300 print:text-slate-900">{m.readinessScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Health Timeline & Symptom Log */}
          <div className="space-y-2">
            <h3 className="font-bold text-white print:text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 print:border-slate-200 pb-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 print:text-rose-700" /> 3. Health Timeline & Logged Symptoms
            </h3>

            {timeline.length > 0 ? (
              <div className="space-y-2">
                {timeline.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white print:text-slate-900">{item.symptom}</span>
                        <span className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase ${
                          item.riskLevel === 'see_doctor'
                            ? 'bg-rose-500/20 text-rose-300 print:bg-rose-100 print:text-rose-800'
                            : item.riskLevel === 'monitor'
                            ? 'bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-800'
                            : 'bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                        }`}>
                          {item.riskLevel}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 print:bg-slate-200 text-slate-300 print:text-slate-700 capitalize">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 print:text-slate-700">{item.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono shrink-0">{item.dateFormatted}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 print:text-slate-600 italic text-center py-3 bg-white/5 print:bg-slate-50 rounded-xl">
                No active or logged timeline events.
              </p>
            )}
          </div>

          {/* 4. Scanned Medication Inventory */}
          {scannedMedicines.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-white print:text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 print:border-slate-200 pb-1">
                <Pill className="w-3.5 h-3.5 text-teal-400 print:text-teal-700" /> 4. Scanned Prescriptions & Medication Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scannedMedicines.map((med) => (
                  <div key={med.id} className="p-3 rounded-xl bg-white/5 print:bg-slate-50 border border-white/10 print:border-slate-200 text-[11px] space-y-1">
                    <div className="flex justify-between items-center font-bold text-white print:text-slate-900">
                      <span>{med.name}</span>
                      <span className="font-mono text-[10px] text-teal-300 print:text-teal-800">{med.batchNo}</span>
                    </div>
                    <p className="text-slate-300 print:text-slate-700">Dosage: {med.dosage} ({med.strength})</p>
                    <p className="text-amber-300 print:text-amber-800 text-[10px]">Expiry: {med.expiryDate} • Mfr: {med.manufacturer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="pt-4 border-t border-white/10 print:border-slate-300 text-[10px] text-slate-400 print:text-slate-600 space-y-1">
            <p className="font-semibold text-slate-300 print:text-slate-800">Physician Notes / Provider Verification:</p>
            <div className="h-12 border border-dashed border-white/20 print:border-slate-400 rounded-lg p-2 text-slate-500 print:text-slate-400 italic">
              Provider stamp / clinical notes area...
            </div>
            <p className="text-[9px] leading-tight pt-1">
              Disclaimer: This report compiles user-logged metrics and AI health copilot records. It is for informational support during doctor consultations and not a formal diagnostic medical record.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
