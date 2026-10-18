import React from 'react';
import { Bell, DoorClosed, Footprints, ExternalLink } from 'lucide-react';
import type { RingEntrywayDevice } from '@/lib/types/devices';
import { RING_DOCS_URLS } from '@/lib/constants/ringDocs';

interface DeviceSpecCardsProps {
  sensors: RingEntrywayDevice[];
  selectedSensorId: string | null;
  activeDeviceFocus: 'all' | 'doorbell' | 'contact' | 'motion';
  isDoorbellRinging: boolean;
  isMotionActive: boolean;
  onFocusDevice: (dev: 'all' | 'doorbell' | 'contact' | 'motion') => void;
}

export const DeviceSpecCards: React.FC<DeviceSpecCardsProps> = ({
  sensors,
  selectedSensorId,
  activeDeviceFocus,
  isDoorbellRinging,
  isMotionActive,
  onFocusDevice,
}) => {
  const isRinging = isDoorbellRinging || sensors.some((s) => s.id === 'darly-video-doorbell' && s.state === 'open');
  const isDoorOpen = sensors.some((s) => s.id === 'darly-contact-sensor' && s.state === 'open');
  const isMotion = isMotionActive || sensors.some((s) => s.id === 'darly-motion-detector' && s.state === 'open');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
        {/* Device 1: Ring Video Doorbel */}
        <div 
          onClick={() => onFocusDevice('doorbell')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSensorId === 'darly-video-doorbell' || activeDeviceFocus === 'doorbell'
              ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-200 shadow-md'
              : 'bg-white/95 border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold">
              1
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[14px] font-semibold ${isRinging ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-sky-100 text-sky-800'
            }`}>
              {isRinging ? 'Ringing...' : 'Standby'}
            </span>
          </div>

          <h4 className="text-[18px] font-bold text-slate-900 mt-3 flex items-center gap-1.5">
            <Bell className="w-5 h-5 text-sky-500" />
            <span>Ring Video Doorbell</span>
          </h4>
          <p className="text-[16px] text-slate-600 mt-1">
            Outdoor video doorbell on porch. Monitors guest arrivals, deliveries, and front entryway safety.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px]">
            <span className="text-slate-500">Chime Button:</span>
            <span className="font-bold text-slate-900">
              {isRinging ? 'Ringing Now' : 'Standby / Ready'}
            </span>
          </div>

          <a 
            href={RING_DOCS_URLS.doorbell}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>Ring Doorbell Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Device 2: Ring Alarm Contact Sensor */}
        <div 
          onClick={() => onFocusDevice('contact')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSensorId === 'darly-contact-sensor' || activeDeviceFocus === 'contact'
              ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-200 shadow-md'
              : 'bg-white/95 border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[14px] font-semibold ${
              isDoorOpen ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-800'
            }`}>
              {isDoorOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          <h4 className="text-[18px] font-bold text-slate-900 mt-3 flex items-center gap-1.5">
            <DoorClosed className="w-5 h-5 text-sky-500" />
            <span>Ring Alarm Contact Sensor</span>
          </h4>
          <p className="text-[16px] text-slate-600 mt-1">
            Door open & close sensor. Tracks resident routines, returning home, and entryway safety.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px]">
            <span className="text-slate-500">Magnetic Reed:</span>
            <span className="font-bold text-slate-900">
              {isDoorOpen ? 'Contact Open' : 'Contact Closed'}
            </span>
          </div>

          <a 
            href={RING_DOCS_URLS.contactSensor}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>Contact Sensor Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Device 3: Ring Alarm Motion Detector */}
        <div 
          onClick={() => onFocusDevice('motion')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSensorId === 'darly-motion-detector' || activeDeviceFocus === 'motion'
              ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-200 shadow-md'
              : 'bg-white/95 border-sky-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[14px] font-semibold ${
              isMotion ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-sky-100 text-sky-800'
            }`}>
              {isMotion ? 'Motion Active' : 'Clear / Idle'}
            </span>
          </div>

          <h4 className="text-[18px] font-bold text-slate-900 mt-3 flex items-center gap-1.5">
            <Footprints className="w-5 h-5 text-sky-500" />
            <span>Ring Alarm Motion Detector</span>
          </h4>
          <p className="text-[16px] text-slate-600 mt-1">
            Entryway PIR motion sensor. Detects movement in foyer without privacy-intrusive cameras.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px]">
            <span className="text-slate-500">PIR Fresnel Lens:</span>
            <span className="font-bold text-slate-900">
              {isMotion ? 'Motion Detected' : 'Area Clear'}
            </span>
          </div>

          <a 
            href={RING_DOCS_URLS.motionDetector}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>Motion Detector Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
    </div>
  );
};