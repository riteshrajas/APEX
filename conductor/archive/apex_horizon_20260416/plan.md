# Implementation Plan: Apex Horizon

## Phase 1: React Hub and Level 1 Integration [checkpoint: current]

- [x] **Task: Scaffold React/Vite PWA Structure**
    - [x] Create React-based shell with `App.jsx`.
    - [x] Implement premium themed UI with Tailwind-like CSS.
- [x] **Task: Level 1 Serial Adapter (Refactored)**
    - [x] Implement robust `SerialAdapter` using Web Serial API.
    - [x] Implement ASP 2.0 JSON command parser.
    - [x] Apply Google JS Style Guide fixes (naming, quotes, JSDoc).
- [x] **Task: Conductor - User Manual Verification 'Phase 1: React Hub and Level 1 Integration'**

## Phase 2: Level 2 & 3 Transport Adapters

- [ ] **Task: Local MQTT Integration (Level 2)**
    - [ ] Implement `mqtt_adapter.js` with `mqtt.js`.
    - [ ] Add room-based telemetry HUD.
- [ ] **Task: Cloud/LTE Integration (Level 3)**
    - [ ] Implement WebSocket bridge in `cloud_adapter.js` for remote MegaMax nodes.
    - [ ] Add signal strength and battery metrics.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Level 2 & 3 Transport Adapters'**

## Phase 3: Omni-Flasher and Semantic Inference

- [ ] **Task: Dynamic Firmware Sourcing**
    - [ ] Implement GitHub API integration to fetch binaries from APEX-MicroMax, MiniMax, and MegaMax.
- [ ] **Task: Semantic Command HUD**
    - [ ] Wire the 'Semantic Command' input to the RAM Brain API for local inference.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Omni-Flasher and Semantic Inference'**
