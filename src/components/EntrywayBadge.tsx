import React from 'react';
import { Sparkles } from 'lucide-react';

interface EntrywayBadgeProps {
  deviceCount: number;
}

export const EntrywayBadge: React.FC<EntrywayBadgeProps> = ({ deviceCount }) => {
  return (
  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-sm text-[14px]">
    <Sparkles className="w-4 h-4 text-sky-400" />
    <span className="font-bold">Entryway Zone: {deviceCount} Essential Ring Devices</span>
    <span className="text-slate-400">·</span>
    <span className="text-sky-300 font-medium">Click any device to interact</span>
  </div>
  );
};
