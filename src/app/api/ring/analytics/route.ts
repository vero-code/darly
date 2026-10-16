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
    const liveTimeline = eventStore.slice(0, 20).map((e: any) => ({
      deviceId: e.device_id || 'ring-device',
      deviceName: e.device_id?.includes('doorbell') ? 'Ring Video Doorbell' : 'Ring Alarm Sensor',
      eventType: e.event_type === 'ding' ? 'ding' : (e.event_type || 'motion_detected'),
      relativeTime: e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Just now',
      description: `Live sensor event: ${e.event_type || 'activity detected'}`,
    }))

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
