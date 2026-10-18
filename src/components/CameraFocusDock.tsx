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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-sky-200 shadow-xl text-[14px]">
      <span className="text-slate-500 font-semibold px-2 hidden sm:inline">3D Focus:</span>

      <button
        onClick={() => onFocusDevice('all')}
        className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
          activeDeviceFocus === 'all'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        All Entryway
      </button>

      <button
        onClick={() => onFocusDevice('doorbell')}
        className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          activeDeviceFocus === 'doorbell'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <Bell className="w-4 h-4 text-sky-500" />
        <span>1. Ring Doorbell</span>
      </button>

      <button
        onClick={() => onFocusDevice('contact')}
        className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          activeDeviceFocus === 'contact'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <DoorClosed className="w-4 h-4 text-sky-500" />
        <span>2. Contact Sensor</span>
      </button>

      <button
        onClick={() => onFocusDevice('motion')}
        className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          activeDeviceFocus === 'motion'
            ? 'bg-sky-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-sky-50'
        }`}
      >
        <Footprints className="w-4 h-4 text-sky-500" />
        <span>3. Motion Detector</span>
      </button>

      <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

      <button
        onClick={onToggleAutoRotate}
        className={`p-2 rounded-xl font-semibold transition-all cursor-pointer ${
          isAutoRotating ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-sky-50'
        }`}
        title="Auto-rotate camera"
      >
        <Rotate3d className="w-5 h-5" />
      </button>
    </div>
  );
};