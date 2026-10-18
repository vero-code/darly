import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/85 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <nav className="hidden md:flex items-center gap-4 text-[16px] font-medium text-slate-600">
            {[
              { id: 'floorplan', label: 'Floor Plan' },
              { id: 'routine', label: 'Daily Routine' },
              { id: 'sensors', label: 'Ring Devices' },
              { id: 'privacy', label: 'Privacy' },
            ].map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="h-4 w-px bg-slate-200 shrink-0" aria-hidden="true" />
                )}
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 cursor-pointer ${
                    activeTab === item.id
                      ? 'text-sky-600 border-sky-500 font-semibold'
                      : 'border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Settings */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSettings}
              className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors border border-sky-100 bg-white shadow-xs cursor-pointer"
              title="Settings"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
