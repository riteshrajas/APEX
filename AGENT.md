# 🤖 APEX Agent Capabilities

This document outlines the AI and agentic capabilities built into the APEX Core/CLI layer. APEX operates not just as a command-line tool, but as a fully autonomous orchestration engine.

## Core Agent Architecture

APEX leverages an advanced orchestration layer built on top of multiple AI providers. It uses **TypeScript** and **React (Ink)** to provide a seamless terminal-based conversational interface, while managing complex background tasks.

### Supported AI Providers
- **Anthropic (Claude)**: Primary reasoning engine.
- **AWS Bedrock**: Enterprise scaling and alternate model access.
- **Google Vertex AI**: Advanced multimodal and high-context reasoning.

## Sub-Agents and Roles
APEX uses specialized sub-agents and flags to handle different task scopes:
- `VERIFICATION_AGENT`: Specialized in verifying tasks, managing todos, and ensuring completion criteria are met before returning control.
- `BUILTIN_EXPLORE_PLAN_AGENTS`: Dedicated planners that map out large-scale changes before execution.
- `BASH_CLASSIFIER`: A specialized classifier agent that evaluates the safety and intent of bash commands before they are executed in auto-mode.

## Model Context Protocol (MCP) Integration
APEX heavily utilizes the **Model Context Protocol (MCP)** to securely and standardly interact with the host system and external services.
- **`CHICAGO_MCP`**: Enables computer-use MCP integration, allowing the agent to control the desktop environment, capture terminal output, and manage files.
- **`MCP_RICH_OUTPUT`**: Renders complex MCP tool responses natively in the Ink terminal UI.
- **Skill Builders**: APEX can dynamically load external MCP servers and expose them as tools to the core agent.

## Memory and Context Management
To maintain long-term coherence across sessions, APEX employs a multi-tiered memory system:
- **`AGENT_MEMORY_SNAPSHOT`**: Dumps and restores the internal state of custom agents.
- **`CACHED_MICROCOMPACT`**: Uses semantic caching and micro-compaction to keep context windows lean while retaining critical facts.
- **`TEAMMEM`**: Supports shared "team memory" files across different agent instances or collaborative environments.
- **`EXTRACT_MEMORIES`**: Post-query hooks automatically extract facts and user preferences from conversations and persist them.

## Execution Modes
- **Interactive REPL**: The default mode, offering a chat interface with a prompt history picker (`HISTORY_PICKER`).
- **`VOICE_MODE`**: Enables push-to-talk interactions, dictation, and voice synthesis.
- **`ULTRAPLAN` & `ULTRATHINK`**: High-depth reasoning modes where the agent generates detailed step-by-step roadmaps before writing any code.
- **`POWERSHELL_AUTO_MODE`**: Allows the agent to autonomously execute sequences of PowerShell commands without manual confirmation for each step (guarded by the Bash Classifier).
- **`AWAY_SUMMARY`**: Automatically summarizes activities and notifications that occurred while the user was away from the keyboard.

## Remote and Bridge Capabilities
APEX can act as a localized brain for distributed systems:
- **`BRIDGE_MODE`**: Allows remote control and REPL bridging across different machines.
- **`CCR_MIRROR` & `CCR_AUTO_CONNECT`**: Outbound and inbound connection routing for distributed agent clusters.
