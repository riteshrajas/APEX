# Apex Serial Protocol (ASP) v2.0 Specification

## 1) Purpose
ASP v2.0 defines a transport-agnostic JSON message contract for APEX nodes.

- L1 (MicroMax): USB Serial
- L2 (MiniMax): WiFi/MQTT bridge
- L3 (MegaMax): Cellular data + SMS fallback bridge

ASP v2.0 is **backward-compatible** with existing minimal JSON messages already documented in APEX.

## 2) Transport and Framing

### 2.1 Serial (L1 baseline)
- Encoding: UTF-8 JSON
- Framing: one JSON object per line (`\n` terminated)
- Default line speed: `115200 8-N-1`

### 2.2 Networked transports (L2/L3)
- Payload schema stays identical to serial JSON.
- Framing is delegated to transport (MQTT/WebSocket/TCP message boundaries).

## 3) Message Model

### 3.1 Minimal backward-compatible forms (valid)
```json
{"action":"WRITE","target":"D13","value":1}
{"event":"TRIGGER","source":"D2","type":"Interrupt"}
{"query":"WHO_ARE_YOU"}
```

### 3.2 Preferred v2 envelope (recommended)
```json
{
  "v": "2.0",
  "id": "a7c6f5f0-1b6f-4a3f-bbe8-7f8c20f1b4ef",
  "ts": "2026-04-16T00:00:00Z",
  "node": {"level":"L1","id":"micromax-uno-01"},
  "kind": "command"
}
```

## 4) Field Definitions

### 4.1 Core optional envelope fields
- `v` (string): protocol version, recommended `"2.0"`.
- `id` (string): message correlation id.
- `ts` (string): ISO-8601 UTC timestamp.
- `node` (object): node identity metadata.
  - `node.level`: `L1` | `L2` | `L3`
  - `node.id`: unique node identifier
- `kind` (string): `command` | `query` | `event` | `telemetry` | `ack` | `error`

### 4.2 Existing operational fields (must remain supported)
- Command fields: `action`, `target`, `value`
- Query fields: `query`
- Event fields: `event`, `source`, `type`

### 4.3 Ack/Error fields (v2 standardization)
- Ack:
  - `kind: "ack"`
  - `ok: true|false`
  - `ref`: request `id` being acknowledged
- Error:
  - `kind: "error"`
  - `code`: stable machine code (e.g., `ERR_UNKNOWN_ACTION`)
  - `message`: human-readable description
  - `ref`: originating request id when available

## 5) Canonical Message Examples

### 5.1 Command (write output)
```json
{"v":"2.0","id":"cmd-001","kind":"command","action":"WRITE","target":"D13","value":1}
```

### 5.2 Query (heartbeat/identity)
```json
{"v":"2.0","id":"hb-001","kind":"query","query":"WHO_ARE_YOU"}
```

### 5.3 Event (edge trigger)
```json
{"v":"2.0","id":"evt-001","kind":"event","event":"TRIGGER","source":"D2","type":"Interrupt"}
```

### 5.4 Telemetry
```json
{"v":"2.0","id":"tel-001","kind":"telemetry","source":"A0","metric":"light","value":512,"unit":"raw"}
```

### 5.5 Ack
```json
{"v":"2.0","id":"ack-001","kind":"ack","ok":true,"ref":"cmd-001"}
```

### 5.6 Error
```json
{"v":"2.0","id":"err-001","kind":"error","code":"ERR_INVALID_TARGET","message":"Unknown target pin","ref":"cmd-001"}
```

## 6) Validation Rules
- Payload MUST be valid JSON object.
- Unknown top-level keys MAY be ignored unless strict mode is enabled.
- Receivers MUST validate type/shape for recognized keys.
- `action`, `query`, `event` values SHOULD be treated case-sensitive.
- `id` values SHOULD be unique per sender session.
- Numeric `value` fields SHOULD be range-checked by target type.

## 7) Fail-Safe and Heartbeat Semantics
- Host heartbeat uses `query: "WHO_ARE_YOU"` or a node-defined heartbeat query.
- Nodes SHOULD define heartbeat timeout behavior.
- On timeout/disconnect, nodes controlling actuators SHOULD revert to safe state and emit an `event` or `error` frame when possible.

## 8) Security Notes
- Validate all incoming JSON keys and value types.
- Never execute unsanitized command strings from protocol payloads.
- For untrusted networks, use authenticated/encrypted transport wrappers for ASP payloads.

## 9) Versioning and Compatibility
- ASP v2.0 is additive over legacy minimal frames.
- Breaking changes require a new major version field (`v`).
- Extensions SHOULD prefer new optional keys over mutating existing meanings.
