'use client';

import { useState, useEffect, useRef } from 'react';
import type { RingEntrywayDevice, SensorEventLog } from '@/lib/types/devices';
import type { ResidentProfile } from '@/lib/types/profile';
import {
  SIMULATED_DEVICES,
  DEFAULT_RESIDENT_PROFILE,
  DEFAULT_HISTORICAL_EVENTS
} from '@/lib/mock-data';
import { RoutineBaselineConfig, DEFAULT_BASELINE } from '@/lib/engine/routine-baseline';
import { Header } from "@/components/Header";
import { FloorplanView } from "@/components/FloorplanView";
import { SettingsModal } from "@/components/SettingsModal";
import { SensorGrid } from '@/components/SensorGrid';
import { PrivacyInspector } from "@/components/PrivacyInspector";
import { FloatingCloudsBackground } from "@/components/CloudElements";
import { Footer } from "@/components/Footer";
import { ChimeModal } from '@/components/ChimeModal';
import { RoutineTimeline } from '@/components/RoutineTimeline';
import { ambientAudio } from '@/utils/audioChime';

export default function Home() {
  const [sensors, setSensors] = useState<RingEntrywayDevice[]>(SIMULATED_DEVICES);
  const [baseline, setBaseline] = useState<RoutineBaselineConfig>(DEFAULT_BASELINE);
  const [profile, setProfile] = useState<ResidentProfile>(DEFAULT_RESIDENT_PROFILE);
  const [events, setEvents] = useState<SensorEventLog[]>(DEFAULT_HISTORICAL_EVENTS);

  // Stopwatch tracking for active open door sensors
  const sensorOpenTimestamps = useRef<Record<string, number>>({});
  const sensorOpenEventIds = useRef<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<string>('floorplan');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChimeModalOpen, setIsChimeModalOpen] = useState(false);
  const [lastChimeSentTime, setLastChimeSentTime] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darly_resident_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Trigger Gentle Ambient Chime
  const handleSendChime = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastChimeSentTime(timeNow);
    setIsChimeModalOpen(true);

    // Add chime event to log
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        deviceId: 'darly-in-home-chime',
        sensorName: 'In-Home Ring Chime',
        action: 'ring',
        timestamp: timeNow,
        durationSeconds: 3,
      },
      ...prev,
    ]);
  };

  const handleSaveProfile = (updatedProfile: ResidentProfile) => {
    setProfile(updatedProfile);
    try {
      localStorage.setItem('darly_resident_profile', JSON.stringify(updatedProfile));
    } catch {
      // Ignore storage errors
    }
  };

  // Toggle sensor state manually or via Floor Plan
  const handleToggleSensor = (sensorId: string) => {
    const target = sensors.find((s) => s.id === sensorId);
    if (!target) return;

    const newState: RingEntrywayDevice['state'] = target.state === 'open' ? 'closed' : 'open';

    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== sensorId) return s;

        // Play corresponding sound
        if (newState === 'open') {
          if (s.kind === 'video_doorbell') {
            ambientAudio.playGentleCheckinChime();
          } else if (s.kind === 'motion_sensor') {
            ambientAudio.playMotionPing();
          } else {
            ambientAudio.playDoorOpenChime();
          }
        }

        return {
          ...s,
          state: newState,
        };
      })
    );

    // Auto-reset transient devices
    if ((target.kind === 'video_doorbell' || target.kind === 'motion_sensor') && target.state !== 'open') {
      setTimeout(() => {
        setSensors((current) =>
          current.map((dev) =>
            dev.id === sensorId ? { ...dev, state: 'closed' } : dev
          )
        );
      }, 3000);
    }

    // Record sensor activation in activity log with stopwatch timing
    const now = Date.now();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (target.kind === 'motion_sensor') {
      setEvents((prev) => [
        {
          id: `evt-${now}`,
          deviceId: target.id,
          sensorName: target.name,
          action: 'motion_detected',
          timestamp: timeNow,
          durationSeconds: 15,
        },
        ...prev,
      ]);
    } else if (target.kind === 'video_doorbell') {
      setEvents((prev) => [
        {
          id: `evt-${now}`,
          deviceId: target.id,
          sensorName: target.name,
          action: 'ring',
          timestamp: timeNow,
          durationSeconds: 5,
        },
        ...prev,
      ]);
    } else {
      // Contact / Door sensor
      if (newState === 'open') {
        const openEventId = `evt-${now}`;
        sensorOpenTimestamps.current[target.id] = now;
        sensorOpenEventIds.current[target.id] = openEventId;

        setEvents((prev) => [
          {
            id: openEventId,
            deviceId: target.id,
            sensorName: target.name,
            action: 'opened',
            timestamp: timeNow,
            openedAt: now,
            durationSeconds: undefined,
          },
          ...prev,
        ]);
      } else {
        // Door closed - measure elapsed duration with stopwatch
        const startTime = sensorOpenTimestamps.current[target.id];
        const openEventId = sensorOpenEventIds.current[target.id];
        const elapsedSeconds = startTime ? Math.max(1, Math.round((now - startTime) / 1000)) : 1;

        delete sensorOpenTimestamps.current[target.id];
        delete sensorOpenEventIds.current[target.id];

        setEvents((prev) => {
          // Update matching open event with measured seconds
          const updated = prev.map((evt) =>
            evt.id === openEventId
              ? { ...evt, durationSeconds: elapsedSeconds }
              : evt
          );

          return [
            {
              id: `evt-${now}`,
              deviceId: target.id,
              sensorName: target.name,
              action: 'closed',
              timestamp: timeNow,
              durationSeconds: 0,
            },
            ...updated,
          ];
        });
      }
    }
  };

  // Reset all sensors
  const handleResetAllSensors = () => {
    const now = Date.now();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Finalize any currently open sensors
    const openSensorIds = Object.keys(sensorOpenTimestamps.current);
    if (openSensorIds.length > 0) {
      setEvents((prev) => {
        let updated = [...prev];
        openSensorIds.forEach((sId) => {
          const startTime = sensorOpenTimestamps.current[sId];
          const openEventId = sensorOpenEventIds.current[sId];
          const elapsed = startTime ? Math.max(1, Math.round((now - startTime) / 1000)) : 1;
          const target = sensors.find((s) => s.id === sId);

          updated = updated.map((evt) =>
            evt.id === openEventId ? { ...evt, durationSeconds: elapsed } : evt
          );

          if (target) {
            updated.unshift({
              id: `evt-${now}-${sId}`,
              deviceId: target.id,
              sensorName: target.name,
              action: 'closed',
              timestamp: timeNow,
              durationSeconds: 0,
            });
          }
        });
        return updated;
      });
      sensorOpenTimestamps.current = {};
      sensorOpenEventIds.current = {};
    }

    setSensors((prev) =>
      prev.map((s) => ({
        ...s,
        state: 'closed',
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200/60 via-sky-100/50 to-blue-50/60 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Clouds Background */}
      {!(activeTab === 'floorplan') && (
        <FloatingCloudsBackground />
      )}
      {/* Header */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Views */}
        {activeTab === 'floorplan' && (
          <FloorplanView
            sensors={sensors}
            onToggleSensor={handleToggleSensor}
            profile={profile}
            onSendChime={handleSendChime}
            lastChimeSentTime={lastChimeSentTime}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineTimeline
            events={events}
            baseline={baseline}
            profile={profile}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorGrid
            sensors={sensors}
            onToggleSensor={handleToggleSensor}
            onResetAllSensors={handleResetAllSensors}
          />
        )}

        {/* Privacy */}
        {activeTab === 'privacy' && (
          <PrivacyInspector sensors={sensors} />
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <ChimeModal
        isOpen={isChimeModalOpen}
        onClose={() => setIsChimeModalOpen(false)}
        profile={profile}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
