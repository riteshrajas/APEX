import { expect, test, describe } from "bun:test";
import { parseAAL } from "../src/parser";
import { mapToIR } from "../src/ir-mapper";

describe("AAL IR Mapper", () => {
  test("should map AST to nodes and edges", () => {
    const code = `
IOT "S1"
AGENT "A1"
LINK "S1"
    `.trim();
    const ast = parseAAL(code);
    const ir = mapToIR(ast);

    expect(ir.nodes).toContainEqual({ id: "A1", type: "agent" });
    expect(ir.nodes).toContainEqual({ id: "S1", type: "iot" });
    expect(ir.edges).toContainEqual({ source: "A1", target: "S1", type: "connection" });
  });

  test("should handle triggers as edge metadata or specific nodes", () => {
    const code = `
AGENT "A1"
LINK "S1"
ON "high_temp"
  EXEC "alert"
    `.trim();
    const ast = parseAAL(code);
    const ir = mapToIR(ast);

    expect(ir.edges).toContainEqual(expect.objectContaining({
      source: "A1",
      target: "S1",
      trigger: "high_temp",
      action: "alert"
    }));
  });
});
