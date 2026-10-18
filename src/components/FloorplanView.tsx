import React, { useState } from 'react';
import { RingEntrywayDevice } from '@/lib/types/devices';
import { ResidentProfile } from '@/lib/types/profile';
import { ResidentInfoBar } from './ResidentInfoBar';
import { House3DView } from './House3DView';
import { CareScenariosPanel } from './CareScenariosPanel';
import type { CareScenario } from '@/lib/scenarios';
import {
  Box,
  Volume2,
} from 'lucide-react';

interface FloorplanViewProps {
  sensors: RingEntrywayDevice[];
  onToggleSensor: (sensorId: string) => void;
  profile: ResidentProfile;
  onSendChime: () => void;
  lastChimeSentTime: string | null;
}

export const FloorplanView: React.FC<FloorplanViewProps> = ({
  sensors,
  onToggleSensor,
  profile,
  onSendChime,
  lastChimeSentTime,
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('normal_morning');

  const handleSelectScenario = (scenario: CareScenario) => {
    setActiveScenarioId(scenario.id);
    // Synchronize 3D model with scenario state
    if (scenario.id === 'night_wandering') {
      // Open door in 3D to show danger
      const door = sensors.find((s) => s.id === 'darly-contact-sensor');
      if (door && door.state !== 'open') {
        onToggleSensor('darly-contact-sensor');
      }
    } else if (scenario.id === 'normal_morning') {
      // Close door in 3D
      const door = sensors.find((s) => s.id === 'darly-contact-sensor');
      if (door && door.state === 'open') {
        onToggleSensor('darly-contact-sensor');
      }
    } else if (scenario.id === 'delivery_filter') {
      // Close door and trigger doorbell
      const door = sensors.find((s) => s.id === 'darly-contact-sensor');
      if (door && door.state === 'open') {
        onToggleSensor('darly-contact-sensor');
      }
      onToggleSensor('darly-video-doorbell');
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Bar */}
      <ResidentInfoBar 
        profile={profile} 
        deviceCount={sensors.length} 
      />

      {/* Main Floor Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Canvas */}
        <div className="lg:col-span-8 bg-white/95 border border-sky-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                  <Box className="w-5 h-5 text-sky-500" />
                  <span>3D House Model with Sensors</span>
                </h2>
              </div>
              <p className="text-[14px] text-slate-500 mt-1">
                Rotate model with mouse. Click the doorbell, door, or motion sensor to interact.
              </p>
            </div>
          </div>

          {/* 3D Viewport */}
          <div className="space-y-4">
            <House3DView
              sensors={sensors}
              onToggleSensor={onToggleSensor}
              selectedSensorId={selectedSensorId}
              onSelectSensor={(id) => setSelectedSensorId(id)}
            />
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="lg:col-span-4 bg-white/95 border border-sky-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          {/* Ambient In-Home Chime Action Box */}
          <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-sky-600" />
                <span>In-Home Chime</span>
              </span>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {`Plays an ambient chime in ${profile.name.split(' ')[0]}'s hallway for a calm wellness check.`}
            </p>
            <button
              onClick={onSendChime}
              className="w-full py-2.5 px-3 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Play Chime</span>
            </button>
            {lastChimeSentTime && (
              <div className="text-[14px] text-slate-500 text-center">
                Last played at {lastChimeSentTime}
              </div>
            )}
          </div>
          {/* Care Scenarios Simulation Panel */}
          <CareScenariosPanel
            activeScenarioId={activeScenarioId}
            onSelectScenario={handleSelectScenario}
          />
        </div>
      </div>
    </div>
  );
};
