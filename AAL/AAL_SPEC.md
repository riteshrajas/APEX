# APEX Abstract Language (AAL) Specification v0.1

AAL is a minimalist, token-efficient, and declarative programming language designed for LLM-driven orchestration of AI agents and IoT devices within the APEX ecosystem.

## Design Philosophy
1. **Token Density:** Maximize information per token.
2. **Predictability:** Strictly structured to minimize LLM hallucinations.
3. **Visual Mapping:** Every statement maps directly to a node or edge in a graph.

## Core Syntax

### Definitions
- `DEFINE AGENT "<Name>"`: Creates a new agent node.
- `DEFINE IOT "<Name>"`: Creates a new IoT device node.

### Relationships
- `CONNECT TO "<Name>"`: Establishes a bidirectional link between the current context and the target node.

### Interactions
- `ON TRIGGER "<Event>"`: Sets a listener for a specific event on the connected node.
- `EXECUTE "<Action>"`: Specifies the action to perform when a trigger is activated.
- `DELEGATE TO "<Agent>"`: Passes a task to another agent.

### Logic (Experimental)
- `IF <Condition> THEN <Action>`
- `REASON "<Prompt>"`: Invokes an LLM to decide the next step.

## Examples

### Basic Sensor Alert
```aal
DEFINE AGENT "SecurityManager"
CONNECT TO "FrontDoorSensor"
ON TRIGGER "intrusion"
  EXECUTE "lock_all_doors"
  DELEGATE TO "PoliceDispatcher"
```

### Environmental Control
```aal
DEFINE AGENT "ClimateBot"
CONNECT TO "HVAC"
REASON "Check if current temp is above 25C"
IF true THEN
  EXECUTE "start_cooling"
```
