import React, { useEffect, useState } from 'react';
import { Volume2, X, CheckCircle2, DoorClosed, Cloud } from 'lucide-react';
import { ambientAudio } from '../utils/audioChime';
import type { ResidentProfile } from '@/lib/types/profile';

interface ChimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ResidentProfile;
  onResidentAcknowledge?: () => void;
}

export const ChimeModal: React.FC<ChimeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onResidentAcknowledge,
}) => {
  const [residentAcknowledged, setResidentAcknowledged] = useState(false);
  const firstName = profile.name.split(' ')[0] || 'Resident';

  useEffect(() => {
    if (isOpen) {
      setResidentAcknowledged(false);
      ambientAudio.playGentleCheckinChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateResponse = () => {
    setResidentAcknowledged(true);
    onResidentAcknowledge?.();
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-sky-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Ambient Sound Wave Animation */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-sky-200 animate-ping opacity-60" />
          <div className="absolute inset-2 rounded-full border-2 border-sky-300 animate-pulse" />
          <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Volume2 className="w-8 h-8" />
          </div>
        </div>
        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-[20px] font-bold text-slate-900">In-Home Chime Played</h3>
          <p className="text-[15px] text-slate-600 leading-relaxed max-w-xs mx-auto">
            {`Soft chime played on ${firstName}'s entryway speaker.`}
          </p>
        </div>
        {/* Resident Action Simulation */}
        <div className="space-y-3 pt-2">
          {residentAcknowledged ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-[15px] font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{`${firstName} responded — all is safe and well!`}</span>
            </div>
          ) : (
            <button
              onClick={handleSimulateResponse}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-[15px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-sky-200"
            >
              <DoorClosed className="w-5 h-5" />
              <span>{`Simulate: ${firstName} touched door (Safe)`}</span>
            </button>
          )}
          <button
            onClick={() => ambientAudio.playGentleCheckinChime()}
            className="w-full py-2 text-[14px] font-semibold text-sky-700 hover:text-sky-800 transition-colors cursor-pointer"
          >
            Replay Chime
          </button>
        </div>
      </div>
    </div>
  );
};
