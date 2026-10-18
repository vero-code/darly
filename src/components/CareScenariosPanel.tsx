import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Clock, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Footprints,
  DoorOpen,
  DoorClosed,
  Bell
} from 'lucide-react';
import { CARE_SCENARIOS, CareScenario, ScenarioEvent } from '@/lib/scenarios';

interface CareScenariosPanelProps {
  activeScenarioId: string;
  onSelectScenario: (scenario: CareScenario) => void;
}

export const CareScenariosPanel: React.FC<CareScenariosPanelProps> = ({
  activeScenarioId,
  onSelectScenario,
}) => {
  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'normal_morning':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'night_wandering':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'missed_routine':
        return <Clock className="w-5 h-5 text-sky-500" />;
      case 'delivery_filter':
        return <Package className="w-5 h-5 text-teal-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-500" />;
    }
  };

  const getEventIcon = (eventType: ScenarioEvent['eventType']) => {
    switch (eventType) {
      case 'motion_detected':
        return <Footprints className="w-4 h-4 text-sky-500" />;
      case 'door_opened':
        return <DoorOpen className="w-4 h-4 text-amber-600" />;
      case 'door_closed':
        return <DoorClosed className="w-4 h-4 text-emerald-600" />;
      case 'ding':
        return <Bell className="w-4 h-4 text-sky-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: CareScenario['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-[13px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Critical Alert
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[13px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Check-in Needed
          </span>
        );
      case 'safe':
        return (
          <span className="flex items-center gap-1 text-[13px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Routine Safe
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center gap-1 text-[13px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
            <Info className="w-3.5 h-3.5" />
            Noise Filtered
          </span>
        );
    }
  };

  const activeScenario = CARE_SCENARIOS.find((s) => s.id === activeScenarioId) || CARE_SCENARIOS[0];

  const getInferenceBoxStyles = (severity: CareScenario['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50/90 border-rose-200 text-rose-900';
      case 'warning':
        return 'bg-amber-50/90 border-amber-200 text-amber-900';
      case 'safe':
        return 'bg-emerald-50/90 border-emerald-200 text-emerald-900';
      case 'info':
        return 'bg-sky-50/90 border-sky-200 text-sky-900';
    }
  };

  return (
    <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Care Scenarios</span>
          </h4>
        </div>
        <p className="text-[14px] text-slate-500 mt-0.5">
          Select a situation to test entryway response:
        </p>
      </div>

      {/* Scenario List */}
      <div className="grid grid-cols-1 gap-2.5">
        {CARE_SCENARIOS.map((scenario) => {
          const isSelected = activeScenarioId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`w-full p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-white border-sky-400 ring-2 ring-sky-200 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:border-sky-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[14px]">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                    {getScenarioIcon(scenario.id)}
                  </div>
                  <span>{scenario.title}</span>
                </div>
                {getSeverityBadge(scenario.severity)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Caregiver AI Inference Summary */}
      {activeScenario && (
        <div className={`p-4 rounded-xl border shadow-xs space-y-3 ${getInferenceBoxStyles(activeScenario.severity)}`}>
          <div className="flex items-center justify-between text-[13px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Darly Ambient Analysis</span>
            </span>
            <span className="font-mono text-[12px] opacity-75">{activeScenario.category}</span>
          </div>

          <p className="text-[14px] leading-snug font-medium">
            {activeScenario.caregiverSummary}
          </p>

          {/* Sequential Events Timeline */}
          {activeScenario.events && activeScenario.events.length > 0 && (
            <div className="pt-2.5 border-t border-black/10 space-y-2">
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                Detected Signal Sequence:
              </div>
              <div className="space-y-1.5">
                {activeScenario.events.map((evt, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 text-[13px] bg-white/90 p-2.5 rounded-xl border border-black/5 shadow-2xs">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-1 rounded-md bg-white shadow-xs shrink-0 mt-0.5">
                        {getEventIcon(evt.eventType)}
                      </div>
                      <span className="font-semibold text-slate-800 leading-snug">
                        {evt.description}
                      </span>
                    </div>
                    <span className="font-mono text-slate-600 text-[12px] shrink-0 font-semibold bg-slate-100/90 px-2 py-0.5 rounded-md self-start">
                      {evt.relativeTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
