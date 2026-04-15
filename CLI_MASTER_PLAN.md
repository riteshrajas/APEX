# CLI Master Plan — RAM (Realtime Action Model) + CLI Integration

## Scope
This plan is **CLI-only** (no hardware/IoT concerns). The goal is to deeply integrate:

- **CLI**: deterministic command interface and workflows.
- **RAM**: realtime conversational action AI (intent → action execution).

Success means RAM and CLI can trigger each other in real time:
1. RAM can execute CLI commands safely.
2. CLI can ask RAM for reasoning, plans, and live conversational control.

---

## North-Star Architecture

### Layer A — Command Surface (CLI)
- Stable command contracts (`ram ask`, `ram act`, `ram watch`, `ram sync`).
- Human mode (interactive) + machine mode (`--json` structured output).
- Idempotent command behavior with exit codes and error envelopes.

### Layer B — RAM Runtime
- Streaming conversation engine with tool-calling.
- Context/state manager (session memory, intent history, action history).
- Policy + guardrail engine (allow/deny/confirm/escalate).

### Layer C — Integration Bus
- Bidirectional event stream:
  - RAM → CLI events: `intent.detected`, `action.requested`, `action.confirmed`.
  - CLI → RAM events: `command.started`, `command.completed`, `command.failed`.
- Shared schema for actions, results, and confidence.

### Layer D — Reliability & Ops
- Telemetry: latency, success rates, fallback rate, user overrides.
- Replayable action logs.
- Rate limits, retries, and dead-letter queue for failed actions.

---

## Core Capabilities to Build

1. **Realtime Intent-to-Command Bridge**
   - RAM parses natural language into typed CLI intents.
   - CLI executes only schema-valid actions.

2. **CLI-to-RAM Reflection**
   - Every CLI action posts a structured summary back to RAM.
   - RAM updates conversation context with execution outcomes.

3. **Session Sync ("RAM open + sync")**
   - `ram sync start`: create/attach a shared session.
   - `ram sync state`: reconcile pending actions and context snapshots.
   - `ram sync stop`: cleanly close handoff state.

4. **Action Safety Model**
   - Risk tiers: low (auto), medium (confirm), high (hard confirmation).
   - Deterministic policy gates before execution.

5. **Streaming UX**
   - Token streaming responses.
   - Live status line for action lifecycle (`planned → running → done/failed`).

---

## 90-Day CLI Execution Plan

### Phase 1 (Weeks 1–3): Contracts + Core Plumbing
- Define command/action schema (JSON schema for all RAM↔CLI actions).
- Add a session manager (`session_id`, timestamps, state version).
- Add structured event logger and correlation IDs.

**Deliverable:** RAM and CLI can share a session and exchange typed events.

### Phase 2 (Weeks 4–6): Realtime Bidirectional Sync
- Implement streaming channel (stdin/stdout streaming + optional local socket).
- Build RAM intent parser to produce executable CLI action plans.
- Send CLI execution outcomes back into RAM context in real time.

**Deliverable:** RAM asks, CLI acts, RAM narrates outcome continuously.

### Phase 3 (Weeks 7–9): Safety, Recovery, and Quality
- Policy engine with risk tiers + confirmation workflows.
- Retry/fallback system + action replay.
- Confidence-based clarification prompts.

**Deliverable:** predictable behavior with guardrails and clean recovery paths.

### Phase 4 (Weeks 10–12): UX + Performance Hardening
- Interactive TUI mode (`ram chat`) with streaming + action timeline.
- p95 latency tuning for intent→action.
- Add comprehensive integration test matrix.

**Deliverable:** production-ready conversational CLI control experience.

---

## Suggested CLI Command Set

```bash
ram chat                        # interactive realtime conversation
ram ask "what should I do?"      # reasoning-only response
ram act "open browser"            # plan + execute action
ram sync start                  # open/attach shared RAM-CLI session
ram sync state                  # print current synced state
ram sync stop                   # close session
ram events tail                 # live event stream
```

---

## Data Contracts (Minimum)

### Intent Envelope
- `session_id`
- `intent_id`
- `user_text`
- `action_candidates[]`
- `confidence`
- `risk_tier`

### Action Result Envelope
- `session_id`
- `intent_id`
- `action_id`
- `status` (`started|completed|failed|cancelled`)
- `stdout_summary`
- `error_code`
- `duration_ms`

---

## KPIs
- p95 intent→action-start latency.
- Action success rate by risk tier.
- Confirmation accuracy (how often user reverses an approved action).
- Conversation continuity score (context preserved across turns).
- Recovery success rate after failed actions.

---

## Definition of Done (CLI + RAM)
A CLI+RAM release is successful when:
1. Conversation and command execution stay in sync in one shared session.
2. All actions are traceable with correlation IDs.
3. Medium/high-risk actions always honor policy gates.
4. Users can interrupt, correct, and resume naturally without context loss.
