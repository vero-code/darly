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
import { PrivacyInspector } from "@/components/PrivacyInspector";
import { FloatingCloudsBackground } from "@/components/CloudElements";

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
    </div>
  );
}
