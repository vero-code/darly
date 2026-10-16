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
    const analysis = analyzeEntrywayActivity([])
    return NextResponse.json({
      success: true,
      mode: 'live',
      activeScenario: null,
      analysis,
      events: eventStore.slice(0, 20),
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
