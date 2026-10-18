import React from 'react';
import { Bell, DoorClosed, Footprints, Rotate3d } from 'lucide-react';
export type DeviceFocusMode = 'all' | 'doorbell' | 'contact' | 'motion';

interface CameraFocusDockProps {
  activeDeviceFocus: DeviceFocusMode;
  onFocusDevice: (dev: DeviceFocusMode) => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
}
export const CameraFocusDock: React.FC<CameraFocusDockProps> = ({
  activeDeviceFocus,
  onFocusDevice,
  isAutoRotating,
  onToggleAutoRotate,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-sky-200/80 shadow-xl text-[14px] max-w-[calc(100%-2rem)] overflow-x-auto whitespace-nowrap">

      <button
        onClick={() => onFocusDevice('all')}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
          activeDeviceFocus === 'all'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        All Entryway
      </button>

      <button
        onClick={() => onFocusDevice('doorbell')}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
          activeDeviceFocus === 'doorbell'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <Bell className={`w-4 h-4 ${activeDeviceFocus === 'doorbell' ? 'text-white' : 'text-sky-500'}`} />
        <span>1. Ring Doorbell</span>
      </button>

      <button
        onClick={() => onFocusDevice('contact')}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
          activeDeviceFocus === 'contact'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <DoorClosed className={`w-4 h-4 ${activeDeviceFocus === 'contact' ? 'text-white' : 'text-sky-500'}`} />
        <span>2. Contact Sensor</span>
      </button>

      <button
        onClick={() => onFocusDevice('motion')}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
          activeDeviceFocus === 'motion'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <Footprints className={`w-4 h-4 ${activeDeviceFocus === 'motion' ? 'text-white' : 'text-sky-500'}`} />
        <span>3. Motion Detector</span>
      </button>

      <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />

      <button
        onClick={onToggleAutoRotate}
        className={`px-2.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
          isAutoRotating
            ? 'bg-sky-100 text-sky-800 ring-2 ring-sky-300'
            : 'text-slate-600 hover:bg-sky-50'
        }`}
        title={isAutoRotating ? 'Stop camera auto-rotation' : 'Auto-rotate camera 360°'}
      >
        <Rotate3d className="w-4 h-4 text-sky-600" />
        <span className="hidden sm:inline text-xs font-bold">
          {isAutoRotating ? 'Rotating' : 'Auto-Rotate'}
        </span>
      </button>
    </div>
  );
};