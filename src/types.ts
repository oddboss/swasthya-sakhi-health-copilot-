export type RiskLevel = 'low' | 'monitor' | 'see_doctor';

export type NavTab = 'home' | 'symptoms' | 'assistant' | 'scanner' | 'records' | 'medications' | 'reports' | 'profile' | 'settings' | 'triage';

export type OrbState = 'idle' | 'listening' | 'speaking' | 'thinking';

export type RecordSubTab = 'history' | 'trends' | 'medications' | 'reports' | 'family';

export interface HealthMetricPoint {
  id: string;
  date: string;
  timestamp: number;
  heartRate: number;
  restingHeartRate: number;
  temperature: number; // in °F
  systolic: number; // mmHg
  diastolic: number; // mmHg
  spO2: number; // %
  readinessScore: number; // %
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number | string;
  gender: string;
  bloodType?: string;
  existingConditions: string[];
  allergies: string[];
  medications: string[];
  notes: string;
  theme?: 'deep-space' | 'clinical';
}

export interface AIResponseAnalysis {
  riskLevel: RiskLevel;
  riskLabel: string;
  explanation: string;
  possibleCauses: string[];
  nextSteps: string[];
  symptomDetected?: string | null;
  timelineReferenceNote?: string | null;
  isEmergency: boolean;
  emergencyWarning?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  analysis?: AIResponseAnalysis;
  isError?: boolean;
}

export interface TimelineItem {
  id: string;
  timestamp: number;
  dateFormatted: string;
  symptom: string;
  riskLevel: RiskLevel;
  details: string;
  relatedMessageId?: string;
  status: 'active' | 'resolved' | 'monitoring';
}

export interface MedicineScanResult {
  id: string;
  name: string;
  strength: string;
  batchNo: string;
  expiryDate: string;
  manufacturer: string;
  dosage: string;
  activeIngredient: string;
  warnings: string;
  scannedAt: string;
  imageUrl?: string;
}

export interface QuickPrompt {
  id: string;
  title: string;
  subtitle: string;
  query: string;
  category: 'common' | 'urgent' | 'wellness' | 'tracking';
  icon: string;
}

