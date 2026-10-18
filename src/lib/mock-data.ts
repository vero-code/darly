import type { RingEntrywayDevice } from './types/devices';
import type { ResidentProfile } from './types/profile';

export const SIMULATED_DEVICES: RingEntrywayDevice[] = [
  {
    id: 'darly-video-doorbell',
    name: 'Ring Video Doorbell',
    kind: 'video_doorbell',
    online: true,
    batteryLevel: 94,
    capabilities: { motionDetection: true, video: true, chime: true },
    location: 'Front Porch',
    careRole: 'Visitor & Delivery Alerts',
    simulated: true,
  },
  {
    id: 'darly-contact-sensor',
    name: 'Ring Alarm Contact Sensor',
    kind: 'contact_sensor',
    online: true,
    batteryLevel: 100,
    state: 'closed',
    capabilities: { contactSensor: true },
    location: 'Front Door',
    careRole: 'Night Wandering Safety',
    simulated: true,
  },
  {
    id: 'darly-motion-detector',
    name: 'Ring Alarm Motion Detector',
    kind: 'motion_sensor',
    online: true,
    batteryLevel: 89,
    capabilities: { motionDetection: true },
    location: 'Indoor Foyer',
    careRole: 'Daily Routine Tracking',
    simulated: true,
  },
]

export const DEFAULT_RESIDENT_PROFILE: ResidentProfile = {
  name: 'Margaret Holloway',
  age: 78,
  timezone: 'America/Los_Angeles (PST)',
  address: '382 Orchard Crest Lane, Bellevue, WA 98004',
  notes: 'Enjoys morning tea on porch. Takes morning blood pressure medication at 8:30 AM.',
  primaryCaregiver: {
    name: 'Sarah Holloway',
    relationship: 'Daughter',
    phone: '+1 (555) 014-2831',
    status: 'online',
  },
  neighborHelper: {
    name: 'Thomas Campbell',
    phone: '+1 (555) 019-3310',
    address: 'Apt 4B (Next door)',
  },
  emergencyService: {
    provider: 'Bellevue Emergency Medical Services (EMS)',
    phone: '911',
  },
};
