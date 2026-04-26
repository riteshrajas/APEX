import { parseAAL } from "./AAL/src/parser";
import { mapToIR } from "./AAL/src/ir-mapper";
import fs from "node:fs";

const code = fs.readFileSync("blink_led.aal", "utf-8");
const ast = parseAAL(code);
const ir = mapToIR(ast);

console.log("--- AAL Source Code ---");
console.log(code);
console.log("\n--- Interpreted IR (Visualization Ready) ---");
console.log(JSON.stringify(ir, null, 2));
