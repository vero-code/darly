import React, { useState } from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  MicOff, 
  FileCode, 
  Copy, 
  Check, 
  Cpu,
} from 'lucide-react';
import type { RingEntrywayDevice } from '@/lib/types/devices';

interface PrivacyInspectorProps {
  sensors: RingEntrywayDevice[];
}

export const PrivacyInspector: React.FC<PrivacyInspectorProps> = ({ sensors = [] }) => {
  const [copied, setCopied] = useState(false);

  // Default to contact sensor, or fallback to first device
  const defaultId = sensors.find((s) => s.kind === 'contact_sensor')?.id || sensors[0]?.id || '';
  const [selectedId, setSelectedId] = useState<string>(defaultId);

  // Current selected device
  const selectedDevice = sensors.find((s) => s.id === selectedId) || sensors[0];

  const getDataType = (kind?: string) => {
    switch (kind) {
      case 'doorbell':
        return 'doorbell_chime_event';
      case 'motion_sensor':
        return 'passive_infrared_motion';
      default:
        return 'discrete_contact_switch';
    }
  };

  const getDeviceState = (device?: RingEntrywayDevice) => {
    if (!device) return 'CLOSED';
    if (device.kind === 'contact_sensor') {
      return (device.state ?? 'closed').toUpperCase();
    }
    if (device.kind === 'motion_sensor') {
      return 'IDLE';
    }
    if (device.kind === 'doorbell') {
      return 'STANDBY';
    }
    return device.online ? 'ONLINE' : 'OFFLINE';
  };

  const samplePayload = {
    sensor_id: selectedDevice?.id ?? 'darly-contact-sensor',
    device_name: selectedDevice?.name ?? 'Ring Alarm Contact Sensor',
    location: selectedDevice?.location ?? 'Front Door',
    state: getDeviceState(selectedDevice),
    timestamp: new Date().toISOString(),
    battery_percentage: selectedDevice?.batteryLevel ? `${selectedDevice.batteryLevel}%` : '100%',
    data_type: getDataType(selectedDevice?.kind),
  };

  const jsonString = JSON.stringify(samplePayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] text-[16px] text-slate-700">
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold text-slate-900 text-[18px]">How Sensors Work</span>
          <span className="text-slate-400">·</span>
          <span>Dignified care without privacy intrusion</span>
        </div>

        <div className="flex items-center gap-2 text-sky-800 font-semibold bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-100 text-[14px]">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Only discrete door open/close events transmitted</span>
        </div>
      </div>

      {/* 3 Practical Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
            <EyeOff className="w-6 h-6" />
          </div>
          <h4 className="text-[18px] font-bold text-slate-900">No Cameras Inside the Home</h4>
          <p className="text-[16px] text-slate-600 leading-relaxed">
            Seniors never feel watched or uncomfortable in their private living spaces or bedrooms.
          </p>
        </div>

        <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
            <MicOff className="w-6 h-6" />
          </div>
          <h4 className="text-[18px] font-bold text-slate-900">No Audio or Voice Recording</h4>
          <p className="text-[16px] text-slate-600 leading-relaxed">
            Sensors never record audio, listen to phone calls, or capture private household sounds.
          </p>
        </div>

        <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="text-[18px] font-bold text-slate-900">Discrete State Telemetry Only</h4>
          <p className="text-[16px] text-slate-600 leading-relaxed">
            Contact sensors only transmit binary states: whether the door is open and how long it remains closed.
          </p>
        </div>
      </div>

      {/* Live Raw JSON Payload Inspector */}
      <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-600" />
            <h3 className="text-[18px] font-bold text-slate-900">
              Sample Sensor Event Payload
            </h3>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 text-[14px] font-semibold rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Device Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {sensors.map((device) => {
            const isSelected = device.id === selectedDevice?.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedId(device.id)}
                type="button"
                className={`px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-600/20'
                    : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-200/80 hover:text-sky-900'
                }`}
              >
                <span>{device.name}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {device.location}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[15px] text-slate-600">
          When triggered, only discrete telemetry events (device ID, state, timestamp) are transmitted — never audio or video streams into care logs.
        </p>

        {/* Code Block with large 14px font */}
        <div className="p-5 bg-slate-900 rounded-2xl font-mono text-[14px] overflow-x-auto text-sky-300 leading-relaxed shadow-inner">
          <pre>{jsonString}</pre>
        </div>
      </div>

      {/* Prototype Disclaimer */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-[13px] text-slate-500 leading-relaxed text-center">
        <span className="font-semibold text-slate-700">Disclaimer:</span> Device names and features are referenced for prototype demonstration purposes. Hardware capabilities may vary by specific Ring product generation; please refer to official Ring documentation.
      </div>
    </div>
  );
};
