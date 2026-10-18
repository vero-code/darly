export type ScenarioSeverity = 'safe' | 'info' | 'warning' | 'critical'

export interface ScenarioEvent {
  deviceId: string
  deviceName: string
  eventType: 'motion_detected' | 'door_opened' | 'door_closed' | 'ding'
  relativeTime: string // Display offset (e.g. "08:30:00 AM")
  description: string
}

export interface CareScenario {
  id: string
  title: string
  category: 'routine' | 'night_alert' | 'inactivity' | 'visitor'
  severity: ScenarioSeverity
  description: string
  caregiverSummary: string
  events: ScenarioEvent[]
}

export const CARE_SCENARIOS: CareScenario[] = [
  {
    id: 'normal_morning',
    title: 'Normal Routine',
    category: 'routine',
    severity: 'safe',
    description: 'Elderly family member wakes up at 08:30 AM, steps out to collect the mail, and returns safely within 2 minutes.',
    caregiverSummary: 'Routine completed safely: Front door opened at 08:30 AM, mail collected, door securely closed.',
    events: [
      {
        deviceId: 'darly-motion-detector',
        deviceName: 'Ring Alarm Motion Detector',
        eventType: 'motion_detected',
        relativeTime: '08:30:00 AM',
        description: 'Movement detected near the front entrance.',
      },
      {
        deviceId: 'darly-contact-sensor',
        deviceName: 'Ring Alarm Contact Sensor',
        eventType: 'door_opened',
        relativeTime: '08:30:15 AM',
        description: 'Front door opened.',
      },
      {
        deviceId: 'darly-video-doorbell',
        deviceName: 'Ring Video Doorbell',
        eventType: 'motion_detected',
        relativeTime: '08:30:30 AM',
        description: 'Person detected on the front porch stepping outside.',
      },
      {
        deviceId: 'darly-contact-sensor',
        deviceName: 'Ring Alarm Contact Sensor',
        eventType: 'door_closed',
        relativeTime: '08:32:10 AM',
        description: 'Front door closed and securely latched.',
      },
    ],
  },
  {
    id: 'night_wandering',
    title: 'Night Wandering',
    category: 'night_alert',
    severity: 'critical',
    description: 'Front door opened unexpectedly at 03:15 AM and remained ajar without closure, indicating potential confusion or fall.',
    caregiverSummary: 'CRITICAL ALERT: Front door opened at 03:15 AM and has remained ajar for over 5 minutes. Immediate check recommended.',
    events: [
      {
        deviceId: 'darly-contact-sensor',
        deviceName: 'Ring Alarm Contact Sensor',
        eventType: 'door_opened',
        relativeTime: '03:15:00 AM',
        description: 'Exterior front door opened during night sleeping hours.',
      },
      {
        deviceId: 'darly-video-doorbell',
        deviceName: 'Ring Video Doorbell',
        eventType: 'motion_detected',
        relativeTime: '03:15:20 AM',
        description: 'Movement detected on porch in darkness.',
      },
      {
        deviceId: 'darly-contact-sensor',
        deviceName: 'Ring Alarm Contact Sensor',
        eventType: 'door_opened',
        relativeTime: '03:20:00 AM',
        description: 'Door sensor still reporting OPEN status after 5 minutes.',
      },
    ],
  },
  {
    id: 'missed_routine',
    title: 'Missed Routine',
    category: 'inactivity',
    severity: 'warning',
    description: 'No morning entryway activity or door movement detected past typical 10:00 AM waking window.',
    caregiverSummary: 'Gentle reminder: No entryway movement detected as of 10:30 AM. Suggested a friendly call to check in.',
    events: [
      {
        deviceId: 'darly-motion-detector',
        deviceName: 'Ring Alarm Motion Detector',
        eventType: 'motion_detected',
        relativeTime: '10:30:00 AM',
        description: 'Zero motion detected across entryway sensors during normal morning window.',
      },
    ],
  },
  {
    id: 'delivery_filter',
    title: 'Postal Delivery',
    category: 'visitor',
    severity: 'info',
    description: 'External courier approached the porch, rang the doorbell, and departed. Interior door remained closed.',
    caregiverSummary: 'Package delivered at 02:15 PM. Exterior motion safely filtered — interior door was not opened.',
    events: [
      {
        deviceId: 'darly-video-doorbell',
        deviceName: 'Ring Video Doorbell',
        eventType: 'motion_detected',
        relativeTime: '02:15:00 PM',
        description: 'Courier detected approaching the front porch.',
      },
      {
        deviceId: 'darly-video-doorbell',
        deviceName: 'Ring Video Doorbell',
        eventType: 'ding',
        relativeTime: '02:15:15 PM',
        description: 'Doorbell chime pressed.',
      },
      {
        deviceId: 'darly-contact-sensor',
        deviceName: 'Ring Alarm Contact Sensor',
        eventType: 'door_closed',
        relativeTime: '02:15:30 PM',
        description: 'Front door remained closed throughout visit.',
      },
    ],
  },
]
