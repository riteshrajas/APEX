export function mapToIR(ast: any) {
  const nodes: any[] = [];
  const edges: any[] = [];
  let currentContext: string | null = null;

  function ensureNode(id: string, type: string = "agent") {
    if (!nodes.find(n => n.id === id)) {
      nodes.push({ id, type });
    }
  }

  for (const node of ast.body) {
    if (node.type === "AgentDefinition") {
      ensureNode(node.name, "agent");
      currentContext = node.name;
    } else if (node.type === "IoTDefinition") {
      ensureNode(node.name, "iot");
      currentContext = node.name;
    } else if (node.type === "Connection") {
      if (currentContext) {
        ensureNode(node.target, "iot"); // Default referenced targets to iot for LINK
        edges.push({
          source: currentContext,
          target: node.target,
          type: "connection"
        });
      }
    } else if (node.type === "Trigger") {
      const lastEdge = edges.filter(e => e.source === currentContext).pop();
      if (lastEdge) {
        lastEdge.trigger = node.name;
        lastEdge.action = node.action;
      }
    } else if (node.type === "Delegation") {
      if (currentContext) {
        ensureNode(node.target, "agent"); // Default referenced targets to agent for DELEGATE
        edges.push({
          source: currentContext,
          target: node.target,
          type: "delegation"
        });
      }
    }
  }

  return { nodes, edges };
}
