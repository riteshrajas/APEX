# Specification: Refine Realtime Agent Mode Orchestration and MCP Tooling Integration

## Overview
This track focuses on maturing the Realtime Agent Mode (RAM) within the APEX ecosystem. The goal is to move from a single-agent pass-through to a robust, multi-agent orchestrator that leverages the Model Context Protocol (MCP) and local system tools for proactive and autonomous operations.

## Goals
- **Multi-Agent Orchestration:** Implement the logic for the "Master Agent" (Jarvis) to delegate tasks to specialized "Worker Agents."
- **MCP Tooling Maturity:** Fully integrate MCP tools into the RAM voice interface, allowing the agent to use them fluidly during conversation.
- **System Awareness:** Enhance the agent's ability to proactively monitor and report on the status of `IOT` and `MicroMax` components.
- **Reliable Automation:** Ensure all actions (like "Neural Sync") are automated and robust.

## Technical Requirements
- **Master-Worker Logic:** Define a protocol for the Master Agent to identify sub-tasks and initiate worker processes.
- **Tool Mapping:** Ensure all server actions in `actions.ts` are correctly mapped to the ElevenLabs SDK `clientTools`.
- **Proactive Hooks:** Implement hooks that allow the system to trigger agent speech based on external events (e.g., file changes or hardware alerts).
- **TypeScript Safety:** Refactor the knowledge base and tool interfaces for strict type safety.

## Success Criteria
- The agent automatically syncs context upon connection without user intervention.
- The agent can successfully execute a CLI command (e.g., `npm test`) and report the result via voice.
- The agent can "deploy" a mock sub-agent and explain its purpose.
- The system prompt effectively drives a "Jarvis-like" persona with high technical precision.
