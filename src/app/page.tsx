'use client';

import { useState, useEffect } from 'react';
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

    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== sensorId) return s;

        // Toggle state
        const newState: RingEntrywayDevice['state'] = s.state === 'open' ? 'closed' : 'open';

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
    if (target && (target.kind === 'video_doorbell' || target.kind === 'motion_sensor') && target.state !== 'open') {
      setTimeout(() => {
        setSensors((current) =>
          current.map((dev) =>
            dev.id === sensorId ? { ...dev, state: 'closed' } : dev
          )
        );
      }, 3000);
    }

    // Record sensor activation in activity log
    if (target) {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextAction: SensorEventLog['action'] = 
        target.kind === 'motion_sensor'
          ? 'motion_detected'
          : target.kind === 'video_doorbell'
            ? 'ring'
            : (target.state === 'open' ? 'closed' : 'opened');

      setEvents((prev) => [
        {
          id: `evt-${Date.now()}`,
          deviceId: target.id,
          sensorName: target.name,
          action: nextAction,
          timestamp: timeNow,
          durationSeconds: target.kind === 'motion_sensor' ? 15 : target.kind === 'video_doorbell' ? 5 : 45,
        },
        ...prev,
      ]);
    }
  };

  // Reset all sensors
  const handleResetAllSensors = () => {
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
