# Architecture & Codebase Structure

This document details the architecture, directory structure, and component layout of Darly.

---

## System Architecture Diagram

```mermaid
flowchart TD
    subgraph Hardware["1. Ring Entryway Telemetry"]
        CS["Ring Alarm Contact Sensor<br/>(Front Door Open / Close)"]
        MD["Ring Alarm Motion Detector<br/>(Indoor Foyer Movement)"]
        VD["Ring Video Doorbell<br/>(Porch Motion & Chime Ding)"]
    end

    subgraph Ingestion["2. Ingestion & Dual-Mode Pipeline"]
        WH["POST /api/webhook<br/>(Live Ring Webhooks via Zod)"]
        SCEN["Care Scenarios Engine<br/>(4 Baseline Care Scenarios)"]
        SSE["SSE Event Broadcast<br/>(/api/ring/events)"]
        WH --> SSE
        SCEN --> SSE
    end

    subgraph Engine["3. Deterministic Safety Engine"]
        BL["Routine Baseline<br/>(Curfew: 22:00-06:00, Waking: 08:00-10:00)"]
        RULES["Safety Rules Evaluator<br/>• checkNightWandering()<br/>• checkDoorAjar()<br/>• checkVisitorFilter()"]
        DET["Anomaly Detector<br/>(Safe | Info | Warning | Emergency)"]
        BL --> RULES
        RULES --> DET
    end

    subgraph UI["4. Caregiver Presentation Layer"]
        DASH["Main Dashboard (app/page.tsx)"]
        T3D["Three.js 3D Viewport<br/>(Interactive Entryway Model)"]
        TL["Routine Activity Timeline<br/>(Chronological Event Stream)"]
        PRIV["Privacy Inspector<br/>('What The System Sees')"]
        ESC["Two-Tier Escalation<br/>(Neighbor Check / 911 Dispatch)"]
        
        DASH --> T3D
        DASH --> TL
        DASH --> PRIV
        DASH --> ESC
    end

    CS -->|Live Webhook| WH
    MD -->|Live Webhook| WH
    VD -->|Live Webhook| WH

    SSE --> Engine
    DET --> UI
```

---

## Directory Structure

```
darly/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ring/
│   │   │   │   ├── analytics/      # Routine metrics and anomalies
│   │   │   │   ├── config/         # Baseline safety thresholds
│   │   │   │   ├── devices/        # Connected Ring devices
│   │   │   │   ├── events/         # Sensor event stream
│   │   │   │   └── token/          # Ring token management
│   │   │   └── webhook/
│   │   │       ├── route.ts        # Ingests Ring webhooks
│   │   │       └── test/route.ts   # Test webhook injector
│   │   ├── layout.tsx              # Root layout and metadata
│   │   └── page.tsx                # Main caregiver dashboard
│   ├── components/
│   │   ├── CameraFocusDock.tsx     # 3D camera controls
│   │   ├── CareScenariosPanel.tsx  # Scenario selector panel
│   │   ├── ChimeModal.tsx          # Resident check-in modal
│   │   ├── CloudElements.tsx       # Cloud status pills
│   │   ├── DeviceSpecCards.tsx     # Hardware spec cards
│   │   ├── EmergencyModal.tsx      # Emergency escalation modal
│   │   ├── EntrywayBadge.tsx       # Entryway status badge
│   │   ├── FloorplanView.tsx       # 3D entryway view
│   │   ├── Footer.tsx              # Application footer
│   │   ├── Header.tsx              # Header with controls
│   │   ├── House3DView.tsx         # Three.js 3D model
│   │   ├── PrivacyInspector.tsx    # Privacy telemetry inspector
│   │   ├── QuickControlsOverlay.tsx# Device quick controls
│   │   ├── ResidentInfoBar.tsx     # Resident info banner
│   │   ├── RoutineTimeline.tsx     # Daily activity timeline
│   │   ├── SensorGrid.tsx          # Device telemetry grid
│   │   └── SettingsModal.tsx       # Routine settings modal
│   ├── lib/
│   │   ├── constants/
│   │   │   └── ringDocs.ts         # Ring documentation links
│   │   ├── engine/
│   │   │   ├── anomaly-detector.ts # Routine anomaly detector
│   │   │   ├── routine-baseline.ts # Baseline schedule config
│   │   │   ├── rules.ts            # Safety classification rules
│   │   │   └── types.ts            # Safety engine types
│   │   ├── schemas/
│   │   │   └── webhook.ts          # Zod webhook schemas
│   │   ├── types/
│   │   │   ├── devices.ts          # Device data types
│   │   │   ├── profile.ts          # Resident profile types
│   │   │   └── webhook.ts          # Ring webhook types
│   │   ├── auth.ts                 # Ring token auth
│   │   ├── mock-data.ts            # Default seed data
│   │   ├── scenarios.ts            # 4 care scenarios
│   │   └── sse-broadcast.ts        # Real-time SSE hub
│   └── utils/
│       ├── audioChime.ts           # Web Audio synthesizer
│       └── timelineUtils.tsx       # Timeline display helpers
├── public/                         # Static assets and icons
├── LICENSE                         # Apache License 2.0
├── package.json
└── tsconfig.json
```

---

## Architectural Layers

### 1. Ingestion Layer (`/api/webhook` & `/api/webhook/test`)
- **Transport Standard:** Conforms to Amazon Ring's JSON:API webhook format.
- **Validation:** Every incoming payload is validated at runtime using Zod schemas (`src/lib/schemas/webhook.ts`).
- **Event Broadcasting:** Validated events are stored in-memory and fanned out via Server-Sent Events (`src/lib/sse-broadcast.ts`) to active dashboard clients.

### 2. Decision Engine (`src/lib/engine/`)
- **`routine-baseline.ts`:** Manages baseline schedule configuration (active daytime window, night curfew window, maximum allowable door-ajar duration).
- **`rules.ts`:** Pure, deterministic rule evaluators:
  - `checkNightWandering`: Flags exterior door openings during night curfew hours.
  - `checkDoorAjar`: Flags door contact states that remain open past the allowed threshold.
  - `checkVisitorFilter`: Correlates doorbell dings and porch motion with closed interior doors to classify benign courier visits.
- **`anomaly-detector.ts`:** Evaluates event sequences against the baseline and assigns one of four severity levels:
  - `safe` (All clear, normal routine)
  - `info` (Benign event, courier delivery filtered)
  - `warning` (Routine deviation, missed morning activity)
  - `emergency` (Night wandering or unclosed exterior door)

### 3. Presentation & Interaction Layer (`src/components/`)
- **3D House View (`House3DView.tsx`):** Rendered with Three.js. Provides real-time visual feedback for door open/close animations, doorbell ringing states, and motion detection halos.
- **Privacy Inspector (`PrivacyInspector.tsx`):** Displays side-by-side payloads demonstrating that no audio or video streams enter the home.
- **Audio Synthesizer (`src/utils/audioChime.ts`):** Synthesizes ambient chimes and telephone audio procedurally through the Web Audio API without external audio file dependencies.
