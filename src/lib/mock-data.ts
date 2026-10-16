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
    id: 'darly-ring-doorbell',
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
