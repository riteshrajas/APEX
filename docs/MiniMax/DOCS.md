# MiniMax (L2) DOCS

## Role
MiniMax is the local wireless node tier for ambient telemetry and sentry workflows.

## Hardware Scope
- Raspberry Pi Pico W
- ESP32 / ESP32-CAM
- Challenger RP2040 WiFi

## Transport Profile
- Primary transport: WiFi + MQTT (or equivalent wireless socket)
- Protocol contract: ASP v2.0 JSON mirrored over wireless transport

## ASP v2.0 Mapping
- Command/query/event semantics match L1 payload contract.
- Wireless bridge should preserve payload body; transport metadata remains outside ASP payload.
- Recommended fields:
  - `v`, `id`, `node`, `kind`
  - telemetry-friendly keys: `metric`, `value`, `unit`

## Typical L2 Payloads
```json
{"v":"2.0","id":"tel-123","kind":"telemetry","source":"pir-1","metric":"motion","value":1}
{"v":"2.0","id":"qry-123","kind":"query","query":"WHO_ARE_YOU"}
{"v":"2.0","id":"evt-123","kind":"event","event":"SENTRY_ALERT","source":"cam-1","type":"visual"}
```

## Reliability Expectations
- Reconnection logic should preserve session identity and re-publish heartbeat.
- Node should emit `ack`/`error` frames for mirrored command paths.

## Verification Checklist
- [ ] MQTT heartbeat survives reconnect cycles
- [ ] ASP payload parity with L1 is maintained
- [ ] Sentry events publish as valid ASP event JSON
