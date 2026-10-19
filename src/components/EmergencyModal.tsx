import React, { useState } from 'react';
import { 
  ShieldAlert,
  X,
  Phone,
  UserCheck,
  PhoneForwarded,
  Check,
  AlertTriangle,
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
    caregiver: 'idle' | 'calling' | 'notified';
    neighbor: 'idle' | 'alerting' | 'notified';
    ems: 'idle' | 'calling' | 'dispatched';
  }>({
    caregiver: 'idle',
    neighbor: 'idle',
    ems: 'idle',
  });

  if (!isOpen) return null;

  const handleCallCaregiver = () => {
    setEscalationStatus((prev) => ({ ...prev, caregiver: 'calling' }));
    ambientAudio.playPhoneRingTone();
    setTimeout(() => {
      setEscalationStatus((prev) => ({ ...prev, caregiver: 'notified' }));
    }, 1200);
  };

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

  const handleBroadcastEmergency = () => {
    ambientAudio.playEmergencyTone();
    setEscalationStatus({
      caregiver: 'calling',
      neighbor: 'alerting',
      ems: 'calling',
    });
    setTimeout(() => {
      setEscalationStatus({
        caregiver: 'notified',
        neighbor: 'notified',
        ems: 'dispatched',
      });
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
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-bold text-slate-900">
                  Emergency Escalation Protocol
                </h3>
              </div>
              <p className="text-[14px] text-rose-800 font-medium">
                Night Wandering Alert · Front Door Ajar at 03:15 AM
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

        {/* Resident Location Banner */}
        <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 text-[14px] text-rose-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{profile.name}</span>
            <span className="text-slate-500">· {profile.address}</span>
          </div>
          <button
            type="button"
            onClick={handleBroadcastEmergency}
            className="text-[14px] font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <PhoneForwarded className="w-3.5 h-3.5" />
            <span>Notify All</span>
          </button>
        </div>

        {/* 3 Escalation Tiers */}
        <div className="space-y-3">
          {/* Tier 1: Neighbor Helper (Thomas Campbell - Apt 4B) */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-950 font-bold text-[14px] flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[14px]">
                    {profile.neighborHelper.name}
                  </div>
                  <div className="text-[14px] text-amber-900 font-medium">
                    Next-door neighbor · 30s away
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
                  <span>Thomas Alerted</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{escalationStatus.neighbor === 'alerting' ? 'Alerting...' : 'Alert Neighbor to Check Porch'}</span>
                </>
              )}
            </button>
          </div>

          {/* Tier 2: Primary Family Caregiver (Sarah Holloway) */}
          <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-sky-200 text-sky-950 font-bold text-[14px] flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
                    <span>{profile.primaryCaregiver.name}</span>
                    <span className="text-slate-500 font-normal">({profile.primaryCaregiver.relationship})</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                  </div>
                  <div className="text-[14px] text-slate-600 font-mono">
                    {profile.primaryCaregiver.phone}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCallCaregiver}
              className={`w-full py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                escalationStatus.caregiver === 'notified'
                  ? 'bg-emerald-600 text-white'
                  : escalationStatus.caregiver === 'calling'
                  ? 'bg-sky-700 text-white animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {escalationStatus.caregiver === 'notified' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sarah Notified (SMS & Call Sent)</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>{escalationStatus.caregiver === 'calling' ? 'Calling...' : `Call ${profile.primaryCaregiver.name.split(' ')[0]}`}</span>
                </>
              )}
            </button>
          </div>

          {/* Tier 3: Municipal Emergency Services (911) */}
          <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-300 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-950 font-bold text-[14px] flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-rose-950 text-[14px]">
                    {profile.emergencyService.provider}
                  </div>
                  <div className="text-[14px] text-rose-800 font-medium">
                    Extreme Case: If resident is missing or unresponsive
                  </div>
                </div>
              </div>
              <div className="text-[14px] text-rose-700 font-mono font-bold shrink-0">
                Dial 911
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
                  <span>EMS Dispatched (911)</span>
                </>
              ) : (
                <>
                  <PhoneForwarded className="w-4 h-4" />
                  <span>{escalationStatus.ems === 'calling' ? 'Calling 911...' : 'Dispatch 911 (Bellevue EMS)'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
