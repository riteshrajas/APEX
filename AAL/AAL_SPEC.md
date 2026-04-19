# APEX Abstract Language (AAL) Specification v0.1 (Optimized)

AAL is a minimalist, token-efficient, and declarative programming language designed for LLM-driven orchestration of AI agents and IoT devices within the APEX ecosystem.

## Design Philosophy
1. **Token Density:** Maximize information per token.
2. **Predictability:** Strictly structured to minimize LLM hallucinations.
3. **Visual Mapping:** Every statement maps directly to a node or edge in a graph.

## Core Syntax (Token-Optimized)

### Definitions
- `AGENT "<Name>"`: Creates a new agent node.
- `IOT "<Name>"`: Creates a new IoT device node.

### Relationships
- `LINK "<Name>"`: Establishes a bidirectional link between the current context and the target node.

### Interactions
- `ON "<Event>"`: Sets a listener for a specific event on the connected node.
- `EXEC "<Action>"`: Specifies the action to perform when a trigger is activated.
- `DELEGATE "<Agent>"`: Passes a task to another agent.

### Logic (Experimental)
- `IF <Condition> THEN <Action>`
- `REASON "<Prompt>"`: Invokes an LLM to decide the next step.

## Examples

### Basic Sensor Alert
```aal
AGENT "SecurityManager"
LINK "FrontDoorSensor"
ON "intrusion"
  EXEC "lock_all_doors"
  DELEGATE "PoliceDispatcher"
```

### Environmental Control
```aal
AGENT "ClimateBot"
LINK "HVAC"
REASON "Check if current temp is above 25C"
IF true THEN
  EXEC "start_cooling"
```
