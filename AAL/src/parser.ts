export function parseAAL(code: string) {
  const lines = code.split("\n").map(l => l.trim()).filter(l => l);
  const body: any[] = [];

  for (const line of lines) {
    if (line.startsWith("AGENT")) {
      const name = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "AgentDefinition", name });
    } else if (line.startsWith("LINK")) {
      const target = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "Connection", target });
    } else if (line.startsWith("ON")) {
      const name = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "Trigger", name, action: "" });
    } else if (line.startsWith("EXEC")) {
      const action = line.match(/"([^"]+)"/)?.[1];
      const lastTrigger = body.filter(node => node.type === "Trigger").pop();
      if (lastTrigger) {
        lastTrigger.action = action;
      }
    }
  }

  return { type: "Program", body };
}
