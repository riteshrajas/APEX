import { expect, test, describe } from "bun:test";
import { parseAAL } from "../src/parser";

describe("AAL Parser Robustness", () => {
  test("should throw error on unknown keyword", () => {
    const code = `UNKNOWN_KEYWORD "Test"`;
    expect(() => parseAAL(code)).toThrow(/Unknown keyword/);
  });

  test("should handle empty code", () => {
    const ast = parseAAL("");
    expect(ast.body).toHaveLength(0);
  });

  test("should handle multiple definitions", () => {
    const code = `
AGENT "A1"
AGENT "A2"
LINK "A1"
    `.trim();
    const ast = parseAAL(code);
    expect(ast.body.filter(n => n.type === "AgentDefinition")).toHaveLength(2);
    expect(ast.body.filter(n => n.type === "Connection")).toHaveLength(1);
  });

  test("should handle IOT definitions", () => {
    const code = `IOT "Sensor1"`;
    const ast = parseAAL(code);
    expect(ast.body[0]).toEqual({ type: "IoTDefinition", name: "Sensor1" });
  });
});
