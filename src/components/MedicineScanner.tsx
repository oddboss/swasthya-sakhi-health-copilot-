import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Scan, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Tag, Calendar, Building, Pill } from 'lucide-react';
import { MedicineScanResult } from '../types';

interface MedicineScannerProps {
  onConfirmScan: (medicine: MedicineScanResult) => void;
}

const SAMPLE_MEDICINES: MedicineScanResult[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin Trihydrate',
    strength: '500 mg',
    batchNo: 'AMX-2024-8891',
    expiryDate: '11/2027',
    manufacturer: 'Aura BioPharm Inc.',
    dosage: '1 capsule every 8 hours after meals',
    activeIngredient: 'Amoxicillin 500mg',
    warnings: 'Complete full course. Avoid if allergic to Penicillin.',
    scannedAt: 'Just now',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'med-2',
    name: 'Atorvastatin Calcium',
    strength: '20 mg',
    batchNo: 'LIP-2025-4420',
    expiryDate: '08/2026',
    manufacturer: 'Apex Global Health',
    dosage: '1 tablet daily at bedtime',
    activeIngredient: 'Atorvastatin 20mg',
    warnings: 'Avoid eating grapefruit or drinking grapefruit juice while taking.',
    scannedAt: 'Just now',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
  },
];

export const MedicineScanner: React.FC<MedicineScannerProps> = ({ onConfirmScan }) => {
  const [selectedScan, setSelectedScan] = useState<MedicineScanResult>(SAMPLE_MEDICINES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(SAMPLE_MEDICINES[0].imageUrl || null);
  const [scanConfirmed, setScanConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: MedicineScanResult) => {
    setSelectedScan(sample);
    setScannedImage(sample.imageUrl || null);
    triggerScanAnimation();
  };

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanConfirmed(false);
    setTimeout(() => {
      setIsScanning(false);
    }, 2400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setScannedImage(resultUrl);

        // Custom scanned item from user photo
        setSelectedScan({
          id: `scan-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').toUpperCase(),
          strength: 'Custom Prescription',
          batchNo: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
          expiryDate: '12/2028',
          manufacturer: 'Verified Pharma Ltd.',
          dosage: 'Follow prescribed healthcare guidance.',
          activeIngredient: 'Analyzed Active Compounds',
          warnings: 'Keep out of reach of children. Store below 25°C.',
          scannedAt: 'Just now',
          imageUrl: resultUrl,
        });

        triggerScanAnimation();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedicine = () => {
    onConfirmScan(selectedScan);
    setScanConfirmed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-8">
      {/* Page Title */}
      <div className="text-center max-w-xl mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-teal-400" />
          <span>AI Vision Medicine Scanner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Smart Label & Prescription Scan
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload or align a medicine package to extract batch number, expiry date, manufacturer, and dosage.
        </p>
      </div>

      {/* Main Viewfinder Stage */}
      <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 border border-white/20 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Glass Viewfinder Container */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-teal-400/40 bg-slate-950/80 flex items-center justify-center group shadow-inner">
            {scannedImage ? (
              <img
                src={scannedImage}
                alt="Medicine Scan"
                className="w-full h-full object-cover opacity-85"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <Pill className="w-12 h-12 text-teal-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400">Align medicine package inside frame</p>
              </div>
            )}

            {/* Glowing Wireframe Bounding Box */}
            <div className="absolute inset-6 rounded-xl border-2 border-dashed border-teal-300/80 shadow-[0_0_20px_rgba(45,212,191,0.4)] pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-teal-300" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-teal-300" />
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-teal-300" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-teal-300" />
              </div>
            </div>

            {/* Animated Laser-Line Sweep */}
            {(isScanning || scannedImage) && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(45,212,191,0.9)] animate-laser-sweep pointer-events-none" />
            )}

            {/* Floating Tag Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[10px] text-teal-300 font-mono flex items-center gap-1">
              <Scan className="w-3 h-3 text-teal-400 animate-spin" />
              <span>{isScanning ? 'ANALYZING Compound...' : 'AI Vision Locked'}</span>
            </div>
          </div>

          {/* Extracted Fields Tooltip Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" /> Extracted Parameters
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Verification
              </span>
            </div>

            {/* Extracted Fields Cards with Connector Look */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Medicine Name</span>
                  <span className="font-semibold text-white">{selectedScan.name} ({selectedScan.strength})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Batch Number</span>
                  <span className="font-mono font-semibold text-purple-200">{selectedScan.batchNo}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Expiry Date</span>
                  <span className="font-semibold text-amber-200">{selectedScan.expiryDate} (Valid)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Manufacturer</span>
                  <span className="font-semibold text-sky-200">{selectedScan.manufacturer}</span>
                </div>
              </div>
            </div>

            {/* Dosage & Warnings Summary */}
            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs space-y-1">
              <span className="font-bold text-teal-300 text-[10px] uppercase tracking-wider block">Dosage Guidance</span>
              <p className="text-slate-300">{selectedScan.dosage}</p>
            </div>
          </div>
        </div>

        {/* Sample Selector & Upload Action Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
            {SAMPLE_MEDICINES.map((med) => (
              <button
                key={med.id}
                onClick={() => handleSelectSample(med)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedScan.id === med.id
                    ? 'bg-teal-500/30 text-teal-200 border border-teal-400/50'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {med.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-medium flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" /> Upload Photo
            </button>

            <button
              onClick={handleSaveMedicine}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                scanConfirmed
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                  : 'glass-button-glow text-white'
              }`}
            >
              {scanConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added to Records!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Save to Records
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
