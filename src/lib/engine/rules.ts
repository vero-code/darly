import { ScenarioEvent } from '../scenarios'
import { DayPhase } from './routine-baseline'
import { DetectedAnomaly } from './types'

/**
 * Rule 1: Checks for door opening during sleeping hours (night wandering risk).
 */
export function checkNightWandering(events: ScenarioEvent[], phase: DayPhase): DetectedAnomaly | null {
  const hasDoorOpen = events.some((e) => e.eventType === 'door_opened')
  if (hasDoorOpen && phase === 'sleeping') {
    return {
      id: 'rule-night-wandering',
      ruleName: 'Night Wandering Detection',
      severity: 'emergency',
      title: 'Night Wandering Alert',
      description: 'Front door opened during designated sleeping hours without scheduled activity.',
      timestamp: new Date().toISOString(),
    }
  }
  return null
}

/**
 * Rule 2: Checks if front door was opened and never reported closed.
 */
export function checkDoorAjar(events: ScenarioEvent[]): DetectedAnomaly | null {
  const doorEvents = events.filter((e) => e.eventType === 'door_opened' || e.eventType === 'door_closed')
  const lastDoorEvent = doorEvents[doorEvents.length - 1]

  if (lastDoorEvent && lastDoorEvent.eventType === 'door_opened') {
    return {
      id: 'rule-door-ajar',
      ruleName: 'Door Left Ajar',
      severity: 'emergency',
      title: 'Front Door Left Ajar',
      description: 'Front door opened and has remained unclosed beyond safety threshold.',
      timestamp: new Date().toISOString(),
    }
  }
  return null
}

/**
 * Rule 3: Distinguishes external delivery/porch motion from indoor activity.
 */
export function checkVisitorFilter(events: ScenarioEvent[]): DetectedAnomaly | null {
  const hasPorchActivity = events.some(
    (e) =>
      e.eventType === 'ding' ||
      ((e.deviceId === 'darly-video-doorbell' ||
        e.deviceName?.toLowerCase().includes('doorbell') ||
        e.deviceId?.toLowerCase().includes('doorbell')) &&
        e.eventType === 'motion_detected')
  )
  const hasDoorOpen = events.some((e) => e.eventType === 'door_opened')

  if (hasPorchActivity && !hasDoorOpen) {
    return {
      id: 'rule-visitor-filtered',
      ruleName: 'External Visitor Filter',
      severity: 'info',
      title: 'Exterior Activity / Delivery',
      description: 'Visitor or courier detected on front porch. Interior door remained securely closed.',
      timestamp: new Date().toISOString(),
    }
  }
  return null
}

/**
 * Rule 4: Checks if typical morning wake-up routine was missed.
 */
export function checkMorningRoutine(hasActivity: boolean, hour: number, deadlineHour: number = 10): DetectedAnomaly | null {
  if (hour >= deadlineHour && !hasActivity) {
    return {
      id: 'rule-missed-routine',
      ruleName: 'Morning Routine Monitor',
      severity: 'warning',
      title: 'Missed Morning Routine',
      description: 'No entryway movement detected past expected 10:00 AM morning window.',
      timestamp: new Date().toISOString(),
    }
  }
  return null
}
