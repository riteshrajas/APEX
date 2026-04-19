import { expect, test, describe } from "bun:test";
import { parseAAL } from "../src/parser";

describe("AAL Grammar", () => {
  test("should parse basic agent definition", () => {
    const code = `DEFINE AGENT "WeatherBot"`;
    const ast = parseAAL(code);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "AgentDefinition",
          name: "WeatherBot",
        },
      ],
    });
  });

  test("should parse connection and triggers", () => {
    const code = `
DEFINE AGENT "WeatherBot"
CONNECT TO "TempSensor"
ON TRIGGER "high_temp"
  EXECUTE "alert_user"
    `.trim();
    
    const ast = parseAAL(code);
    expect(ast.body).toContainEqual(expect.objectContaining({
      type: "Connection",
      target: "TempSensor"
    }));
    expect(ast.body).toContainEqual(expect.objectContaining({
      type: "Trigger",
      name: "high_temp",
      action: "alert_user"
    }));
  });
});
