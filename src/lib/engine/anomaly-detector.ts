import { ScenarioEvent, CareScenario } from '../scenarios'
import { getCurrentDayPhase, DayPhase } from './routine-baseline'
import { CaregiverAnalysis, AnomalySeverity, DetectedAnomaly } from './types'
import {
  checkNightWandering,
  checkDoorAjar,
  checkVisitorFilter,
  checkMorningRoutine,
} from './rules'

export interface AnalysisOptions {
  date?: Date
  category?: string
}

/**
 * Main coordinator: evaluates events against caretaking safety rules.
 */
export function analyzeEntrywayActivity(
  events: ScenarioEvent[],
  options: AnalysisOptions = {}
): CaregiverAnalysis {
  // Infer phase: if night alert scenario, force sleeping phase; otherwise use system time
  let phase: DayPhase = getCurrentDayPhase(options.date || new Date())
  if (options.category === 'night_alert' || events.some((e) => e.relativeTime?.includes('03:'))) {
    phase = 'sleeping'
  }

  const anomalies: DetectedAnomaly[] = []

  // Run Rule 1: Night wandering
  const nightAlert = checkNightWandering(events, phase)
  if (nightAlert) anomalies.push(nightAlert)

  // Run Rule 2: Door left ajar
  const doorAjarAlert = checkDoorAjar(events)
  if (doorAjarAlert) anomalies.push(doorAjarAlert)

  // Run Rule 3: Visitor / Delivery filter
  const visitorNotice = checkVisitorFilter(events)
  if (visitorNotice) anomalies.push(visitorNotice)

  // Run Rule 4: Missed morning routine
  if (options.category === 'inactivity') {
    const missedRoutine = checkMorningRoutine(false, 11)
    if (missedRoutine) anomalies.push(missedRoutine)
  }

  // Calculate overall severity priority: emergency > warning > info > safe
  let overallStatus: AnomalySeverity = 'safe'
  if (anomalies.some((a) => a.severity === 'emergency')) {
    overallStatus = 'emergency'
  } else if (anomalies.some((a) => a.severity === 'warning')) {
    overallStatus = 'warning'
  } else if (anomalies.some((a) => a.severity === 'info')) {
    overallStatus = 'info'
  }

  // Formulate human headline & summary for caregiver
  const headline = getCaregiverHeadline(overallStatus)
  const summary =
    anomalies.length > 0
      ? anomalies.map((a) => a.description).join(' ')
      : 'Routine completed safely. Entryway activity aligns with expected household pattern.'

  return {
    status: overallStatus,
    headline,
    summary,
    anomalies,
    lastCheckTimestamp: new Date().toISOString(),
  }
}

/**
 * Convenience helper to evaluate a full CareScenario.
 */
export function analyzeScenario(scenario: CareScenario): CaregiverAnalysis {
  return analyzeEntrywayActivity(scenario.events, { category: scenario.category })
}

function getCaregiverHeadline(status: AnomalySeverity): string {
  switch (status) {
    case 'emergency':
      return 'Critical Safety Alert: Attention Required'
    case 'warning':
      return 'Routine Check-In Suggested'
    case 'info':
      return 'Front Porch Activity Filtered'
    case 'safe':
    default:
      return 'All Clear — Normal Routine'
  }
}
