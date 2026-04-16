# MegaMax (L3) DOCS

## Role
MegaMax is the long-range tier for cellular-connected and mobility-oriented deployments.

## Hardware Scope
- ESP32 + SIM800L / SIM7000G
- RP2040 + SIM7000G
- LilyGO T-SIM series

## Transport Profile
- Primary transport: LTE/Cat-M/NB-IoT data sockets
- Fallback transport: SMS control channel
- Payload contract: ASP v2.0 JSON for data channels; SMS may carry compact command/query subsets

## ASP v2.0 Mapping
- Reuse L1/L2 core semantics (`command`, `query`, `event`, `telemetry`, `ack`, `error`).
- For failover, keep command intent consistent across data and SMS paths.
- Recommended metadata:
  - `node.level = "L3"`
  - correlation keys (`id`, `ref`) for retransmit-safe operation

## Typical L3 Payloads
```json
{"v":"2.0","id":"gps-01","kind":"telemetry","metric":"gps","value":{"lat":12.34,"lon":56.78}}
{"v":"2.0","id":"cmd-01","kind":"command","action":"WRITE","target":"RELAY1","value":0}
{"v":"2.0","id":"ack-01","kind":"ack","ok":true,"ref":"cmd-01"}
```

## Reliability Expectations
- State machine should handle transitions between data, SMS fallback, and sleep.
- Buffered messages should retain `id` for dedupe and audit.

## Verification Checklist
- [ ] Data/SMS mode transitions preserve command semantics
- [ ] GPS telemetry serializes to valid ASP telemetry frames
- [ ] Heartbeat + fail-safe behavior is deterministic under high latency
