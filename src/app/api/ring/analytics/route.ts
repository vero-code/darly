import { NextRequest, NextResponse } from 'next/server'
import { CARE_SCENARIOS, CareScenario } from '@/lib/scenarios'
import { analyzeScenario, analyzeEntrywayActivity } from '@/lib/engine/anomaly-detector'
import { eventStore } from '@/lib/sse-broadcast'

/**
 * GET /api/ring/analytics?scenario=night_wandering
 * 
 * Returns real-time caregiver safety evaluation, current status banner,
 * active timeline, and available test scenarios for judges.
 */
export async function GET(request: NextRequest) {
  const scenarioParam = request.nextUrl.searchParams.get('scenario') || 'normal_morning'

  // If live mode requested, inspect recent webhook events
  if (scenarioParam === 'live') {
    const liveTimeline = eventStore.slice(0, 20).map((e: any) => {
      let eventType: 'motion_detected' | 'door_opened' | 'door_closed' | 'ding' = 'motion_detected'
      const rawType = String(e.event_type || '').toLowerCase()
      if (rawType.includes('open')) {
        eventType = 'door_opened'
      } else if (rawType.includes('close')) {
        eventType = 'door_closed'
      } else if (rawType.includes('ding') || rawType.includes('chime')) {
        eventType = 'ding'
      }

      let deviceName = e.device_name
      if (!deviceName) {
        const idOrType = (String(e.device_id || '') + ' ' + String(e.event_type || '')).toLowerCase()
        if (idOrType.includes('doorbell') || idOrType.includes('ding')) {
          deviceName = 'Ring Video Doorbell'
        } else if (idOrType.includes('contact') || idOrType.includes('door') || idOrType.includes('open') || idOrType.includes('close')) {
          deviceName = 'Ring Alarm Contact Sensor'
        } else if (idOrType.includes('motion')) {
          deviceName = 'Ring Alarm Motion Detector'
        } else {
          deviceName = 'Ring Alarm Sensor'
        }
      }

      return {
        deviceId: e.device_id || 'ring-device',
        deviceName,
        eventType,
        relativeTime: e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now',
        description: `Live sensor event: ${e.event_type || 'activity detected'}`,
      }
    })

    const analysis = analyzeEntrywayActivity(liveTimeline)

    return NextResponse.json({
      success: true,
      mode: 'live',
      activeScenario: null,
      analysis,
      timeline: liveTimeline,
      availableScenarios: CARE_SCENARIOS.map((s) => ({
        id: s.id,
        title: s.title,
        category: s.category,
        severity: s.severity,
        description: s.description,
      })),
    })
  }

  // Find simulated scenario
  const scenario: CareScenario =
    CARE_SCENARIOS.find((s) => s.id === scenarioParam) || CARE_SCENARIOS[0]

  const analysis = analyzeScenario(scenario)

  return NextResponse.json({
    success: true,
    mode: 'simulation',
    activeScenario: {
      id: scenario.id,
      title: scenario.title,
      category: scenario.category,
      severity: scenario.severity,
      description: scenario.description,
      caregiverSummary: scenario.caregiverSummary,
    },
    analysis,
    timeline: scenario.events,
    availableScenarios: CARE_SCENARIOS.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      severity: s.severity,
      description: s.description,
    })),
  })
}
