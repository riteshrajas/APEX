# APEX Feature Opportunities Roadmap

This roadmap outlines the strategic feature opportunities for the APEX (Autonomous Physical-Digital Ecosystem) repository. The features are organized by module, with complexity, strategic fit, and phased rollouts detailed to guide both core maintainers and the community.

---

## 1. Core/CLI (Terminal Agent Engine)
The core orchestration brain bridging digital commands to physical actions.

### Feature Opportunities
*   **Persistent Offline Operations Engine:** Enable the CLI to queue, route, and execute tasks using local, small-parameter models (like LLaMA 3 via Ollama) when disconnected from the cloud.
*   **Advanced Tooling & MCP Integration:** Native integration with a wider ecosystem of MCP (Model Context Protocol) plugins for extending capabilities into cloud services, local databases, and IDEs.
*   **Voice Interface Enhancement:** Improve the `/voice` command to feature streaming STT (Speech-to-Text) and TTS (Text-to-Speech) with interruptibility for a fluid conversational experience.
*   **Granular Memory Management:** Expose commands for the user to query, edit, and compress historical agent memories directly from the terminal.

*   **Complexity:** High (Requires deep LLM orchestration and streaming data management)
*   **Strategic Fit:** Critical. The CLI is the central intelligence of APEX. Better autonomy and tool use directly translate to a more capable system.

---

## 2. Core/RAM (Web Dashboard & Knowledge Base)
The visual UI and persistent memory interface.

### Feature Opportunities
*   **Real-time Agent Telemetry Dashboard:** WebSocket-based live streaming of the CLI agent's thought process, current tasks, and physical hardware status in a unified control center.
*   **Interactive Memory Graph:** A visual, navigable 3D or 2D node-graph representing the knowledge base and agent's episodic memories, allowing for easy exploration of past context.
*   **Workflow Builder GUI:** A visual node-based editor for defining new APEX capabilities and complex multi-step workflows without writing code.
*   **Multi-Agent Coordination View:** If multiple CLIs are running, a centralized view to monitor agent collaboration and resource allocation.

*   **Complexity:** Medium
*   **Strategic Fit:** High. A rich dashboard lowers the barrier to entry and provides essential observability into the otherwise black-box reasoning of the AI.

---

## 3. MicroMax/OS (Hardware Firmware)
The low-level C++ layer handling deterministic execution.

### Feature Opportunities
*   **Over-The-Air (OTA) Updates:** Ability to flash new firmware to the RP2040 and network-connected targets over Wi-Fi/Bluetooth without requiring USB CDC.
*   **Expanded Sensor Protocol Library:** Pre-built drivers and ASP (Apex Serial Protocol) extensions for I2C and SPI peripherals (e.g., IMUs, environmental sensors, motor drivers).
*   **Advanced Fail-Safe State Machine:** Autonomous local decision-making on the hardware level to revert to a safe state if the CLI connection drops for a specified heartbeat threshold.
*   **Real-time Control Loops:** Moving PID controllers and closed-loop motor control directly onto the MCU to reduce latency and dependence on the CLI for high-frequency adjustments.

*   **Complexity:** High (Embedded constraints, safety requirements)
*   **Strategic Fit:** High. Robust hardware execution is the core differentiator of APEX compared to purely digital AI agents.

---

## 4. MicroMax/OS Client (Browser Control Interface)
The Rust/PWA companion for device management.

### Feature Opportunities
*   **WebUSB/WebSerial Direct Flashing:** Transitioning from the current placeholder flash workflow to actual browser-based flashing utilizing WebUSB, bypassing the need for terminal tools.
*   **Device Fleet Management:** UI to track multiple connected MicroMax boards, showing connection status, firmware version, and historical error logs.
*   **Interactive ASP Debugger:** A visual serial monitor specifically designed for parsing and injecting JSON ASP commands, making hardware debugging intuitive.

*   **Complexity:** Medium
*   **Strategic Fit:** Medium. Crucial for onboarding new users and streamlining the hardware setup process.

---

## 5. IOT (KiCad Schematics and PCB Design)
The physical bones of the MicroMax system.

### Feature Opportunities
*   **Standardized Modular Shields:** Design a family of stackable PCB shields for the MicroMax mainboard (e.g., "Relay Shield", "Sensor Shield", "Motor Driver Shield").
*   **Integrated Power Management ICs (PMIC):** Robust power delivery handling multiple input sources (USB, Battery, DC Barrel) with safe charging profiles for autonomous operation.
*   **Miniaturization Track:** A smaller, integrated form-factor PCB combining the RP2040 and essential IO specifically designed for robotics.

*   **Complexity:** Medium (Hardware design cycles are slow, though technically straightforward)
*   **Strategic Fit:** High. Standardized hardware reduces bugs and provides a reliable platform for the software stack.

---

## 6. conductor (Product Planning & Documentation)
The governance and execution layer.

### Feature Opportunities
*   **AI-Automated Track Generation:** Scripts that parse the `index.md` and `product.md` to automatically generate draft technical tracks and PR requirements.
*   **CI/CD Workflow Enforcement:** GitHub Actions that parse `workflow.md` to block PRs that do not meet the quality gates defined in the conductor documents.
*   **Interactive Dependency Graph (DAG):** Visual representation of track dependencies to identify bottlenecks in the project roadmap.

*   **Complexity:** Low
*   **Strategic Fit:** Medium. Ensures the project scales cleanly as more contributors join.

---

## 3-Phase Rollout Plan

### Phase 1: Near-Term (0-3 Months) - "Stability & Visibility"
*   **CLI:** Enhance tool execution reliability and implement rudimentary offline fallback.
*   **RAM:** Build the Real-time Agent Telemetry Dashboard for basic observability.
*   **MicroMax/OS:** Implement the Advanced Fail-Safe State Machine for safety.
*   **OS Client:** Release the Interactive ASP Debugger.

### Phase 2: Medium-Term (3-9 Months) - "Autonomy & Expansion"
*   **CLI:** Full Voice Interface Enhancements with interruptibility.
*   **RAM:** Interactive Memory Graph and Knowledge Base viewer.
*   **MicroMax/OS:** Expanded Sensor Protocol Library (I2C/SPI support in ASP).
*   **IOT:** Release v1.0 of the Standardized Modular Shields.
*   **OS Client:** WebSerial Direct Flashing beta.

### Phase 3: Long-Term (9-18+ Months) - "Ecosystem Maturation"
*   **CLI:** Advanced MCP Integration and multi-agent routing.
*   **RAM:** Workflow Builder GUI for no-code automation.
*   **MicroMax/OS:** Over-The-Air (OTA) Updates and local PID controllers.
*   **IOT:** Integrated PMIC and battery management hardware.
*   **conductor:** AI-Automated Track Generation fully integrated into the CI pipeline.

---

## Community Contribution Guidelines

We welcome contributions across the entire stack! To get started:

1.  **Find a Track:** Review the `conductor/tracks.md` file to find active or planned features that align with the Roadmap.
2.  **Discuss Before Building:** For large features (Medium/High complexity), open an issue or start a discussion to validate the approach before writing code.
3.  **Follow the Architecture:** Read `ARCHITECTURE.md` to understand where your feature belongs.
    *   *AI Logic* -> `Core/CLI`
    *   *UI/Web* -> `Core/RAM` or `MicroMax/OS Client`
    *   *C++ Hardware* -> `MicroMax/OS`
4.  **Hardware Safety First:** Any PR modifying `MicroMax/OS` or `IOT` must clearly document its safety implications and fail-safe behaviors.
5.  **Review the Conductor Workflow:** Ensure your PR satisfies the quality gates outlined in `conductor/workflow.md`.
