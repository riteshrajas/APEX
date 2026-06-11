# AGENT.md - APEX Agent Notes

This guide gives future coding agents a quick orientation for the APEX workspace. For mandatory repository rules, follow [AGENTS.md](./AGENTS.md).

## Fast Startup

1. Check branch and worktree state:
   ```bash
   git status --short
   ```
2. Inspect submodule state:
   ```bash
   git submodule status --recursive
   ```
3. If submodules are missing, initialize them from a network-enabled environment:
   ```bash
   git submodule update --init --recursive
   ```

## Repository Map

- Root docs and project context:
  - [README.md](./README.md)
  - [ARCHITECTURE.md](./ARCHITECTURE.md)
  - [SPEC_ASP_V2.md](./SPEC_ASP_V2.md)
  - [ROADMAP.md](./ROADMAP.md)
  - [MASTER_SETUP_GUIDE.md](./MASTER_SETUP_GUIDE.md)
- Core software stack:
  - [Core/README.md](./Core/README.md)
  - [Core/CLI/README.md](./Core/CLI/README.md)
  - [Core/CLI/FEATURES.md](./Core/CLI/FEATURES.md)
  - [Core/RAM/README.md](./Core/RAM/README.md)
- Hardware and node docs:
  - [MicroMax/README.md](./MicroMax/README.md)
  - [MiniMax/README.md](./MiniMax/README.md)
  - [MegaMax/README.md](./MegaMax/README.md)
  - [docs/MicroMax/DOCS.md](./docs/MicroMax/DOCS.md)
  - [docs/MiniMax/DOCS.md](./docs/MiniMax/DOCS.md)
  - [docs/MegaMax/DOCS.md](./docs/MegaMax/DOCS.md)
- Planning layer:
  - [conductor/README.md](./conductor/README.md)
  - [conductor/index.md](./conductor/index.md)
  - [conductor/tracks.md](./conductor/tracks.md)

## Core/CLI Notes

Core/CLI is the terminal-first AI runtime. Start with:

- Query lifecycle: [Core/CLI/src/QueryEngine.ts](./Core/CLI/src/QueryEngine.ts)
- Slash command registry: [Core/CLI/src/commands.ts](./Core/CLI/src/commands.ts)
- Tool registry: [Core/CLI/src/tools.ts](./Core/CLI/src/tools.ts)
- Runtime dependencies and scripts: [Core/CLI/package.json](./Core/CLI/package.json)

Useful feature areas include model/provider routing, tool execution, slash commands, session state, MCP integration, and task orchestration flags documented in [Core/CLI/FEATURES.md](./Core/CLI/FEATURES.md).

## Core/RAM Notes

Core/RAM is the realtime dashboard and memory interface. Start with:

- App page shell: [Core/RAM/src/app/page.tsx](./Core/RAM/src/app/page.tsx)
- Voice UX and session handling: [Core/RAM/src/components/VoiceAgent.tsx](./Core/RAM/src/components/VoiceAgent.tsx)
- Server actions: [Core/RAM/src/app/actions.ts](./Core/RAM/src/app/actions.ts)
- Knowledge-base loader: [Core/RAM/src/lib/knowledge-base.ts](./Core/RAM/src/lib/knowledge-base.ts)

The practical integration model is: RAM captures user intent, maps it to typed CLI actions, CLI executes the work, and RAM reflects the result back into the conversation and dashboard state.

## Working Priorities

- For software tasks, check Core/CLI and Core/RAM first.
- For hardware behavior or protocol changes, check MicroMax and update [SPEC_ASP_V2.md](./SPEC_ASP_V2.md) when message semantics change.
- For planning or workflow changes, update the relevant conductor docs instead of creating new root-level planning files.
