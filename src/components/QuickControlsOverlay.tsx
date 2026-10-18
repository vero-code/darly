import React from 'react';
import { Bell, DoorOpen, DoorClosed, Footprints } from 'lucide-react';

interface QuickControlsOverlayProps {
  isDoorbellRinging: boolean;
  onTriggerDoorbell: () => void;
  isDoorOpen: boolean;
  onToggleDoor: () => void;
  isMotionActive: boolean;
  onTriggerMotion: () => void;
}

export const QuickControlsOverlay: React.FC<QuickControlsOverlayProps> = ({
  isDoorbellRinging,
  onTriggerDoorbell,
  isDoorOpen,
  onToggleDoor,
  isMotionActive,
  onTriggerMotion,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Quick Doorbell Ring Button */}
      <button
        onClick={onTriggerDoorbell}
        className={`px-3.5 py-2 rounded-xl text-[14px] font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
          isDoorbellRinging
            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-200 animate-pulse'
            : 'bg-white/95 text-slate-800 hover:bg-sky-50 border border-sky-200'
        }`}
      >
        <Bell className={`w-4 h-4 ${isDoorbellRinging ? 'text-amber-900' : 'text-sky-500'}`} />
        <span>{isDoorbellRinging ? 'Doorbell Ringing...' : 'Ring Doorbell'}</span>
      </button>

      {/* Quick Door Toggle Button */}
      <button
        onClick={onToggleDoor}
        className={`px-3.5 py-2 rounded-xl text-[14px] font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
          isDoorOpen
            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-200'
            : 'bg-white/95 text-slate-800 hover:bg-sky-50 border border-sky-200'
        }`}
      >
        {isDoorOpen ? (
          <>
            <DoorOpen className="w-4 h-4 text-amber-900" />
            <span>Close Door</span>
          </>
        ) : (
          <>
            <DoorClosed className="w-4 h-4 text-sky-600" />
            <span>Open Door</span>
          </>
        )}
      </button>

      {/* Quick Motion Toggle Button */}
      <button
        onClick={onTriggerMotion}
        className={`px-3.5 py-2 rounded-xl text-[14px] font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
          isMotionActive
            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-200 animate-pulse'
            : 'bg-white/95 text-slate-800 hover:bg-sky-50 border border-sky-200'
        }`}
      >
        <Footprints className={`w-4 h-4 ${isMotionActive ? 'text-amber-900' : 'text-sky-500'}`} />
        <span>{isMotionActive ? 'Motion in Foyer' : 'Walk through Foyer'}</span>
      </button>
    </div>
  );
};
