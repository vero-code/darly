import type { RingEntrywayDevice, SensorEventLog } from './types/devices';
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

export const DEFAULT_HISTORICAL_EVENTS: SensorEventLog[] = [
  {
    id: 'evt-01',
    deviceId: 'darly-motion-detector',
    sensorName: 'Ring Alarm Motion Detector',
    action: 'motion_detected',
    timestamp: '07:22 AM',
    durationSeconds: 15, // Morning wake up & first foyer movement
  },
  {
    id: 'evt-02',
    deviceId: 'darly-contact-sensor',
    sensorName: 'Ring Alarm Contact Sensor',
    action: 'opened',
    timestamp: '09:15 AM',
    durationSeconds: 45, // Stepped out to porch to collect morning mail
  },
  {
    id: 'evt-03',
    deviceId: 'darly-video-doorbell',
    sensorName: 'Ring Video Doorbell',
    action: 'motion_detected',
    timestamp: '09:15 AM',
    durationSeconds: 40, // Porch motion while collecting mail
  },
  {
    id: 'evt-04',
    deviceId: 'darly-contact-sensor',
    sensorName: 'Ring Alarm Contact Sensor',
    action: 'closed',
    timestamp: '09:16 AM',
    durationSeconds: 0, // Front door closed and securely latched
  },
  {
    id: 'evt-05',
    deviceId: 'darly-video-doorbell',
    sensorName: 'Ring Video Doorbell',
    action: 'motion_detected',
    timestamp: '11:40 AM',
    durationSeconds: 30, // Courier delivery on porch (door remained closed)
  },
  {
    id: 'evt-06',
    deviceId: 'darly-video-doorbell',
    sensorName: 'Ring Video Doorbell',
    action: 'ring',
    timestamp: '01:15 PM',
    durationSeconds: 5, // Doorbell chime ring / check-in
  },
];
