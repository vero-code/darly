import React, { useState } from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  MicOff, 
  FileCode, 
  Copy, 
  Check, 
  Cpu,
  Radio,
} from 'lucide-react';
import type { RingEntrywayDevice } from '@/lib/types/devices';
import type { ScenarioEvent } from '@/lib/scenarios';

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

  const getEventDetails = (device?: RingEntrywayDevice) => {
    switch (device?.kind) {
      case 'motion_sensor':
        return {
          eventType: 'motion_detected' as const,
          description: 'Movement detected near the front entrance.',
        };
      case 'video_doorbell':
        return {
          eventType: 'ding' as const,
          description: 'Doorbell chime pressed at front porch.',
        };
      case 'contact_sensor':
      default:
        return {
          eventType: (device?.state === 'open' ? 'door_opened' : 'door_closed') as 'door_opened' | 'door_closed',
          description: device?.state === 'open'
            ? 'Front door opened.'
            : 'Front door closed and securely latched.',
        };
    }
  };

  const { eventType, description } = getEventDetails(selectedDevice);

  const relativeTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const samplePayload: ScenarioEvent = {
    deviceId: selectedDevice?.id ?? 'darly-contact-sensor',
    deviceName: selectedDevice?.name ?? 'Ring Alarm Contact Sensor',
    eventType,
    relativeTime,
    description,
  };

  const jsonString = JSON.stringify(samplePayload, null, 2);

  const getRawRingPayload = (device?: RingEntrywayDevice) => {
    const devId = device?.id ?? 'darly-contact-sensor';
    const now = Date.now();

    let rawType = 'motion_detected';
    if (device?.kind === 'video_doorbell') {
      rawType = 'ding';
    } else if (device?.kind === 'contact_sensor') {
      rawType = device.state === 'open' ? 'door_opened' : 'door_closed';
    }

    return {
      meta: {
        request_id: `req_ring_${now.toString(16).slice(-8)}`,
      },
      data: {
        id: `evt_ring_${(now + 1).toString(16).slice(-8)}`,
        type: rawType,
        attributes: {
          source: devId,
          timestamp: now,
        },
      },
    };
  };

  const rawPayload = getRawRingPayload(selectedDevice);
  const rawJsonString = JSON.stringify(rawPayload, null, 2);

  const combinedPayload = {
    raw_ring_webhook: rawPayload,
    darly_normalized_event: samplePayload,
  };
  const combinedJsonString = JSON.stringify(combinedPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(combinedJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header & Real Ring API Readiness Status */}
      <div className="p-5 rounded-3xl bg-white/95 border border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-[16px] text-slate-700">
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

        {/* Real Ring API Readiness Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-sky-50/50 to-white border border-emerald-100/80 text-[14px]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white shadow-xs border border-emerald-200 text-emerald-800 font-bold text-[14px]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Ready for Real Ring API</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 font-medium text-[14px]">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Active Webhook Listener:</span>
              <code className="px-2 py-0.5 rounded-lg bg-white font-mono text-[14px] text-slate-900 border border-slate-200 shadow-xs">
                /api/webhook
              </code>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-slate-600 text-[14px]">
            <span className="font-medium text-slate-700">Cloud API:</span>
            <code className="px-2 py-0.5 rounded-lg bg-white font-mono text-[14px] text-sky-800 border border-sky-200/80 shadow-xs">
              api.amazonvision.com
            </code>
          </div>
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
              What The System Sees
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
        <div className="flex flex-wrap gap-2.5 pt-1 pb-1">
          {sensors.map((device) => {
            const isSelected = device.id === selectedDevice?.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedId(device.id)}
                type="button"
                className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-600/20 border border-sky-600'
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-200 hover:text-sky-900'
                }`}
              >
                <span>{device.name}</span>
                <span className={`text-[14px] font-normal px-2.5 py-0.5 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {device.location}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[16px] text-slate-600 leading-relaxed">
          When a door opens, the system only receives these few lines of text — never video, audio, or personal details.
        </p>

        {/* Two Code Windows: Raw Webhook vs Normalized Event */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Window 1: Raw Ring Webhook */}
          <div className="p-5 bg-slate-900 rounded-2xl font-mono text-[14px] overflow-x-auto text-sky-300 leading-relaxed shadow-inner">
            <div className="text-slate-400 text-[14px] mb-3 select-none">
              // 1. Raw Ring Webhook Event (api.amazonvision.com)
            </div>
            <pre>{rawJsonString}</pre>
          </div>

          {/* Window 2: Normalized Darly Event */}
          <div className="p-5 bg-slate-900 rounded-2xl font-mono text-[14px] overflow-x-auto text-sky-300 leading-relaxed shadow-inner">
            <div className="text-slate-400 text-[14px] mb-3 select-none">
              // 2. Darly Normalized Privacy Telemetry (Local Edge)
            </div>
            <pre>{jsonString}</pre>
          </div>
        </div>
      </div>

      {/* Prototype Disclaimer */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-[14px] text-slate-600 leading-relaxed text-center">
        <span className="font-semibold text-slate-800">Disclaimer:</span> Device names and features are referenced for prototype demonstration purposes. Hardware capabilities may vary by specific{' '}
        <a 
          href="https://ring.com/support" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sky-600 underline underline-offset-4 decoration-sky-300 hover:decoration-sky-600 hover:text-sky-800 transition-colors cursor-pointer font-medium"
        >
          Ring product
        </a>{' '}
        generation.
      </div>
    </div>
  );
};
