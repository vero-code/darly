'use client';

import { useState } from 'react';
import { RingEntrywayDevice, SIMULATED_DEVICES } from '@/lib/mock-data';
import { Header } from "@/components/Header";
import { PrivacyInspector } from "@/components/PrivacyInspector";
import { FloatingCloudsBackground } from "@/components/CloudElements";

export default function Home() {
  const [sensors, setSensors] = useState<RingEntrywayDevice[]>(SIMULATED_DEVICES);
  const [activeTab, setActiveTab] = useState<string>('floorplan');

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
        />
      </div>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Privacy */}
        {activeTab === 'privacy' && (
          <PrivacyInspector sensors={sensors} />
        )}
      </main>
    </div>
  );
}
