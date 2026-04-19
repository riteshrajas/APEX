# Specification: APEX Abstract Language (AAL)

## Overview
Develop the "APEX Abstract Language" (AAL), a high-level, token-efficient, and declarative programming language designed specifically for LLM-driven orchestration of AI agents and IoT devices. AAL aims to bridge the gap between natural language intent and low-level execution (ASP, C++, TS) while being 200x easier for LLMs to parse and generate. It will integrate with the Horizon Digital Twin for real-time visualization as a Node-based Graph.

## Functional Requirements
- **Language Specification:** Define a minimalist, Pythonic-but-declarative syntax (e.g., `DEFINE AGENT`, `CONNECT TO`, `EXECUTE ON`).
- **Token Optimization:** Ensure the language uses minimal tokens to describe complex agentic and physical behaviors.
- **Horizon Integration:** Define how AAL maps to the Horizon Digital Twin for node-graph visualization.
- **Interpreter Prototype:** Create a basic interpreter that translates AAL into actionable JSON/ASP commands for the Horizon environment.
- **Agent/IoT Primitives:** Include built-in keywords for common agent actions (Reason, Notify, Delegate) and IoT operations (Move, Sense, Trigger).

## Non-Functional Requirements
- **LLM-Friendliness:** Syntax must be highly predictable to minimize hallucinations.
- **Visualizability:** Every AAL construct must have a direct mapping to a node or edge in a graph.
- **Local-First:** The interpreter must run locally using Bun/Node.js.

## Acceptance Criteria
- A formal grammar/specification for AAL is documented.
- A basic interpreter can parse an AAL script and output a valid configuration for Horizon.
- The Horizon dashboard can visualize an AAL script as a Node-based Graph.
- A "Hello World" agentic flow (e.g., "If sensor triggers, agent notifies") can be written in <10 lines of AAL.

## Out of Scope
- Direct firmware generation for MegaMax/MicroMax (will target the Digital Twin first).
- Full ElevenLabs voice integration for language generation (focus on textual AAL first).
- Multi-user collaboration on the node graph.
