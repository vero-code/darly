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