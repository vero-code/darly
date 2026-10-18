import React, { useEffect, useState } from 'react';
import type { SensorEventLog } from '@/lib/types/devices';
import type { ResidentProfile } from '@/lib/types/profile';
import type { RoutineBaselineConfig } from '@/lib/engine/routine-baseline';
import { clusterTimelineEvents, getEventGlyph } from '@/utils/timelineUtils';
import {
  Clock,
  Search,
  Cloud,
} from 'lucide-react';

interface RoutineTimelineProps {
  events: SensorEventLog[];
  baseline: RoutineBaselineConfig;
  profile: ResidentProfile;
}

export const RoutineTimeline: React.FC<RoutineTimelineProps> = ({
  events,
  baseline,
  profile,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [stopwatchNow, setStopwatchNow] = useState<number>(() => Date.now());
  const clusters = clusterTimelineEvents(events, 15);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Live stopwatch tick for actively open door events
  useEffect(() => {
    const hasLiveEvent = events.some((e) => e.action === 'opened' && !e.durationSeconds && e.openedAt);
    if (!hasLiveEvent) return;

    const timer = setInterval(() => {
      setStopwatchNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [events]);

  const filteredEvents = events.filter((evt) => {
    return evt.sensorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evt.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evt.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Auto-formats any action ('motion_detected', 'door_open') into clean Title Case
  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    
    // Convert snake_case to Title Case: 'motion_detected' -> 'Motion Detected'
    const label = action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Color by semantic category
    if (act.includes('alert') || act.includes('ajar')) {
      return { label, className: 'bg-rose-100 text-rose-800 border border-rose-300 font-bold' };
    }
    if (act.includes('open')) {
      return { label, className: 'bg-amber-100 text-amber-900 border border-amber-200' };
    }
    if (act.includes('motion')) {
      return { label, className: 'bg-sky-100 text-sky-800 border border-sky-200' };
    }
    if (act.includes('ring') || act.includes('chime')) {
      return { label, className: 'bg-indigo-100 text-indigo-800 border border-indigo-200' };
    }
    return { label, className: 'bg-slate-100 text-slate-700 border border-slate-200' };
  };

  return (
    <div className="space-y-6">
      {/* Editorial Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 border border-sky-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] text-[16px] text-slate-700">
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold text-slate-900 text-[18px]">Circadian Rhythm</span>
          <span className="text-slate-400">·</span>
          <span>{profile.name}</span>
        </div>

        <div className="flex items-center gap-2 text-[14px] text-sky-800 font-semibold bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-100">
          <Clock className="w-4 h-4 text-sky-600" />
          <span>Time: {currentTime || 'Live'}</span>
        </div>
      </div>

      {/* 24-Hour Visual Circadian Rhythm Bar */}
      <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-500 fill-sky-100" />
              <span>Today's Timeline</span>
            </h3>
            <p className="text-[14px] text-slate-500 mt-1">
              Visual activity and sensor events
            </p>
          </div>

          <div className="flex items-center gap-4 text-[14px] text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-4 h-3 rounded-md bg-indigo-100 border border-indigo-200" />
              <span>Night Rest</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-3 rounded-md bg-sky-100 border border-sky-300" />
              <span>Active Routine</span>
            </span>
          </div>
        </div>

        {/* The 24-Hour Timeline Track */}
        <div className="space-y-3 pt-6">
          <div className="relative h-20">
            {/* Background Track with rounded clip */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-50/70 via-blue-50/50 to-sky-50/70 rounded-2xl border border-sky-200 overflow-hidden shadow-inner">
              {/* Curfew block: 00:00 - sleepWindowEndHour */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-indigo-100/60 border-r border-indigo-200 flex items-start justify-center pt-2 pointer-events-none"
                style={{ width: `${(baseline.sleepWindowEndHour / 24) * 100}%` }}
              >
                <span className="text-[13px] font-bold uppercase tracking-wider text-indigo-700/80 hidden sm:inline">Night Rest</span>
              </div>

              {/* Morning Routine Window: sleepWindowEndHour - morningRoutineDeadlineHour */}
              <div 
                className="absolute top-0 bottom-0 bg-sky-200/50 border-r border-sky-300 flex items-start justify-center pt-2 pointer-events-none"
                style={{ 
                  left: `${(baseline.sleepWindowEndHour / 24) * 100}%`, 
                  width: `${((baseline.morningRoutineDeadlineHour - baseline.sleepWindowEndHour) / 24) * 100}%` 
                }}
              >
                <span className="text-[13px] font-bold uppercase tracking-wider text-sky-800/80 hidden sm:inline">Morning Routine</span>
              </div>

              {/* Evening Calm: 19:30 - sleepWindowStartHour */}
              <div 
                className="absolute top-0 bottom-0 bg-sky-200/50 border-l border-sky-300 flex items-start justify-center pt-2 pointer-events-none"
                style={{ 
                  left: `${(19.5 / 24) * 100}%`, 
                  right: `${((24 - baseline.sleepWindowStartHour) / 24) * 100}%` 
                }}
              >
                <span className="text-[13px] font-bold uppercase tracking-wider text-sky-800/80 hidden sm:inline">Evening Calm</span>
              </div>

              {/* Night Sleep: sleepWindowStartHour - 24:00 */}
              <div 
                className="absolute right-0 top-0 bottom-0 bg-indigo-100/60 border-l border-indigo-200 flex items-start justify-center pt-2 pointer-events-none"
                style={{ 
                  width: `${((24 - baseline.sleepWindowStartHour) / 24) * 100}%` 
                }}
              >
                <span className="text-[13px] font-bold uppercase tracking-wider text-indigo-700/80 hidden sm:inline">Night Sleep</span>
              </div>
            </div>

            {/* Live Sensor Event Clusters outside the overflow clip */}
            {clusters.map((cluster) => (
              <div 
                key={cluster.id}
                className="absolute top-[58%] -translate-y-1/2 -translate-x-1/2 z-20 group cursor-pointer transition-transform hover:scale-110"
                style={{ left: `${cluster.timePercent}%` }}
              >
                <div className={`relative w-8 h-8 rounded-full ${cluster.primaryGlyph.bg} border-2 border-white flex items-center justify-center shadow-md`}>
                  {cluster.primaryGlyph.icon}
                  {cluster.events.length > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow">
                      {cluster.events.length}
                    </span>
                  )}
                </div>

                {/* Tooltip on hover (supports single and clustered events) */}
                <div className="hidden group-hover:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[13px] py-2 px-3.5 rounded-xl whitespace-nowrap shadow-2xl z-50 pointer-events-none">
                  {cluster.events.length === 1 ? (
                    <div className="font-medium">{cluster.primaryGlyph.label}</div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-bold text-[12px] text-sky-300 border-b border-slate-700 pb-1">
                        {cluster.events[0].timestamp} · {cluster.events.length} Events
                      </div>
                      {cluster.events.map((e) => {
                        const g = getEventGlyph(e);
                        return (
                          <div key={e.id} className="text-[12px] text-slate-200">
                            {g.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time axis marks (min 14px) */}
          <div className="flex justify-between text-[14px] font-mono text-slate-500 px-1 font-semibold">
            <span>00:00</span>
            <span>03:00</span>
            <span>06:00</span>
            <span>09:00</span>
            <span>12:00</span>
            <span>15:00</span>
            <span>18:00</span>
            <span>21:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>

      {/* Discrete Sensor Trigger Event Log */}
      <div className="p-6 bg-white/95 border border-sky-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900">Activity Log</h3>
            <p className="text-[14px] text-slate-500 mt-1">
              Real-time monitoring of sensor activations
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activity log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-[14px] bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Device</th>
                <th className="py-3 px-3">Event / Action</th>
                <th className="py-3 px-3 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredEvents.map((evt) => {
                const badge = getActionBadge(evt.action);
                return (
                  <tr key={evt.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-3 text-sky-800 font-bold">{evt.timestamp}</td>
                    <td className="py-3 px-3 text-slate-800 font-sans font-medium">{evt.sensorName}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-lg font-sans font-semibold text-[14px] ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      {evt.durationSeconds && evt.durationSeconds > 0 ? (
                        <span className="font-semibold text-slate-700">{evt.durationSeconds}s</span>
                      ) : evt.action === 'closed' ? (
                        <span className="text-slate-400">—</span>
                      ) : evt.openedAt ? (
                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[14px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          {Math.max(1, Math.floor((stopwatchNow - evt.openedAt) / 1000))}s
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[14px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
