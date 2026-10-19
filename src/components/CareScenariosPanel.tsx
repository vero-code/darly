import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Clock,
  Package,
  CheckCircle2,
  Info,
  Footprints,
  DoorOpen,
  DoorClosed,
  Bell,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { CARE_SCENARIOS, CareScenario, ScenarioEvent } from '@/lib/scenarios';
import type { ResidentProfile } from '@/lib/types/profile';
import { DEFAULT_RESIDENT_PROFILE } from '@/lib/mock-data';
import { ambientAudio } from '@/utils/audioChime';
import { EmergencyModal } from './EmergencyModal';

interface CareScenariosPanelProps {
  activeScenarioId: string;
  onSelectScenario: (scenario: CareScenario) => void;
  profile?: ResidentProfile;
  isDoorOpen?: boolean;
}

export const CareScenariosPanel: React.FC<CareScenariosPanelProps> = ({
  activeScenarioId,
  onSelectScenario,
  profile = DEFAULT_RESIDENT_PROFILE,
  isDoorOpen = false,
}) => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [routineCallNotified, setRoutineCallNotified] = useState(false);
  const [quickNeighborNotified, setQuickNeighborNotified] = useState(false);

  const handleRoutineCall = () => {
    ambientAudio.playPhoneRingTone();
    setRoutineCallNotified(true);
    setTimeout(() => setRoutineCallNotified(false), 3000);
  };

  const handleQuickNeighborAlert = () => {
    ambientAudio.playPhoneRingTone();
    setQuickNeighborNotified(true);
    setTimeout(() => setQuickNeighborNotified(false), 3000);
  };

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'normal_morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'night_wandering':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'missed_routine':
        return <Clock className="w-4 h-4 text-sky-500" />;
      case 'delivery_filter':
        return <Package className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-500" />;
    }
  };

  const getEventIcon = (eventType: ScenarioEvent['eventType']) => {
    switch (eventType) {
      case 'motion_detected':
        return <Footprints className="w-3.5 h-3.5 text-sky-500" />;
      case 'door_opened':
        return <DoorOpen className="w-3.5 h-3.5 text-amber-600" />;
      case 'door_closed':
        return <DoorClosed className="w-3.5 h-3.5 text-emerald-600" />;
      case 'ding':
        return <Bell className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: CareScenario['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-[13px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="text-[13px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            Check-in
          </span>
        );
      case 'safe':
        return (
          <span className="text-[13px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            Safe
          </span>
        );
      case 'info':
        return (
          <span className="text-[13px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
            Filtered
          </span>
        );
    }
  };

  const activeScenario = CARE_SCENARIOS.find((s) => s.id === activeScenarioId) || CARE_SCENARIOS[0];
  const isCritical = activeScenario.severity === 'critical';
  const isWarning = activeScenario.severity === 'warning';

  const getInferenceBoxStyles = () => {
    if (isCritical) {
      return 'bg-rose-50/90 border-rose-200 text-rose-950';
    }
    if (isWarning || isDoorOpen) {
      return 'bg-amber-50/90 border-amber-200 text-amber-950';
    }
    if (activeScenario.severity === 'safe') {
      return 'bg-emerald-50/90 border-emerald-200 text-emerald-950';
    }
    return 'bg-sky-50/90 border-sky-200 text-sky-950';
  };

  return (
    <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-3.5">
      {/* Header */}
      <div>
        <h4 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Care Scenarios</span>
        </h4>
        <p className="text-[14px] text-slate-500 mt-0.5">
          Select scenario to test entryway response:
        </p>
      </div>

      {/* 2x2 Grid of Scenarios */}
      <div className="grid grid-cols-2 gap-2">
        {CARE_SCENARIOS.map((scenario) => {
          const isSelected = activeScenarioId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-white border-sky-400 ring-2 ring-sky-200 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-sky-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                  {getScenarioIcon(scenario.id)}
                </div>
                {getSeverityBadge(scenario.severity)}
              </div>
              <div className="font-bold text-slate-800 text-[14px] leading-tight truncate">
                {scenario.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Caregiver Box */}
      {activeScenario && (
        <div className={`p-4 rounded-2xl border shadow-xs space-y-3 ${getInferenceBoxStyles()}`}>
          {/* Header */}
          <div className="flex items-center justify-between text-[14px] font-bold">
            <span className="flex items-center gap-2 text-slate-900">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Caregiver Insight</span>
            </span>

            {isCritical && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Critical Alert
              </span>
            )}

            {isWarning && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Check-in Advised
              </span>
            )}

            {isDoorOpen && !isCritical && !isWarning && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <DoorOpen className="w-3.5 h-3.5 text-amber-700" />
                Door Ajar
              </span>
            )}

            {activeScenario.severity === 'info' && !isDoorOpen && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                Noise Filtered
              </span>
            )}

            {activeScenario.severity === 'safe' && !isDoorOpen && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Routine Safe
              </span>
            )}
          </div>

          <p className="text-[14px] leading-relaxed font-medium">
            {isDoorOpen && activeScenario.severity === 'safe'
              ? 'ALERT: Front door is currently opened. Safety watchdog monitoring entryway duration.'
              : activeScenario.caregiverSummary}
          </p>

          {/* Detected Signals */}
          {activeScenario.events && activeScenario.events.length > 0 && (
            <div className="pt-2.5 border-t border-black/10 space-y-2">
              <div className="text-[14px] font-bold text-slate-600 uppercase tracking-wide">
                Detected Signals:
              </div>
              <div className="space-y-2">
                {activeScenario.events.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[14px] bg-white/95 p-3 rounded-xl border border-black/5 shadow-2xs">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                      {getEventIcon(evt.eventType)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-slate-600 text-[14px] font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          {evt.relativeTime}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 leading-snug text-[14px]">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. GENTLE CHECK-IN: Resident Check-in */}
          {isWarning && (
            <div className="pt-3 border-t border-amber-200/90 space-y-2">
              <button
                type="button"
                onClick={handleRoutineCall}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-[14px] bg-sky-600 hover:bg-sky-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {routineCallNotified ? (
                  <span>Calling {profile.name.split(' ')[0]}...</span>
                ) : (
                  <span>Call {profile.name.split(' ')[0]}</span>
                )}
              </button>

              <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200/90 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-amber-800">
                    If no answer · Neighbor:
                  </div>
                  <div className="font-bold text-slate-900 text-[14px]">
                    {profile.neighborHelper.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickNeighborAlert}
                  className="py-1.5 px-3 rounded-lg text-[13px] font-bold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{quickNeighborNotified ? 'Alerted ✓' : 'Ask to Check'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. CRITICAL NIGHT WANDERING */}
          {isCritical && (
            <div className="pt-2.5 border-t border-rose-200/90 space-y-2">
              {/* Primary Action: Launch Emergency Escalation Modal */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm animate-pulse"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Launch Emergency Protocol</span>
              </button>

              {/* Quick Neighbor Porch Check Shortcut */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[13px] text-rose-800 font-medium truncate">
                  Neighbor Thomas (30s away):
                </span>
                <button
                  type="button"
                  onClick={handleQuickNeighborAlert}
                  className="text-[13px] font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{quickNeighborNotified ? 'Alerted ✓' : 'Alert Porch Check'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Escalation Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        profile={profile}
      />
    </div>
  );
};
