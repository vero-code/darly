export interface RingEntrywayDevice {
  id: string
  name: string
  kind: 'doorbell' | 'contact_sensor' | 'motion_sensor'
  online: boolean
  batteryLevel?: number
  state?: 'open' | 'closed'
  capabilities: {
    video?: boolean
    motionDetection?: boolean
    contactSensor?: boolean
    chime?: boolean
  }
  location: string
  simulated: boolean
}

export const SIMULATED_DEVICES: RingEntrywayDevice[] = [
  {
    id: 'darly-front-doorbell',
    name: 'Front Door Video Doorbell',
    kind: 'doorbell',
    online: true,
    batteryLevel: 94,
    capabilities: { motionDetection: true, video: true, chime: true },
    location: 'Front Porch',
    simulated: true,
  },
  {
    id: 'darly-contact-sensor-01',
    name: 'Front Door Contact Sensor',
    kind: 'contact_sensor',
    online: true,
    batteryLevel: 100,
    state: 'closed',
    capabilities: { contactSensor: true },
    location: 'Front Door',
    simulated: true,
  },
  {
    id: 'darly-motion-sensor-01',
    name: 'Entryway Motion Detector',
    kind: 'motion_sensor',
    online: true,
    batteryLevel: 89,
    capabilities: { motionDetection: true },
    location: 'Exterior Walkway',
    simulated: true,
  },
]
