import React, { useState } from 'react';
import { 
  ShieldAlert,
  X,
  UserCheck,
  Check,
  MapPin,
  PhoneCall,
} from 'lucide-react';
import type { ResidentProfile } from '@/lib/types/profile';
import { ambientAudio } from '@/utils/audioChime';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ResidentProfile;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [escalationStatus, setEscalationStatus] = useState<{
    neighbor: 'idle' | 'alerting' | 'notified';
    ems: 'idle' | 'calling' | 'dispatched';
  }>({
    neighbor: 'idle',
    ems: 'idle',
  });

  if (!isOpen) return null;

  const handleAlertNeighbor = () => {
    setEscalationStatus((prev) => ({ ...prev, neighbor: 'alerting' }));
    ambientAudio.playPhoneRingTone();
    setTimeout(() => {
      setEscalationStatus((prev) => ({ ...prev, neighbor: 'notified' }));
    }, 1200);
  };

  const handleDispatchEMS = () => {
    setEscalationStatus((prev) => ({ ...prev, ems: 'calling' }));
    ambientAudio.playEmergencyTone();
    setTimeout(() => {
      setEscalationStatus((prev) => ({ ...prev, ems: 'dispatched' }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900">
                Emergency Protocol
              </h3>
              <p className="text-[14px] text-rose-800 font-medium">
                Night door opened at 03:15 AM · Rapid intervention
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Escalation Tiers */}
        <div className="space-y-3.5">
          {/* Tier 1: Neighbor Helper (Thomas Campbell) */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-950 font-bold text-[14px] flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[15px]">
                    Neighbor: {profile.neighborHelper.name}
                  </div>
                  <div className="text-[13px] text-amber-900 font-medium">
                    Nearest contact for urgent porch check
                  </div>
                </div>
              </div>
              <div className="text-[14px] text-slate-600 font-mono shrink-0">
                {profile.neighborHelper.phone}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAlertNeighbor}
              className={`w-full py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                escalationStatus.neighbor === 'notified'
                  ? 'bg-emerald-600 text-white'
                  : escalationStatus.neighbor === 'alerting'
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {escalationStatus.neighbor === 'notified' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Neighbor Alerted ✓</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{escalationStatus.neighbor === 'alerting' ? 'Alerting...' : 'Alert Neighbor'}</span>
                </>
              )}
            </button>
          </div>

          {/* Tier 2: Municipal Emergency Services (911) */}
          <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-950 font-bold text-[14px] flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-rose-950 text-[15px]">
                    Emergency Services (911)
                  </div>
                  <div className="text-[13px] text-rose-800 font-medium">
                    If resident is missing or in medical distress
                  </div>
                </div>
              </div>
              <div className="text-[14px] text-rose-700 font-mono font-bold shrink-0">
                Dial 911
              </div>
            </div>

            {/* Address ready for 911 dispatch - 2-line layout without truncation */}
            <div className="p-3 bg-white/95 rounded-xl border border-rose-200 space-y-1 text-slate-800">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-rose-800 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Address for 911 Dispatch:</span>
              </div>
              <div className="font-bold text-[14px] text-slate-900 leading-snug">
                {profile.address}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDispatchEMS}
              className={`w-full py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                escalationStatus.ems === 'dispatched'
                  ? 'bg-rose-900 text-white'
                  : escalationStatus.ems === 'calling'
                  ? 'bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {escalationStatus.ems === 'dispatched' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Call Sent (911)</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>{escalationStatus.ems === 'calling' ? 'Calling 911...' : 'Call 911'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
