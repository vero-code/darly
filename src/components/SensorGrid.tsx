import React, { useState } from 'react';
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
  Radio,
  Search,
  ExternalLink,
} from 'lucide-react';
import { RING_DOCS_URLS } from '@/lib/constants/ringDocs';

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
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const getDocInfo = (kind: string) => {
    switch (kind) {
      case 'video_doorbell':
        return { url: RING_DOCS_URLS.doorbell, label: 'Ring Doorbell Specs & Docs' };
      case 'contact_sensor':
        return { url: RING_DOCS_URLS.contactSensor, label: 'Contact Sensor Specs & Docs' };
      case 'motion_sensor':
        return { url: RING_DOCS_URLS.motionDetector, label: 'Motion Detector Specs & Docs' };
      default:
        return { url: RING_DOCS_URLS.default, label: 'Ring Device Specs & Docs' };
    }
  };

  const filteredSensors = sensors.filter((s) => {
    const matchesLocation = filterLocation === 'all' || s.location === filterLocation;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLocation && matchesSearch;
  });

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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-sky-100 rounded-2xl shadow-xs overflow-x-auto">
          {[
            { id: 'all', label: `All Devices (${sensors.length})` },
            ...Array.from(new Set(sensors.map((s) => s.location))).map((loc) => ({
              id: loc,
              label: `${loc} (${sensors.filter((s) => s.location === loc).length})`,
            })),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterLocation(tab.id)}
              className={`px-4 py-2 text-[14px] font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                filterLocation === tab.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search devices or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 text-[14px] bg-white border border-sky-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-full sm:w-72 shadow-xs"
          />
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSensors.map((sensor) => {
          const isOpen = sensor.state === 'open';
          const docInfo = getDocInfo(sensor.kind);

          return (
            <div
              key={sensor.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isOpen 
                  ? 'bg-amber-50/80 border-amber-300 shadow-md' 
                  : 'bg-white/95 border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-200'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                    {getSensorIcon(sensor)}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[14px] font-bold ${
                      isOpen ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {sensor.kind === 'video_doorbell' && (isOpen ? 'Ringing...' : 'Standby')}
                      {sensor.kind === 'contact_sensor' && (isOpen ? 'Open' : 'Closed')}
                      {sensor.kind === 'motion_sensor' && (isOpen ? 'Motion Detected' : 'Clear')}
                    </span>
                  </div>
                </div>

                {/* Title & Metadata */}
                <div className="mt-4">
                  <div className="text-[14px] font-bold uppercase text-sky-700 tracking-wide">
                    {sensor.location}
                  </div>
                  <h4 className="text-[18px] font-bold text-slate-900 mt-1 leading-snug">
                    {sensor.name}
                  </h4>
                  <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed min-h-[42px]">
                    {sensor.kind === 'video_doorbell' && 'Two-Way Audio, 1080p HD video & chime alerts'}
                    {sensor.kind === 'contact_sensor' && 'Detects when entry door opens or closes'}
                    {sensor.kind === 'motion_sensor' && 'Detects heat & movement in entryway area'}
                  </p>
                </div>

                {/* Device Health Details */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-[14px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2.5">
                      <Battery className="w-4 h-4 text-sky-600" />
                      <span>Battery</span>
                    </span>
                    <span className="font-mono font-semibold text-slate-900">{sensor.batteryLevel}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2.5">
                      <Wifi className="w-4 h-4 text-sky-600" />
                      <span>Signal</span>
                    </span>
                    <span className="font-mono font-medium text-slate-700">
                      {sensor.kind === 'video_doorbell' ? 'Wi-Fi (-58 dBm)' : 'Z-Wave (-62 dBm)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2.5">
                      <Radio className="w-4 h-4 text-sky-600" />
                      <span>Status</span>
                    </span>
                    <span className="font-mono font-semibold text-sky-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      <span>{sensor.online ? 'Online' : 'Offline'}</span>
                    </span>
                  </div>
                </div>

                {/* Ring Official Hardware Documentation Link */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={docInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer group"
                  >
                    <span>{docInfo.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Device Action Button */}
              {sensor.kind === 'video_doorbell' && (
                <button
                  onClick={() => onToggleSensor(sensor.id)}
                  className={`w-full mt-6 py-2.5 px-3 rounded-2xl text-[14px] font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isOpen
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-300'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${isOpen ? 'animate-bounce' : ''}`} />
                  <span>{isOpen ? 'Stop Chime' : 'Ring Doorbell'}</span>
                </button>
              )}

              {sensor.kind === 'contact_sensor' && (
                <button
                  onClick={() => onToggleSensor(sensor.id)}
                  className={`w-full mt-6 py-2.5 px-3 rounded-2xl text-[14px] font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isOpen
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-300'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                  }`}
                >
                  {isOpen ? (
                    <>
                      <DoorClosed className="w-4 h-4" />
                      <span>Close Door</span>
                    </>
                  ) : (
                    <>
                      <DoorOpen className="w-4 h-4" />
                      <span>Open Door</span>
                    </>
                  )}
                </button>
              )}

              {sensor.kind === 'motion_sensor' && (
                <button
                  onClick={() => onToggleSensor(sensor.id)}
                  className={`w-full mt-6 py-2.5 px-3 rounded-2xl text-[14px] font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isOpen
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-300'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                  }`}
                >
                  {isOpen ? (
                    <>
                      <Footprints className="w-4 h-4" />
                      <span>Clear Motion</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Trigger Motion</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
