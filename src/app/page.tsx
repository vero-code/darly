'use client';

import { useState } from 'react';
import { Header } from "@/components/Header";
import { FloatingCloudsBackground } from "@/components/CloudElements";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('floorplan');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200/60 via-sky-100/50 to-blue-50/60 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Clouds Background  - hidden on main screen */}
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
    </div>
  );
}
