import React from 'react';
import { RiskLevel } from '../types';
import { AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  isEmergency?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  label,
  size = 'md',
  isEmergency = false,
}) => {
  if (isEmergency) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse uppercase tracking-wider">
        <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-rose-400 shrink-0" />
        Emergency Attention Needed
      </span>
    );
  }

  const getStyle = () => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          defaultText: 'Low Concern',
        };
      case 'monitor':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          defaultText: 'Monitor',
        };
      case 'see_doctor':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
          dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
          defaultText: 'See Doctor',
        };
      default:
        return {
          bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          dot: 'bg-slate-400',
          defaultText: 'General Info',
        };
    }
  };

  const style = getStyle();
  const text = label || style.defaultText;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-colors ${style.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${style.dot}`} />
      <span className="font-semibold tracking-wider uppercase">{text}</span>
    </span>
  );
};
