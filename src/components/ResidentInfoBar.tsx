import React from 'react';
import { Cloud } from 'lucide-react';
import type { ResidentProfile } from '@/lib/types/profile';
interface ResidentInfoBarProps {
  profile: ResidentProfile;
  deviceCount?: number;
}
export const ResidentInfoBar: React.FC<ResidentInfoBarProps> = ({
  profile,
  deviceCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] text-[16px] text-slate-700">
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold text-slate-900 text-[18px]">{profile.name}</span>
          <span className="text-slate-400">·</span>
          <span>{profile.age} years old</span>
          <span className="text-slate-400">·</span>
          <span>{profile.address}</span>
        </div>

        <div className="flex items-center gap-2 text-[14px] text-sky-700 font-semibold bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-100 self-start md:self-auto">
          <Cloud className="w-4 h-4 fill-sky-200" />
          <span>{deviceCount} Ring Devices Active</span>
        </div>
      </div>
  );
};