export function mapToIR(ast: any) {
  const nodes: any[] = [];
  const edges: any[] = [];
  let currentContext: string | null = null;

  for (const node of ast.body) {
    if (node.type === "AgentDefinition") {
      nodes.push({ id: node.name, type: "agent" });
      currentContext = node.name;
    } else if (node.type === "IoTDefinition") {
      nodes.push({ id: node.name, type: "iot" });
      currentContext = node.name;
    } else if (node.type === "Connection") {
      if (currentContext) {
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
