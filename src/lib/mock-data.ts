import { RingEntrywayDevice } from './types/devices';

export const SIMULATED_DEVICES: RingEntrywayDevice[] = [
  {
    id: 'darly-video-doorbell',
    name: 'Ring Video Doorbell',
    kind: 'doorbell',
    online: true,
    batteryLevel: 94,
    capabilities: { motionDetection: true, video: true, chime: true },
    location: 'Front Porch',
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
    simulated: true,
  },
  {
    id: 'darly-motion-detector',
    name: 'Ring Alarm Motion Detector',
    kind: 'motion_sensor',
    online: true,
    batteryLevel: 89,
    capabilities: { motionDetection: true },
    location: 'Front Porch',
    simulated: true,
  },
]
