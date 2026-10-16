export type AnomalySeverity = 'safe' | 'info' | 'warning' | 'emergency'

export interface DetectedAnomaly {
  id: string
  ruleName: string
  severity: AnomalySeverity
  title: string
  description: string
  timestamp: string
}

export interface CaregiverAnalysis {
  status: AnomalySeverity
  headline: string
  summary: string
  anomalies: DetectedAnomaly[]
  lastCheckTimestamp: string
}
