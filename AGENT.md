# AGENT.md — APEX Repository Exploration Notes

This guide is for future coding agents working in this repo. It summarizes how the parent project and submodules are organized, with emphasis on **Core/CLI** and **Core/RAM**.

## 1) Fast Startup Instructions (for agents)

1. From repo root, check branch and cleanliness:
   ```bash
   git status
   ```
2. Initialize submodules:
   ```bash
   git submodule update --init --recursive
   ```
3. If a submodule worktree appears empty or all files show as deleted, rehydrate it:
   ```bash
   git -C Core reset --hard HEAD
   ```
4. Verify submodule SHAs:
   ```bash
   git submodule status --recursive
   ```

### If submodule clone fails (auth/network)
- Current submodule URLs are HTTPS GitHub remotes in [`.gitmodules`](.gitmodules).
- If you see auth errors, use one of:
  - GitHub token/credential helper for HTTPS,
  - switch to SSH remotes,
  - or ask the maintainer to initialize submodules and commit updated gitlinks.

---

## 2) Repository Map (high-level)

- Parent repo docs and planning:
  - [README.md](README.md)
  - [MASTER_PLAN.md](MASTER_PLAN.md)
  - [CLI_MASTER_PLAN.md](CLI_MASTER_PLAN.md)
  - [AGENT.md](AGENT.md)
- Submodules:
  - `Core` (**primary software stack**) 
  - `MicroMax` (hardware/PCB-oriented; usually lower priority for software deep dives)

---

## 3) Core Submodule — What matters most

### Core/CLI (main product-grade CLI)
Key docs:
- [Core/CLI/README.md](Core/CLI/README.md)
- [Core/CLI/APEX.md](Core/CLI/APEX.md)
- [Core/CLI/CLAUDE.md](Core/CLI/CLAUDE.md)
- [Core/CLI/FEATURES.md](Core/CLI/FEATURES.md)

Key technical entrypoints:
- Query lifecycle: [`Core/CLI/src/QueryEngine.ts`](Core/CLI/src/QueryEngine.ts)
- Slash command registry: [`Core/CLI/src/commands.ts`](Core/CLI/src/commands.ts)
- Tool registry: [`Core/CLI/src/tools.ts`](Core/CLI/src/tools.ts)
- Build/dev scripts and runtime deps: [`Core/CLI/package.json`](Core/CLI/package.json)

#### CLI architecture summary
- **Large Bun + TypeScript terminal app** with many commands/tools and feature flags.
- `QueryEngine` coordinates prompt → tool use → model response lifecycle and session state.
- `commands.ts` aggregates a broad slash-command surface.
- `tools.ts` defines available toolchain (filesystem, shell, web, task, planning, etc.), with many feature-gated modules.
- Build pipeline uses Bun scripts and compile-time feature flags.

### Core/RAM (realtime conversation/action AI front-end)
Key docs:
- [Core/RAM/README.md](Core/RAM/README.md)
- [Core/RAM/AGENTS.md](Core/RAM/AGENTS.md)
- [Core/RAM/CLAUDE.md](Core/RAM/CLAUDE.md)

Key technical files:
- App page shell: [`Core/RAM/src/app/page.tsx`](Core/RAM/src/app/page.tsx)
- Voice UX and session handling: [`Core/RAM/src/components/VoiceAgent.tsx`](Core/RAM/src/components/VoiceAgent.tsx)
- Server action for prompt injection: [`Core/RAM/src/app/actions.ts`](Core/RAM/src/app/actions.ts)
- Knowledge-base loader/prompt composer: [`Core/RAM/src/lib/knowledge-base.ts`](Core/RAM/src/lib/knowledge-base.ts)

#### RAM architecture summary
- **Next.js app** with ElevenLabs conversation SDK.
- UI starts/stops a voice session, handles connection states, and supports debug/status logs.
- RAM can inject personalized context by reading structured local knowledge-base files.
- The personalization layer is currently prompt-injection based (JSON profile/skills/goals/preferences → system context text).

---

## 4) How CLI and RAM fit together (practical mental model)

- **Core/CLI** = execution/control surface (commands, tools, filesystem/shell operations).
- **Core/RAM** = conversational realtime interface (voice + contextual memory injection).
- Integration path should be event-driven:
  1. RAM captures intent,
  2. intent maps to typed CLI action envelopes,
  3. CLI executes + returns structured results,
  4. RAM updates conversation context and narrates outcomes.

Cross-reference roadmap:
- [CLI_MASTER_PLAN.md](CLI_MASTER_PLAN.md)

---

## 5) Notes on MicroMax

- MicroMax is present as a submodule but is generally PCB/hardware-centric in this repo context.
- For most software agent tasks, prioritize **Core/CLI** + **Core/RAM** first, then only scan MicroMax if hardware integration constraints are explicitly needed.

---

## 6) Suggested first commands for a new agent session

```bash
git status
git submodule update --init --recursive
git submodule status --recursive
```

Then read in this order:
1. [README.md](README.md)
2. [CLI_MASTER_PLAN.md](CLI_MASTER_PLAN.md)
3. [Core/CLI/APEX.md](Core/CLI/APEX.md)
4. [Core/CLI/FEATURES.md](Core/CLI/FEATURES.md)
5. [Core/RAM/README.md](Core/RAM/README.md)
6. [Core/RAM/AGENTS.md](Core/RAM/AGENTS.md)
