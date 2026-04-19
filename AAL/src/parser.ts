export function parseAAL(code: string) {
  const lines = code.split("\n").map(l => l.trim()).filter(l => l);
  const body: any[] = [];

  const VALID_KEYWORDS = ["AGENT", "IOT", "LINK", "ON", "EXEC", "DELEGATE", "IF", "REASON"];

  for (const line of lines) {
    const firstWord = line.split(" ")[0];
    
    // Basic validation for keywords
    if (!VALID_KEYWORDS.includes(firstWord)) {
      throw new Error(`Unknown keyword: ${firstWord}`);
    }

    if (line.startsWith("AGENT")) {
      const name = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "AgentDefinition", name });
    } else if (line.startsWith("IOT")) {
      const name = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "IoTDefinition", name });
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
    } else if (line.startsWith("DELEGATE")) {
      const target = line.match(/"([^"]+)"/)?.[1];
      body.push({ type: "Delegation", target });
    }
  }

  return { type: "Program", body };
}
