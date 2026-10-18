import React from 'react';
import type { SensorEventLog } from '@/lib/types/devices';
import { Sun, DoorClosed, Bell, Volume2 } from 'lucide-react';

// Parse time string ('07:22 AM', '13:40') to total minutes from midnight (0..1439)
export function parseTimestampToMinutes(timeStr: string): number {
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

  return hours * 60 + minutes;
}

// Convert time ('07:22 AM', '13:40') to day percentage 0..100%
export function parseTimestampToPercent(timeStr: string): number {
  const totalMinutes = parseTimestampToMinutes(timeStr);
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

export interface TimelineEventCluster {
  id: string;
  timePercent: number;
  primaryGlyph: EventGlyphData;
  events: SensorEventLog[];
}

// Groups events occurring within a close time window (e.g. 15 min) into clusters
export function clusterTimelineEvents(
  events: SensorEventLog[],
  proximityMinutes: number = 15
): TimelineEventCluster[] {
  if (!events || events.length === 0) return [];

  // Sort earliest to latest in the day
  const sorted = [...events].sort((a, b) => {
    return parseTimestampToMinutes(a.timestamp) - parseTimestampToMinutes(b.timestamp);
  });

  const clusters: TimelineEventCluster[] = [];

  for (const evt of sorted) {
    const minutes = parseTimestampToMinutes(evt.timestamp);
    const lastCluster = clusters[clusters.length - 1];

    if (lastCluster) {
      const firstMinutes = parseTimestampToMinutes(lastCluster.events[0].timestamp);
      if (Math.abs(minutes - firstMinutes) <= proximityMinutes) {
        lastCluster.events.push(evt);
        if (evt.action.includes('open') || evt.deviceId?.includes('doorbell')) {
          lastCluster.primaryGlyph = getEventGlyph(evt);
        }
        continue;
      }
    }

    clusters.push({
      id: `cluster-${evt.id}`,
      timePercent: (minutes / 1440) * 100,
      primaryGlyph: getEventGlyph(evt),
      events: [evt],
    });
  }

  return clusters;
}