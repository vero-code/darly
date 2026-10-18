'use client';

import { useState, useEffect } from 'react';
import type { RingEntrywayDevice } from '@/lib/types/devices';
import type { ResidentProfile } from '@/lib/types/profile';
import {
  SIMULATED_DEVICES,
  DEFAULT_RESIDENT_PROFILE
} from '@/lib/mock-data';
import { Header } from "@/components/Header";
import { SettingsModal } from "@/components/SettingsModal";
import { SensorGrid } from '@/components/SensorGrid';
import { PrivacyInspector } from "@/components/PrivacyInspector";
import { FloatingCloudsBackground } from "@/components/CloudElements";
import { Footer } from "@/components/Footer";
import { ambientAudio } from '@/utils/audioChime';

export default function Home() {
  const [sensors, setSensors] = useState<RingEntrywayDevice[]>(SIMULATED_DEVICES);
  const [profile, setProfile] = useState<ResidentProfile>(DEFAULT_RESIDENT_PROFILE);

  const [activeTab, setActiveTab] = useState<string>('floorplan');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== sensorId) return s;

        // Toggle state
        let newState: RingEntrywayDevice['state'] = s.state === 'open' ? 'closed' : 'open';

        // Play corresponding sound
        if(newState === 'open') {
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

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
