import React from 'react';
import { SlidersHorizontal, PlayCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/85 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="Darly Logo"
              className="w-11 h-11 rounded-2xl object-contain shadow-sm border border-sky-100 bg-white p-1"
            />
            <button 
              onClick={() => setActiveTab('floorplan')}
              className="text-left cursor-pointer group"
            >
              <span className="text-[20px] font-bold tracking-tight text-slate-800 group-hover:text-sky-600 transition-colors whitespace-nowrap shrink-0">
                Darly
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-[16px] font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('floorplan')}
              className={`hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'floorplan' ? 'text-sky-600 border-sky-500 font-semibold' : 'border-transparent'
              }`}
            >
              Floor plan
            </button>
            <button
              onClick={() => setActiveTab('sensors')}
              className={`hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'sensors' ? 'text-sky-600 border-sky-500 font-semibold' : 'border-transparent'
              }`}
            >
              Ring Devices
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'privacy' ? 'text-sky-600 border-sky-500 font-semibold' : 'border-transparent'
              }`}
            >
              Privacy
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors border border-sky-100 bg-white shadow-xs cursor-pointer"
              title="Settings & Contacts"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              className="px-4 py-2.5 text-[16px] font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm shadow-sky-200 cursor-pointer"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Test Scenarios</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
