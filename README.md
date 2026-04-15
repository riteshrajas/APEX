# 📖 APEX: The Autonomous Physical-Digital Ecosystem

## 📖 Overview
APEX is a multi-layered, agentic platform that bridges high-level AI reasoning with low-level physical hardware. It serves as an "Autonomous Physical-Digital Ecosystem," comprising a sophisticated TypeScript-based CLI "brain" (Core/CLI), a Next.js knowledge management interface (Core/RAM), and robust firmware/hardware layers for real-world interaction (MicroMax and IOT). It is designed to act as an intelligent workstation assistant capable of both digital orchestration and physical hardware control.

## ✨ Features
APEX is built on a highly modular, feature-flagged architecture with over 88 specialized capabilities. Key features include:

- **🧠 Agentic Intelligence:** Deep integration with Anthropic, AWS Bedrock, and Google Vertex SDKs to drive autonomous decision-making.
- **🎙️ Voice Mode:** Real-time push-to-talk UI, voice notices, and dictation plumbing for hands-free interaction (`/voice`).
- **🛠️ MCP Tooling:** Full support for the Model Context Protocol (MCP) to extend agent capabilities with external tools, including `CHICAGO_MCP` for computer-use integrations.
- **💾 Persistent Memory:** Advanced session storage, agent memory snapshots (`AGENT_MEMORY_SNAPSHOT`), and automated compaction routines.
- **🖥️ Desktop Control:** Layered desktop control CLI with macro support and cross-platform native hooks.
- **🔌 Hardware Bridge:** Real-time serial communication with tethered hardware nodes (MicroMax) using the Apex Serial Protocol (ASP).
- **📊 Cost Tracking:** Built-in token budget tracking and cost-analysis UI (`TOKEN_BUDGET`).
- **🚀 Task Planning:** Built-in explore/plan agents and `ULTRAPLAN` / `ULTRATHINK` modes for deep reasoning.

## 🚀 Installation

### ✅ Requirements
- **Bun:** The primary runtime for the CLI and build system.
- **Node.js / npm:** Required for the RAM web interface.
- **Python 3.x:** For running the system test suite (`pytest`).
- **PlatformIO:** For building and flashing the MicroMax firmware.
- **Git:** To clone and manage submodules.

### Step-by-Step Guide
1. **Clone the Repository:**
   ```bash
   git clone --recursive https://github.com/riteshrajas/APEX.git
   cd APEX
   ```

2. **Setup Core CLI (The Brain):**
   ```bash
   cd Core/CLI
   bun install
   bun run build
   # For a fully-featured development build:
   # bun run ./scripts/build.ts --dev --feature-set=dev-full
   ```

3. **Setup Core RAM (The Dashboard):**
   ```bash
   cd ../RAM
   npm install
   ```

4. **Setup MicroMax (The Hands):**
   ```bash
   cd ../../MicroMax
   pio run
   ```

## 🛠️ Usage

### Running the Interactive CLI
Execute the APEX brain in interactive development mode (with hot code reload):
```bash
bun run Core/CLI/src/entrypoints/cli.tsx
```
Once built and added to your PATH, you can simply run:
```bash
APEX <args>
```

### Starting the Web Dashboard
Launch the knowledge management interface:
```bash
cd Core/RAM
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### Running System Tests
Run the comprehensive Python-based test suite that exercises the bundled app:
```bash
cd Core/CLI
pytest
```

## 📦 Technologies
- **Digital Core:** Bun, TypeScript, React (Ink for Terminal UI), Python.
- **Web Interface:** Next.js, React, Tailwind CSS.
- **AI Stack:** Anthropic SDK, Model Context Protocol (MCP), OpenTelemetry.
- **Firmware:** C++, PlatformIO, Arduino framework.
- **Hardware Target:** RP2040 (Raspberry Pi Pico), ATmega328P, ESP32.
- **Hardware Design:** KiCad (PCB layouts and schematics).

## 🔧 Configuration
- **Feature Flags:** APEX uses a `feature('FLAG')` system evaluated at compile-time via Bun's bundle plugin. Experimental features can be enabled during the build process:
  ```bash
  bun run ./scripts/build.ts --feature=VOICE_MODE --feature=ULTRAPLAN
  ```
- **Environment Variables:** API keys for Anthropic, AWS, or Google Cloud should be configured in your environment or a `.env` file before launching the CLI.
- **Hardware Connectivity:** MicroMax expects a USB Serial connection at 115,200 baud (8-N-1).

## 🤝 Contributing
We welcome contributions to all layers of the APEX ecosystem!
1. **Sync Submodules:** Ensure all submodules are up to date (`git submodule update --init --recursive`).
2. **Linting & Formatting:** Run `bun exec eslint .` and `bun exec prettier --check .` before submitting PRs.
3. **Testing:** New features must be accompanied by corresponding `pytest` or Python-based validation scripts.
4. **Hardware Changes:** Modify the `IOT` KiCad files carefully and include exported PDFs for review.

## 📄 Documentation
- For detailed architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).
- For agentic capabilities and tools, see [AGENT.md](AGENT.md).
- For Core CLI specifics, see `Core/CLI/APEX.md` and `Core/CLI/FEATURES.md`.
- For MicroMax hardware protocol details, see `MicroMax/SPEC.md`.

## ❤️ Acknowledgements
Built and maintained by **Ritesh Raj AS** and the APEX contributor community. Special thanks to:
- `google-labs-jules[bot]` and `copilot-swe-agent[bot]` for automated architectural assistance.
- The creators of Bun, Ink, and PlatformIO for making this stack possible.

## 📝 Changelog
* **Recent:** Merged PRs for "copilot/add-gitignore-and-agent-docs".
* **Recent:** Initiated "Iron Man Level" tech upgrade master plan.
* **Recent:** Added layered desktop control CLI with macro support.
* **Recent:** Integrated CLI-only RAM integration master plan.
* **Recent:** Restored and synced MicroMax entry points to ensure firmware compatibility.

---
*Generated automatically based on the repository state.*