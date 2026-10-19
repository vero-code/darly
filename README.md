# Darly

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Ambient, privacy-first caretaking system for elderly relatives using Ring entryway sensors.

Darly monitors daily activity patterns exclusively through exterior and entryway telemetry (door contact sensors, foyer motion detectors, video doorbell) to detect safety anomalies without placing cameras inside private living spaces.

Developed for the Amazon Developer Hackathon (Ring Track). View the official project submission on [Devpost](https://devpost.com/software/darly).

---

## Core Functions

1. **Ambient Routine Baseline Monitoring**
   Tracks daily waking windows and entryway movement patterns (such as morning porch visits) without indoor cameras. Flags inactivity when expected routine intervals pass without detected movement.

2. **Night Wandering & Door Safety Watchdog**
   Monitors front door contact sensor status during sleeping hours. Detects anomalies when an exterior door is opened during the night or left ajar beyond a configurable safety threshold (e.g., 5 minutes).

3. **Entryway Event Classification & Escalation**
   Correlates exterior motion and doorbell events with door contact state to filter benign external events (e.g., postal deliveries where the interior door remains closed) and provides a two-tier escalation workflow (neighbor check and 911 emergency dispatch with location display).

---

## Privacy Architecture: "What The System Sees"

Darly is built on an explicit zero-indoor-surveillance principle:
- **No Cameras Inside the Home:** Telemetry is strictly confined to the exterior and entryway perimeter. Living rooms and bedrooms remain completely private.
- **No Audio Recording:** Microphones and audio feeds are not accessed or recorded.
- **Discrete Binary States:** The system operates solely on discrete state transitions (open/closed, motion detected, doorbell press).

The built-in **Privacy Inspector** provides side-by-side inspection of:
1. **Raw Ring Webhook Payload:** The incoming Amazon Ring JSON:API structure (`api.amazonvision.com` / `POST /api/webhook`).
2. **Normalized Privacy Telemetry:** Darly's internal event schema (`ScenarioEvent`), stripping all unneeded metadata and exposing only what is essential for safety rules.

---

## Supported Ring Hardware

Darly is designed around official consumer Ring devices with documented specifications and standard Ring API schemas:

| Device | Location | Hardware Role | Official Ring Documentation |
| :--- | :--- | :--- | :--- |
| **Ring Video Doorbell** | Front Porch | Visitor alerts, courier detection, two-way check-in | [Video Doorbell Wired Support](https://ring.com/support/products/doorbells/video-doorbell-wired?page=1) |
| **Ring Alarm Contact Sensor** | Front Door | Door open/closed state, night wandering watchdog, door-ajar timer | [Ring Alarm Contact Sensor Guide](https://ring.com/support/articles/ju1zx/Setting-Up-and-Using-Your-Ring-Alarm-Contact-Sensor) |
| **Ring Alarm Motion Detector** | Indoor Foyer | Entryway transit, morning wake-up routine detection | [Ring Alarm Motion Detector Guide](https://ring.com/support/articles/3osk6/Setting-up-and-Using-Your-Ring-Alarm-Motion-Detector) |

Device classifications, event types (`door_opened`, `door_closed`, `motion_detected`, `ding`), and connectivity status (`online: boolean`) strictly follow Amazon Ring API specifications, alongside standard Ring Device Health battery monitoring.

---

## Ring Integration & Dual-Mode Architecture

Core Ring API connection patterns, token management, and webhook handling are adapted from the official [`AmazonAppDev/ring-api-helloworld`](https://github.com/AmazonAppDev/ring-api-helloworld) starter template (under the MIT License).

- **Live Mode:** When Ring developer credentials (`RING_ACCESS_TOKEN` or OAuth refresh tokens) are provided in `.env.local`, Darly connects directly to `https://api.amazonvision.com/v1/devices` and ingests real-time webhooks.
- **Offline / Standalone Mode:** When run without credentials, Darly operates completely offline using 4 pre-configured care scenarios (`normal_morning`, `night_wandering`, `missed_routine`, `delivery_filter`), enabling evaluation without physical hardware binding or developer KYC restrictions.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **UI & 3D Visualization:** React 19, Three.js (interactive 3D entryway model), Tailwind CSS 4, Lucide React
- **Validation:** Zod
- **Audio Synthesis:** Web Audio API (ambient in-home chimes and telephone tones)
- **Ring Integration:** Ring device data models, webhook event ingestion pipeline, and baseline scenarios for edge-case testing

---

## Architecture & Codebase Layout

Darly separates concerns into an event ingestion pipeline, a deterministic safety engine, and an interactive 3D caregiver interface:

- **`src/app/api/`** — Ring API endpoints (`/api/ring/*`) and JSON:API webhook ingestion (`/api/webhook`).
- **`src/lib/engine/`** — Routine baseline schedules, deterministic safety rules, and anomaly evaluation.
- **`src/components/`** — 17 focused UI components including interactive 3D entryway model, privacy inspector, and timeline.
- **`src/utils/`** — Procedural Web Audio API sound engine and timeline formatters.

> For the complete file-by-file directory tree and architectural layer breakdown, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Backend API Endpoints

- `POST /api/webhook`: Ingests Ring sensor event payloads (motion, contact open/closed, doorbell rings) and validates them with Zod schemas.
- `POST /api/webhook/test` *(or GET)*: Test harness for injecting test sensor events.
- `GET /api/ring/devices`: Returns connected Ring entryway devices and their current operational status.
- `GET /api/ring/events`: Returns historical and recent sensor activity logs.
- `GET /api/ring/analytics`: Returns calculated routine adherence metrics and anomaly frequency.
- `GET/POST /api/ring/config`: Reads and updates baseline parameters (curfew hours, routine deadlines, door-ajar limits).
- `GET/POST /api/ring/token`: Manages Ring API token configuration.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
git clone https://github.com/vero-code/darly.git
cd darly
npm install
```

### Environment Configuration (Optional)
To connect to live Ring accounts via Ring Developer tools, configure `.env.local`:
```bash
cp .env.example .env.local
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
