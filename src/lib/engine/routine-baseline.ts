export interface RoutineBaselineConfig {
  sleepWindowStartHour: number // 22 (10:00 PM)
  sleepWindowEndHour: number   // 6 (06:00 AM)
  morningRoutineDeadlineHour: number // 10 (10:30 AM)
  doorAjarThresholdMinutes: number   // 5 minutes max before alert
  quickExitThresholdMinutes: number  // 10 minutes max for mail/trash
}

export const DEFAULT_BASELINE: RoutineBaselineConfig = {
  sleepWindowStartHour: 22,
  sleepWindowEndHour: 6,
  morningRoutineDeadlineHour: 10,
  doorAjarThresholdMinutes: 5,
  quickExitThresholdMinutes: 10,
}

export type DayPhase = 'sleeping' | 'morning_active' | 'daytime' | 'evening'

export function getCurrentDayPhase(date: Date = new Date(), config: RoutineBaselineConfig = DEFAULT_BASELINE): DayPhase {
  const hour = date.getHours()

  if (hour >= config.sleepWindowStartHour || hour < config.sleepWindowEndHour) {
    return 'sleeping'
  }
  if (hour >= config.sleepWindowEndHour && hour < config.morningRoutineDeadlineHour) {
    return 'morning_active'
  }
  if (hour >= config.morningRoutineDeadlineHour && hour < 18) {
    return 'daytime'
  }
  return 'evening'
}
