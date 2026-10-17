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
import { RingEntrywayDevice } from '@/lib/mock-data';

interface PrivacyInspectorProps {
  sensors: RingEntrywayDevice[];
}

export const PrivacyInspector: React.FC<PrivacyInspectorProps> = ({ sensors }) => {
  const [copied, setCopied] = useState(false);

  const contactSensor = sensors.find((s) => s.kind === 'contact_sensor') || sensors[0];

  const samplePayload = {
    sensor_id: contactSensor?.id ?? 'darly-contact-sensor',
    device_name: contactSensor?.name ?? 'Ring Alarm Contact Sensor',
    location: contactSensor?.location ?? 'Front Door',
    state: (contactSensor?.state ?? 'closed').toUpperCase(),
    timestamp: new Date().toISOString(),
    battery_percentage: contactSensor?.batteryLevel ? `${contactSensor.batteryLevel}%` : '100%',
    data_type: 'discrete_contact_switch',
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-600" />
            <h3 className="text-[18px] font-bold text-slate-900">
              Sample Sensor Event Payload
            </h3>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 text-[14px] font-semibold rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center gap-2 cursor-pointer"
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

        <p className="text-[16px] text-slate-600">
          When triggered, only the device identifier, binary state (OPEN / CLOSED), and timestamp are transmitted.
        </p>

        {/* Code Block with large 14px font */}
        <div className="p-5 bg-slate-900 rounded-2xl font-mono text-[14px] overflow-x-auto text-sky-300 leading-relaxed">
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
