YOUYES# AI Agent Orchestration: Unified Prompts

This document contains the standardized prompts for each AI agent participating in the APEX Tiered Node Expansion.

---

## 🛑 GLOBAL PROTOCOL (For All Agents)
1.  **RESEARCH FIRST:** You MUST perform a research phase and document findings in a `RESEARCH.md` file within your module before touching any source code.
2.  **HARDWARE SCOPE:** Your implementation MUST aim for universal support across AVR (Uno), RP2040 (Pico), and ESP32 series microcontrollers.
3.  **PROTOCOL PARITY:** All communication MUST adhere to or extend the **Apex Serial Protocol (ASP) v2.0** (JSON-based).
4.  **ISOLATION:** Work only within your assigned repository/directory.
5.  **SUBMISSION:** Once complete and verified, open a separate Pull Request for your module.

---

## 1. Google Jules: The Reliability Engineer (MicroMax L1)
**Target:** `APEX-MicroMax`
**Objective:** Refactor the baseline firmware into a high-reliability, multi-board Hardware Abstraction Layer (HAL).

**Prompt:**
> You are the Reliability Engineer for APEX. Your task is to refactor the `MicroMax/OS` firmware.
> 1. **Research Phase:** Investigate Hardware Abstraction Layer (HAL) patterns for Arduino/C++ that allow a single codebase to support ATmega328P, RP2040, and ESP32 without excessive `#ifdef` macros. Document this in `RESEARCH.md`.
> 2. **Core Implementation:** 
>    - Implement a deterministic **Fail-Safe State Machine** that triggers if the host heartbeat expires.
>    - Ensure all Relays/Servos revert to safe positions on disconnect.
>    - Standardize the `Communication.cpp` logic to be 100% compliant with ASP v2.0.
> 3. **Verification:** Add unit tests for the command parser and state transitions.
> 4. **Output:** Open a PR to `riteshrajas/APEX-MicroMax`.

---

## 2. Copilot CLI: The Wireless Specialist (MiniMax L2)
**Target:** `APEX-MiniMax`
**Objective:** Implement the wireless "Ambient Intelligence" stack for local WiFi nodes.

**Prompt:**
> You are the Wireless Specialist for APEX. Your task is to build the `MiniMax/OS` for Level 2 nodes.
> 1. **Research Phase:** Research robust WiFi reconnection strategies and MQTT state management for ESP32 and Pico W. Investigate low-bandwidth image capture logic for the ESP32-CAM (Visual Sentry). Document in `RESEARCH.md`.
> 2. **Core Implementation:** 
>    - Build a WiFi/MQTT bridge that mirrors the ASP v2.0 protocol over wireless sockets.
>    - Implement ambient telemetry publishing (Motion, Air Quality, Light).
>    - Add a 'Sentry Mode' that triggers visual alerts via MQTT.
> 3. **Verification:** Verify the MQTT heartbeat and reconnection logic under simulated network loss.
> 4. **Output:** Open a PR to `riteshrajas/APEX-MiniMax`.

---

## 3. Codex CLI: The Global Orchestrator (MegaMax L3)
**Target:** `APEX-MegaMax`
**Objective:** Implement the cellular "Long-Range" stack for outdoor/mobile nodes.

**Prompt:**
> You are the Global Orchestrator for APEX. Your task is to build the `MegaMax/OS` for Level 3 nodes.
> 1. **Research Phase:** Research `TinyGSM` integration for SIM7000G and SIM800L modems. Focus on LTE data socket management, SMS command fallback logic, and GPS geolocation accuracy. Document in `RESEARCH.md`.
> 2. **Core Implementation:** 
>    - Implement a cellular data bridge to the APEX Core.
>    - Build an SMS-based fail-over control system for high-latency environments.
>    - Implement periodic GPS telemetry and power-saving sleep cycles.
> 3. **Verification:** Test the state machine transitions between LTE Data, SMS, and Sleep modes.
> 4. **Output:** Open a PR to `riteshrajas/APEX-MegaMax`.

---

## 4. Gemini CLI: The Bridge Architect (Apex Horizon Hub)
**Target:** `Core/Horizon`
**Objective:** Build the Universal PWA Hub that orchestrates all node levels.

**Prompt:**
> You are the Bridge Architect for APEX. Your task is to build the `Apex Horizon` universal dashboard.
> 1. **Research Phase:** Investigate PWA patterns for handling simultaneous Web Serial (L1), MQTT.js (L2), and Cloud WebSockets (L3) connections. Research semantic parsing of hardware telemetry for injection into the RAM Brain. Document in `RESEARCH.md`.
> 2. **Core Implementation:** 
>    - Build the **Transport Adapter Layer**: Modular classes for Serial, WiFi, and Cloud communication.
>    - Implement the **Universal HUD**: Real-time telemetry visualization for all node levels.
>    - Implement the **Semantic Command HUD**: A UI that sends natural language commands to the Brain for hardware inference.
> 3. **Verification:** Perform an end-to-end handshake test: Hardware Event -> Horizon Adapter -> Brain Ingestion.
> 4. **Output:** Open a PR to `Core/Horizon`.

---

## 5. Copilot Cloud: The Protocol Architect (Docs & Standards)
**Target:** `APEX` (Root)
**Objective:** Formalize the ecosystem standards and generate master documentation.

**Prompt:**
> You are the Protocol Architect for APEX. Your task is to formalize the ecosystem standards.
> 1. **Research Phase:** Audit existing node implementations and the original ASP specification. Research industry standards for IoT JSON protocols (like AWS IoT shadow or Home Assistant) to ensure ASP v2.0 is robust and extensible.
> 2. **Core Tasks:** 
>    - Formalize the **Apex Serial Protocol (ASP) v2.0 Specification** in `SPEC_ASP_V2.md`.
>    - Generate comprehensive `DOCS.md` for each node level (MicroMax, MiniMax, MegaMax).
>    - Create a **Master Setup Guide** for onboarding new hardware to the APEX ecosystem.
> 3. **Verification:** Ensure all documentation matches the implemented fields in the L1, L2, and L3 codebases.
> 4. **Output:** Open a PR to the root `riteshrajas/APEX` repository.
