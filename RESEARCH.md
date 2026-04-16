# RESEARCH: ASP v2.0 + Node Documentation Audit

## Scope
- Module: root `APEX` repository (Protocol Architect task)
- Goal: produce canonical protocol and setup documentation for L1/L2/L3 nodes

## Repository Audit Findings
1. The primary in-repo ASP references are in:
   - `/home/runner/work/APEX/APEX/ARCHITECTURE.md`
   - `/home/runner/work/APEX/APEX/AI_PROMPTS.md`
   - `/home/runner/work/APEX/APEX/MicroMax/README.md`
2. Current documented baseline for ASP:
   - JSON messages
   - newline-terminated framing on serial links
   - 115200 baud (8-N-1) for MicroMax serial transport
   - canonical example fields in active use:
     - Command path: `action`, `target`, `value`
     - Event path: `event`, `source`, `type`
     - Heartbeat/query path: `query` (example `WHO_ARE_YOU`)
3. L1/L2/L3 submodules currently expose high-level module READMEs and capabilities, but no root-level unified formal spec file yet.

## Industry Pattern Research (Applied Principles)
Because external docs were not reachable from this sandbox at runtime, this phase applies stable, widely adopted IoT protocol patterns used across systems such as device shadows and MQTT-first home automation stacks:
- Keep a backward-compatible minimal payload path.
- Add optional metadata envelope fields for extensibility (`v`, `id`, timestamps, node identity).
- Separate message intent (`command`, `query`, `event`, `telemetry`, `ack`, `error`) to simplify routing.
- Standardize correlation (`id`/`ref`) for request/ack tracing.
- Define transport-agnostic payload semantics so Serial, MQTT, WebSocket, and cellular links can mirror the same JSON contract.

## Design Decisions for Documentation Output
1. Define **ASP v2.0** as an additive superset: existing simple messages remain valid.
2. Provide one canonical spec file (`SPEC_ASP_V2.md`) with:
   - wire framing
   - required vs optional keys
   - validation and security rules
   - examples for command/event/heartbeat/ack/error/telemetry
3. Provide per-level docs (`DOCS.md`) for:
   - MicroMax (L1 wired)
   - MiniMax (L2 wireless MQTT bridge)
   - MegaMax (L3 cellular bridge)
4. Provide one onboarding runbook (`MASTER_SETUP_GUIDE.md`) covering:
   - hardware bring-up
   - transport mapping
   - protocol conformance checks
   - fail-safe expectations
