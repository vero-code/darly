import React, { useState, useEffect } from 'react';
import type { ResidentProfile } from '@/lib/types/profile';
import type { RoutineBaselineConfig } from '@/lib/engine/routine-baseline';
import {
  X,
  Save,
  Check,
  Cloud
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ResidentProfile;
  onSave: (updatedProfile: ResidentProfile) => void;
  baseline: RoutineBaselineConfig;
  onSaveBaseline: (updatedBaseline: RoutineBaselineConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  baseline,
  onSaveBaseline,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'profile' | 'contacts'>('routine');

  const [formProfile, setFormProfile] = useState<ResidentProfile>(profile);
  const [formBaseline, setFormBaseline] = useState<RoutineBaselineConfig>(baseline);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormProfile(profile);
  }, [profile]);

  useEffect(() => {
    setFormBaseline(baseline);
  }, [baseline]);

  if (!isOpen) return null;

  const formatHourToTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const parseTimeToHour = (timeStr: string) => {
    const [h] = timeStr.split(':');
    const parsed = parseInt(h, 10);
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(23, parsed));
  };

  const handleSave = () => {
    onSave(formProfile);
    onSaveBaseline(formBaseline);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-sky-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-sky-500 fill-sky-100" />
              <span>Settings</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 text-[16px] font-medium shrink-0">
          <button
            onClick={() => setActiveSubTab('routine')}
            type="button"
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'routine' ? 'text-sky-600 border-sky-500 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            Routine Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            type="button"
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'profile' ? 'text-sky-600 border-sky-500 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            Resident Profile
          </button>
          <button
            onClick={() => setActiveSubTab('contacts')}
            type="button"
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'contacts' ? 'text-sky-600 border-sky-500 font-bold' : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            Emergency Contacts
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-[16px]">
          {activeSubTab === 'routine' && (
            <div className="space-y-6">
              {/* Entryway Safety Threshold: Door Ajar Limit */}
              <div className="p-5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-900 text-[16px] block">
                      Door Ajar Limit
                    </label>
                    <span className="text-slate-600 text-[14px]">
                      Alerts caregiver if the entryway door remains open longer than this duration
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[22px] font-bold text-sky-700">
                      {formBaseline.doorAjarThresholdMinutes}
                    </span>
                    <span className="text-slate-600 text-[14px] ml-1">min</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={formBaseline.doorAjarThresholdMinutes}
                  onChange={(e) =>
                    setFormBaseline({
                      ...formBaseline,
                      doorAjarThresholdMinutes: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-sky-500 cursor-pointer"
                />

                <div className="flex justify-between text-[14px] font-semibold text-slate-500">
                  <span>1 min</span>
                  <span>5 min (Default)</span>
                  <span>15 min</span>
                </div>
              </div>

              {/* Daily Circadian Rhythm Schedule (Hours for 24h Timeline) */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-[16px]">
                    Timeline Schedule
                  </h4>
                  <p className="text-slate-500 text-[14px]">
                    Configures phase hours on the 24-hour visual timeline.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Night Rest */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between h-full space-y-3">
                    <div>
                      <label className="font-bold text-slate-900 block text-[16px]">
                        Night Rest
                      </label>
                      <p className="text-slate-500 text-[14px] mt-0.5">
                        Ends: morning begins
                      </p>
                    </div>
                    <input
                      type="time"
                      value={formatHourToTime(formBaseline.sleepWindowEndHour)}
                      onChange={(e) =>
                        setFormBaseline({
                          ...formBaseline,
                          sleepWindowEndHour: parseTimeToHour(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                    />
                  </div>

                  {/* Morning Routine */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between h-full space-y-3">
                    <div>
                      <label className="font-bold text-slate-900 block text-[16px]">
                        Morning Routine
                      </label>
                      <p className="text-slate-500 text-[14px] mt-0.5">
                        Ends: routine deadline
                      </p>
                    </div>
                    <input
                      type="time"
                      value={formatHourToTime(formBaseline.morningRoutineDeadlineHour)}
                      onChange={(e) =>
                        setFormBaseline({
                          ...formBaseline,
                          morningRoutineDeadlineHour: parseTimeToHour(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                    />
                  </div>

                  {/* Night Sleep */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between h-full space-y-3">
                    <div>
                      <label className="font-bold text-slate-900 block text-[16px]">
                        Night Sleep
                      </label>
                      <p className="text-slate-500 text-[14px] mt-0.5">
                        Starts: night curfew
                      </p>
                    </div>
                    <input
                      type="time"
                      value={formatHourToTime(formBaseline.sleepWindowStartHour)}
                      onChange={(e) =>
                        setFormBaseline({
                          ...formBaseline,
                          sleepWindowStartHour: parseTimeToHour(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-[16px]">Full Name</label>
                <input
                  type="text"
                  value={formProfile.name}
                  onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-[16px]">Age</label>
                  <input
                    type="number"
                    value={formProfile.age}
                    onChange={(e) => setFormProfile({ ...formProfile, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-[16px]">Timezone</label>
                  <input
                    type="text"
                    value={formProfile.timezone}
                    onChange={(e) => setFormProfile({ ...formProfile, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-[16px]">Address</label>
                <input
                  type="text"
                  value={formProfile.address}
                  onChange={(e) => setFormProfile({ ...formProfile, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 text-[16px]">Routine Notes</label>
                <textarea
                  rows={3}
                  value={formProfile.notes}
                  onChange={(e) => setFormProfile({ ...formProfile, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                />
              </div>
            </div>
          )}

          {activeSubTab === 'contacts' && (
            <div className="space-y-5">
              {/* Tier 1: In-home Ring Chime */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sky-900 text-[16px]">In-home Ring Chime (Tier 1 Escalation)</div>
                  <span className="text-[14px] font-semibold text-sky-700 bg-sky-100/90 px-2.5 py-0.5 rounded-lg border border-sky-200">
                    Automated
                  </span>
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Automated audio chime prompt played on the indoor Ring Chime speaker.
                </p>
              </div>

              {/* Tier 2: Resident Direct Call */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
                <div className="font-bold text-sky-800 text-[16px]">Direct Call (Tier 2 Escalation)</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formProfile.name}
                    disabled
                    className="px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-700 font-medium text-[16px]"
                  />
                  <input
                    type="text"
                    placeholder="Direct Phone Number"
                    value={formProfile.phone || ''}
                    onChange={(e) => setFormProfile({
                      ...formProfile,
                      phone: e.target.value
                    })}
                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                  />
                </div>
              </div>

              {/* Tier 3: Neighbor Helper */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                <div className="font-bold text-amber-900 text-[16px]">Neighbor Helper (Tier 3 Escalation)</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Neighbor Name"
                    value={formProfile.neighborHelper.name}
                    onChange={(e) => setFormProfile({
                      ...formProfile,
                      neighborHelper: { ...formProfile.neighborHelper, name: e.target.value }
                    })}
                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                  />
                  <input
                    type="text"
                    placeholder="Neighbor Phone"
                    value={formProfile.neighborHelper.phone}
                    onChange={(e) => setFormProfile({
                      ...formProfile,
                      neighborHelper: { ...formProfile.neighborHelper, phone: e.target.value }
                    })}
                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                  />
                </div>
              </div>

              {/* Tier 4: Emergency Service */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                <div className="font-bold text-rose-900 text-[16px]">Emergency Services (Tier 4 Escalation)</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Service Provider (e.g. Local EMS)"
                    value={formProfile.emergencyService.provider}
                    onChange={(e) => setFormProfile({
                      ...formProfile,
                      emergencyService: { ...formProfile.emergencyService, provider: e.target.value }
                    })}
                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-[16px]"
                  />
                  <input
                    type="text"
                    placeholder="Emergency Phone"
                    value={formProfile.emergencyService.phone}
                    onChange={(e) => setFormProfile({
                      ...formProfile,
                      emergencyService: { ...formProfile.emergencyService, phone: e.target.value }
                    })}
                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-[16px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-sky-50/60 border-t border-sky-100 flex items-center justify-between shrink-0">
          <div className="text-[14px]">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-5 h-5" />
                <span>Settings saved successfully</span>
              </span>
            ) : (
              <span className="text-slate-500">Settings saved in browser local storage</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 text-[14px] font-semibold text-slate-600 hover:text-slate-900 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-5 py-2.5 text-[16px] font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-sky-200"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
