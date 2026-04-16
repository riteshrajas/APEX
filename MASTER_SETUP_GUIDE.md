# APEX Master Setup Guide (L1/L2/L3 Onboarding)

## 1) Prerequisites
- Git with submodule support
- Node.js + npm (Core/RAM)
- Bun (Core/CLI)
- Python 3.10+ (CLI tests/tooling)
- PlatformIO (firmware builds where applicable)

## 2) Clone and Initialize
```bash
git clone <repo-url> APEX
cd APEX
git submodule update --init --recursive
```

## 3) Bring Up Core Layers

### Core/RAM
```bash
cd /path/to/APEX/Core/RAM
npm install
npm run dev
```

### Core/CLI
```bash
cd /path/to/APEX/Core/CLI
bun run dev
```

## 4) Node-Level Onboarding

### L1 MicroMax
1. Connect node over USB serial.
2. Configure firmware for supported board (Uno/Pico/ESP32 wired mode).
3. Validate ASP line framing with:
   - `{"query":"WHO_ARE_YOU"}`
   - `{"action":"WRITE","target":"D13","value":1}`

### L2 MiniMax
1. Provision WiFi credentials and MQTT broker endpoint.
2. Ensure bridge mirrors ASP payloads without mutating command/event semantics.
3. Validate heartbeat + reconnection under temporary network loss.

### L3 MegaMax
1. Provision SIM/modem and APN settings.
2. Validate LTE data path first, then SMS fallback path.
3. Confirm periodic telemetry (including GPS if enabled) with ASP-compliant JSON.

## 5) ASP v2.0 Conformance Checks
- Use `/home/runner/work/APEX/APEX/SPEC_ASP_V2.md` as canonical reference.
- Ensure nodes accept legacy minimal payloads and v2 envelope payloads.
- Ensure parsers validate expected keys/types and reject malformed frames safely.

## 6) Fail-Safe Expectations
- Heartbeat loss should trigger deterministic safe behavior on actuator-capable nodes.
- Recovery should send explicit `event`, `ack`, or `error` frames where possible.

## 7) Documentation Map
- Protocol spec: `/home/runner/work/APEX/APEX/SPEC_ASP_V2.md`
- Research log: `/home/runner/work/APEX/APEX/RESEARCH.md`
- L1 docs: `/home/runner/work/APEX/APEX/docs/MicroMax/DOCS.md`
- L2 docs: `/home/runner/work/APEX/APEX/docs/MiniMax/DOCS.md`
- L3 docs: `/home/runner/work/APEX/APEX/docs/MegaMax/DOCS.md`
