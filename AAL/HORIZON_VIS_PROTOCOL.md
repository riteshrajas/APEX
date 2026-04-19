# Horizon Visualization Protocol for AAL

This document defines how the AAL Internal Representation (IR) is consumed by the Horizon Digital Twin for node-graph visualization.

## Data Schema (JSON)

### Root Object
- `nodes`: Array of Node objects.
- `edges`: Array of Edge objects.

### Node Object
- `id`: Unique identifier (string).
- `type`: One of `agent`, `iot`.
- `label`: Display name (defaults to `id`).
- `metadata`: Optional key-value pairs for additional info.

### Edge Object
- `id`: Unique identifier (e.g., `source-target`).
- `source`: ID of the source node.
- `target`: ID of the target node.
- `type`: One of `connection`, `delegation`.
- `label`: Optional label (e.g., trigger name).
- `data`:
    - `trigger`: Name of the event trigger.
    - `action`: Name of the executed action.

## Horizon Integration Endpoint
Horizon will expose a `/api/aal/visualize` endpoint (or a similar local mechanism) that accepts this JSON and updates the global node-graph state.

## Default Layout Rules
1. **Agents** should be colored differently (e.g., Blue) from **IoT devices** (e.g., Green).
2. **Delegations** should be represented by dashed lines.
3. **Triggers/Actions** should be displayed as tooltips or labels on the edges.
