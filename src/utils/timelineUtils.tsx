import React from 'react';
import type { SensorEventLog } from '@/lib/types/devices';
import { Sun, DoorClosed, Bell, Volume2 } from 'lucide-react';

// Convert time ('07:22 AM', '13:40') to day percentage 0..100%
export function parseTimestampToPercent(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  
  const match = clean.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  if (isPM && hours < 12) hours += 12;
  else if (isAM && hours === 12) hours = 0;
  
  const totalMinutes = hours * 60 + minutes;
  return Math.min(100, Math.max(0, (totalMinutes / 1440) * 100));
}

export interface EventGlyphData {
  icon: React.ReactNode;
  bg: string;
  label: string;
}

// Get icon, color and tooltip for Ring entryway event
export function getEventGlyph(evt: SensorEventLog): EventGlyphData {
  const action = evt.action.toLowerCase();
  const deviceId = evt.deviceId?.toLowerCase() || '';
  const name = evt.sensorName.toLowerCase();

  // In-Home Chime
  if (action === 'ring' || deviceId.includes('chime') || name.includes('chime')) {
    return {
      icon: <Volume2 className="w-4 h-4 text-white" />,
      bg: 'bg-indigo-500',
      label: `${evt.timestamp} — In-Home Ambient Chime`,
    };
  }

  // Video Doorbell
  if (deviceId.includes('doorbell') || name.includes('doorbell')) {
    return {
      icon: <Bell className="w-4 h-4 text-white" />,
      bg: 'bg-sky-500',
      label: `${evt.timestamp} — Porch Video Doorbell`,
    };
  }

  // Contact Sensor
  if (deviceId.includes('contact') || name.includes('contact') || action.includes('open') || action.includes('clos')) {
    return {
      icon: <DoorClosed className="w-4 h-4 text-white" />,
      bg: action.includes('open') ? 'bg-amber-500' : 'bg-slate-500',
      label: `${evt.timestamp} — Front Door (${action.includes('open') ? 'Opened' : 'Closed'})`,
    };
  }

  // Motion Detector
  return {
    icon: <Sun className="w-4 h-4 text-amber-950" />,
    bg: 'bg-amber-400',
    label: `${evt.timestamp} — Foyer Motion Detected`,
  };
}