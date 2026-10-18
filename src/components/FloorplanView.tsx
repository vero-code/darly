import React, { useState } from 'react';
import { RingEntrywayDevice } from '@/lib/types/devices';
import { ResidentProfile } from '@/lib/types/profile';
import { ResidentInfoBar } from './ResidentInfoBar';
import { House3DView } from './House3DView';
import {
  Box,
} from 'lucide-react';

interface FloorplanViewProps {
  sensors: RingEntrywayDevice[];
  onToggleSensor: (sensorId: string) => void;
  profile: ResidentProfile;
}

export const FloorplanView: React.FC<FloorplanViewProps> = ({
  sensors,
  onToggleSensor,
  profile,
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>('darly-contact-sensor');

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
      </div>
    </div>
  );
};
