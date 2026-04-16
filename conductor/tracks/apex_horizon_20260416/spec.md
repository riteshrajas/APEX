# Technical Specification: Apex Horizon

## Architecture
- **Framework:** Next.js / React (PWA)
- **Transport:**
  - Level 1: Web Serial API (USB)
  - Level 2: MQTT via Local Broker (WiFi)
  - Level 3: WebSocket/HTTPS via Apex Cloud (LTE)

## Key Features
1. **Universal HUD:** Unified telemetry dashboard for all connected node levels.
2. **Omni-Flasher:** Logic to detect board type and pull firmware from Level 1, 2, or 3 repositories.
3. **Semantic Command Injector:** Local inference UI to send natural language instructions to hardware.
4. **Offline Mode:** Local caching of telemetry and historical logs.
