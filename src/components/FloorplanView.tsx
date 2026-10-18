import React from 'react';
import { RingEntrywayDevice } from '@/lib/types/devices';
import { ResidentProfile } from '@/lib/types/profile';
import { ResidentInfoBar } from './ResidentInfoBar';

interface FloorplanViewProps {
  sensors: RingEntrywayDevice[];
  profile: ResidentProfile;
}

export const FloorplanView: React.FC<FloorplanViewProps> = ({
  sensors,
  profile,
}) => {
  return (
    <div className="space-y-6">
      {/* Info Bar */}
      <ResidentInfoBar 
        profile={profile} 
        deviceCount={sensors.length} 
      />
    </div>
  );
};
