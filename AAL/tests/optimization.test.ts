import { expect, test, describe } from "bun:test";

describe("AAL Token Optimization", () => {
  test("AAL should be more compact than equivalent JSON", () => {
    const json = JSON.stringify({
      agent: {
        name: "SecurityManager",
        connections: [
          {
            target: "FrontDoorSensor",
            triggers: [
              {
                event: "intrusion",
                action: "lock_all_doors"
              }
            ]
          }
        ]
      }
    });

    const aal = `
AGENT "SecurityManager"
LINK "FrontDoorSensor"
ON "intrusion"
  EXEC "lock_all_doors"
    `.trim();

    // Heuristic: Character count as a proxy for tokens
    expect(aal.length).toBeLessThan(json.length * 0.7);
  });

  test("AAL keywords should be optimized", () => {
    const keywords = ["AGENT", "IOT", "LINK", "ON", "EXEC"];
    const averageLength = keywords.reduce((a, b) => a + b.length, 0) / keywords.length;
    expect(averageLength).toBeLessThan(5);
  });
});
