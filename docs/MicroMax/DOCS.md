# MicroMax (L1) DOCS

## Role
MicroMax is the wired, low-latency endpoint layer for direct actuator/sensor control.

## Hardware Scope
- Arduino Uno / Nano (ATmega328P)
- Raspberry Pi Pico (RP2040)
- ESP32 (wired mode)

## Transport Profile
- Primary transport: USB Serial
- ASP framing: newline-terminated JSON at 115200 baud (default)

## ASP v2.0 Mapping
- Mandatory legacy compatibility fields:
  - `action`, `target`, `value`
  - `event`, `source`, `type`
  - `query` (heartbeat/identity)
- Recommended v2 envelope:
  - `v`, `id`, `ts`, `node`, `kind`

## Baseline Message Examples
```json
{"action":"WRITE","target":"D13","value":1}
{"event":"TRIGGER","source":"D2","type":"Interrupt"}
{"query":"WHO_ARE_YOU"}
```

## Reliability Expectations
- Heartbeat timeout handling should move outputs to safe state.
- Ack/error responses should include correlation where available (`id`/`ref`).

## Verification Checklist
- [ ] Serial command parser accepts legacy and envelope-based ASP frames
- [ ] Heartbeat timeout transitions to fail-safe
- [ ] Event and telemetry frames serialize as valid JSON lines
