import React from 'react';
import type { RingEntrywayDevice } from '@/lib/types/devices';

import { 
  DoorClosed,
  DoorOpen,
  Footprints,
  Battery,
  Wifi,
  RotateCcw,
  Bell,
  Activity,
  Radio
} from 'lucide-react';

interface SensorGridProps {
  sensors: RingEntrywayDevice[];
  onToggleSensor: (sensorId: string) => void;
  onResetAllSensors: () => void;
}

export const SensorGrid: React.FC<SensorGridProps> = ({
  sensors,
  onToggleSensor,
  onResetAllSensors,
}) => {
  const getSensorIcon = (sensor: RingEntrywayDevice) => {
    switch (sensor.kind) {
      case 'video_doorbell':
        return <Bell className="w-6 h-6" />;
      case 'contact_sensor':
        return sensor.state === 'open' ? (
          <DoorOpen className="w-6 h-6 text-amber-600" />
        ) : (
          <DoorClosed className="w-6 h-6 text-sky-600" />
        );
      case 'motion_sensor':
        return sensor.state === 'open' ? (
          <Activity className="w-6 h-6 text-amber-600 animate-pulse" />
        ) : (
          <Footprints className="w-6 h-6 text-sky-600" />
        );
      default:
        return <DoorClosed className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] text-[16px] text-slate-700">
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold text-slate-900 text-[18px]">Ring Entryway Devices</span>
          <span className="text-slate-400">·</span>
          <span>Hardware health & live telemetry</span>
        </div>

        <button
          onClick={onResetAllSensors}
          className="px-4 py-2 text-[14px] font-semibold rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Normal</span>
        </button>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {sensors.map((sensor) => {
          const isOpen = sensor.state === 'open';

          return (
            <div
              key={sensor.id}
              className={`p-5 rounded-3xl border transition-all ${
                isOpen 
                  ? 'bg-amber-50/80 border-amber-300 shadow-md' 
                  : 'bg-white/95 border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  {getSensorIcon(sensor)}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-[14px] font-bold ${
                    isOpen ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {sensor.kind === 'video_doorbell' && (isOpen ? 'Ding' : 'Idle')}
                    {sensor.kind === 'contact_sensor' && (isOpen ? 'Faulted (Open)' : 'Closed')}
                    {sensor.kind === 'motion_sensor' && (isOpen ? 'Motion Detected' : 'Clear')}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-4">
                <div className="text-[14px] font-bold uppercase text-sky-700 tracking-wide">
                  {sensor.location}
                </div>
                <h4 className="text-[18px] font-bold text-slate-900 mt-0.5 truncate" title={sensor.name}>
                  {sensor.name}
                </h4>
                <p className="text-[14px] text-slate-500 mt-0.5 truncate">
                  {sensor.kind === 'video_doorbell' && 'Two-Way Audio, 1080p HD video & chime alerts'}
                  {sensor.kind === 'contact_sensor' && 'Detects when entry door opens or closes'}
                  {sensor.kind === 'motion_sensor' && 'Detects heat & movement in entryway area'}
                </p>
              </div>

              {/* Device Health Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[14px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-sky-600" />
                    <span>Battery</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{sensor.batteryLevel}%</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-sky-600" />
                    <span>Signal</span>
                  </span>
                  <span className="font-mono text-slate-700">
                    {sensor.kind === 'video_doorbell' ? 'Wi-Fi (-58 dBm)' : 'Z-Wave (-62 dBm)'}
                  </span>
                </div>
              </div>

              {/* Connectivity status */}
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600" />
                  <span>Status</span>
                </span>
                <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{sensor.online ? 'Online' : 'Offline'}</span>
                </span>
              </div>

              {/* Toggle Simulation Button */}
              <button
                onClick={() => onToggleSensor(sensor.id)}
                className="w-full mt-5 py-2.5 px-3 rounded-2xl text-[14px] font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isOpen ? (
                  <>
                    <DoorClosed className="w-4 h-4" />
                    <span>Close Sensor</span>
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-4 h-4" />
                    <span>Open Sensor</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
