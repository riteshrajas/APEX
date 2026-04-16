# Master Plan: Independent AI Module Ownership

**Objective:** Execute the expansion of the APEX ecosystem through independent, modular projects. Each AI agent is assigned a dedicated repository/module to own from research to PR, ensuring zero overlap and clean, isolated contributions.

---

## 1. Module Assignment & Ownership

| AI Agent | Module Ownership | Core Responsibility | Output |
| :--- | :--- | :--- | :--- |
| **Google Jules** | **MicroMax OS (L1)** | Refactor firmware for universal board support (AVR, RP2040, STM32). Implement deterministic fail-safes and unit tests. | PR to `APEX-MicroMax` |
| **Copilot CLI** | **MiniMax OS (L2)** | Implement complete WiFi/MQTT stack for ESP32/Pico W. Add ambient telemetry and visual sentry (ESP32-CAM) logic. | PR to `APEX-MiniMax` |
| **Codex CLI** | **MegaMax OS (L3)** | Implement global cellular stack using TinyGSM. Handle LTE data sockets, SMS fallbacks, and GPS geolocation. | PR to `APEX-MegaMax` |
| **Gemini CLI (Me)** | **Apex Horizon (Hub)** | Build the Universal PWA. Implement Serial, MQTT, and Cloud transport adapters. Wire "Brain" inference HUD. | PR to `Core/Horizon` |
| **Copilot Cloud** | **Protocol & Docs** | Formalize **ASP v2.0 Protocol Specification**. Generate exhaustive setup guides and API references for all levels. | PR to `APEX` (Root) |

---

## 2. Research Mandates (Individually Executed)

Each agent MUST perform its own research phase before touching code.

### **Sprint A: MicroMax Refactoring (Google Jules)**
- **Focus:** Hardware Abstraction Layer (HAL). How to make one code base run on ATmega328P, RP2040, and STM32 without `#ifdef` mess.
- **Goal:** Portability and Reliability.

### **Sprint B: MiniMax WiFi Stack (Copilot CLI)**
- **Focus:** Robust WiFi reconnection and MQTT state management. Research ESP32-CAM frame capture for low-bandwidth streaming.
- **Goal:** Ambient Intelligence.

### **Sprint C: MegaMax Cellular Stack (Codex CLI)**
- **Focus:** SIM7000G/SIM800L power management. How to handle intermittent cellular connectivity and low-power sleep cycles.
- **Goal:** Global Reach.

### **Sprint D: Horizon Universal Hub (Gemini CLI)**
- **Focus:** Multi-transport architecture in PWAs. Research Web Serial (L1), MQTT.js (L2), and WebSockets (L3) concurrency.
- **Goal:** Unified Orchestration.

---

## 3. Workflow Protocol

1. **Isolation:** Agents work only in their assigned directories/submodules.
2. **Research First:** First turn of implementation must be a documented research summary in the module's `README.md` or a new `RESEARCH.md`.
3. **Independent PRs:** Each agent will announce when their module is ready for a PR review.
