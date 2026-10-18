export interface RingEntrywayDevice {
  id: string
  name: string
  kind: 'video_doorbell' | 'contact_sensor' | 'motion_sensor'
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
  careRole?: string
  simulated: boolean
}

export interface SensorEventLog {
  id: string;
  deviceId: string;
  sensorName: string;
  action: 'opened' | 'closed' | 'motion_detected' | 'ring';
  timestamp: string;
  durationSeconds?: number;
}
