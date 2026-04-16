# Implementation Plan: Apex Horizon

## Phase 1: UI Scaffolding and Level 1 Integration - IN PROGRESS

- [x] **Task: Scaffold PWA Structure**
    - [x] Create universal `index.html` and premium `styles.css`.
    - [x] Implement modular `app.js` with transport level selectors.
- [ ] **Task: Level 1 Serial Adapter**
    - [ ] Port Web Serial logic from original OS Client.
    - [ ] Implement ASP 2.0 command parser.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: UI Scaffolding and Level 1 Integration'**

## Phase 2: Level 2 & 3 Transport Adapters

- [ ] **Task: Local MQTT Integration (Level 2)**
    - [ ] Implement `mqtt.js` adapter for browser-based MQTT communication.
    - [ ] Add room-based telemetry HUD.
- [ ] **Task: Cloud/LTE Integration (Level 3)**
    - [ ] Implement WebSocket bridge for remote MegaMax nodes.
    - [ ] Add signal strength and battery metrics.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Level 2 & 3 Transport Adapters'**

## Phase 3: Omni-Flasher and Semantic Inference

- [ ] **Task: Dynamic Firmware Sourcing**
    - [ ] Implement GitHub API integration to fetch binaries from APEX-MicroMax, MiniMax, and MegaMax.
- [ ] **Task: Semantic Command HUD**
    - [ ] Wire the 'Semantic Command' input to the RAM Brain API for local inference.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Omni-Flasher and Semantic Inference'**
