# Implementation Plan: APEX Abstract Language (AAL)

## Phase 1: AAL Specification & Grammar
- [ ] Task: Define the Core Grammar (EBNF-like) and Primitives
    - [ ] Write Failing Tests: Define expected tokens and basic parsing outcomes
    - [ ] Implement: Draft the `AAL_SPEC.md` with syntax rules and examples
- [ ] Task: Create Token Optimization Strategy
    - [ ] Write Failing Tests: Measure token usage for a baseline agent flow
    - [ ] Implement: Optimize syntax keywords for maximum information density
- [ ] Task: Conductor - User Manual Verification 'AAL Specification & Grammar' (Protocol in workflow.md)

## Phase 2: Core Interpreter Development
- [ ] Task: Implement Lexer and Parser for AAL
    - [ ] Write Failing Tests: Define test scripts that should/should not parse
    - [ ] Implement: Build a robust parser using a library or custom logic in Bun/TS
- [ ] Task: Create Internal Representation (IR) Mapper
    - [ ] Write Failing Tests: Verify AAL-to-JSON mapping for node structures
    - [ ] Implement: Develop the IR layer to facilitate visualization and execution
- [ ] Task: Conductor - User Manual Verification 'Core Interpreter Development' (Protocol in workflow.md)

## Phase 3: Horizon Node-Graph Integration
- [ ] Task: Define Visualization Protocol for Horizon
    - [ ] Write Failing Tests: Verify node/edge generation from AAL IR
    - [ ] Implement: Extend the Horizon API to accept AAL-driven configurations
- [ ] Task: Build React Node-Graph Component (RAM Dashboard)
    - [ ] Write Failing Tests: Test rendering of basic node clusters
    - [ ] Implement: Integrate a node-graph library (e.g., React Flow) to visualize AAL scripts
- [ ] Task: Conductor - User Manual Verification 'Horizon Node-Graph Integration' (Protocol in workflow.md)

## Phase 4: End-to-End Validation
- [ ] Task: Implement "Hello World" Agentic/IoT Flows
    - [ ] Write Failing Tests: Define success criteria for a sensor-to-agent flow
    - [ ] Implement: Create and visualize AAL scripts for core APEX use cases
- [ ] Task: Conductor - User Manual Verification 'End-to-End Validation' (Protocol in workflow.md)
