import { openApplication } from './src/apex/tools.js';

async function main() {
    let passed = 0;
    let failed = 0;

    console.log("Testing openApplication...");

    // Test 1: Valid application
    try {
        const result = openApplication("notepad");
        if (result === "Application 'notepad' opened") {
            console.log("✅ Valid app 'notepad' allowed.");
            passed++;
        } else {
            console.error("❌ Valid app 'notepad' returned unexpected result:", result);
            failed++;
        }
    } catch (e: any) {
        console.error("❌ Valid app 'notepad' failed to open:", e.message);
        failed++;
    }

    // Test 2: Valid application (mixed case)
    try {
        const result = openApplication("Chrome");
        if (result === "Application 'Chrome' opened") {
            console.log("✅ Valid app 'Chrome' allowed.");
            passed++;
        } else {
            console.error("❌ Valid app 'Chrome' returned unexpected result:", result);
            failed++;
        }
    } catch (e: any) {
        console.error("❌ Valid app 'Chrome' failed to open:", e.message);
        failed++;
    }

    // Test 3: Malicious payload (command injection)
    try {
        openApplication("cmd.exe /c format c:");
        console.error("❌ Malicious payload allowed! Vulnerability exists.");
        failed++;
    } catch (e: any) {
        if (e.message.includes("Security Error")) {
            console.log("✅ Malicious payload correctly blocked.");
            passed++;
        } else {
            console.error("❌ Malicious payload threw unexpected error:", e.message);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
        process.exit(1);
    }
}

main().catch(console.error);
