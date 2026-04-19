import { expect, test, describe } from "bun:test";
import { parseAAL } from "../src/parser";
import { mapToIR } from "../src/ir-mapper";

describe("Horizon Visualization Protocol", () => {
  test("IR should strictly follow the protocol schema", () => {
    const code = `
AGENT "A1"
LINK "S1"
ON "high_temp"
  EXEC "alert"
    `.trim();
    const ast = parseAAL(code);
    const ir = mapToIR(ast);

    // Validate nodes
    ir.nodes.forEach(node => {
      expect(node).toHaveProperty("id");
      expect(["agent", "iot"]).toContain(node.type);
    });

    // Validate edges
    ir.edges.forEach(edge => {
      expect(edge).toHaveProperty("source");
      expect(edge).toHaveProperty("target");
      expect(["connection", "delegation"]).toContain(edge.type);
    });
  });

  test("should map DELEGATE to a delegation edge", () => {
    const code = `
AGENT "A1"
DELEGATE "A2"
    `.trim();
    const ast = parseAAL(code);
    const ir = mapToIR(ast);
    
    expect(ir.edges).toContainEqual({
      source: "A1",
      target: "A2",
      type: "delegation"
    });
  });
});
