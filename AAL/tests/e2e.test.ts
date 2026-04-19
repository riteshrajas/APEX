import { expect, test, describe } from "bun:test";
import { parseAAL } from "../src/parser";
import { mapToIR } from "../src/ir-mapper";

describe("AAL End-to-End Validation", () => {
  test("should correctly process a full agentic/IoT flow", () => {
    const code = `
IOT "TempSensor"
AGENT "ClimateBot"
LINK "TempSensor"
ON "high_temp"
  EXEC "activate_cooling"
DELEGATE "AdminAgent"
    `.trim();

    const ast = parseAAL(code);
    const ir = mapToIR(ast);

    // Verify Nodes
    expect(ir.nodes).toHaveLength(3);
    expect(ir.nodes).toContainEqual({ id: "TempSensor", type: "iot" });
    expect(ir.nodes).toContainEqual({ id: "ClimateBot", type: "agent" });
    expect(ir.nodes).toContainEqual({ id: "AdminAgent", type: "agent" });
    
    // Verify Edges
    expect(ir.edges).toHaveLength(2);
    expect(ir.edges).toContainEqual(expect.objectContaining({
      source: "ClimateBot",
      target: "TempSensor",
      type: "connection",
      trigger: "high_temp",
      action: "activate_cooling"
    }));
    expect(ir.edges).toContainEqual({
      source: "ClimateBot",
      target: "AdminAgent",
      type: "delegation"
    });
  });
});
