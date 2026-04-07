import { openApplication } from './src/apex/tools.js';
import assert from 'node:assert';

// We need to mock robotjs before importing tools
// However tools.js imports robotjs directly inside the module via require
// Let's rely on standard assertions to test the logic

async function runTests() {
    let passed = 0;
    let failed = 0;

    // Test 1: Allowed application
    try {
        // This will fail because robotjs throws an error if it's just a dummy string or fails to init
        // but let's test if it at least attempts to run by seeing if the error is our security error or a robotjs error
        openApplication('chrome');
        console.log('✅ Test 1 (Allowed App): Passed');
        passed++;
    } catch (e: any) {
        if (e.message && e.message.includes('Security Error')) {
            console.error('❌ Test 1 (Allowed App): Failed (Threw security error for allowed app)');
            failed++;
        } else {
            // Expected robotjs error because robotjs is not a real module or we mock it via jest (which we aren't using)
            console.log('✅ Test 1 (Allowed App): Passed (bypassed security check)');
            passed++;
        }
    }

    // Test 2: Allowed application with different case
    try {
        openApplication('NoTePaD');
        console.log('✅ Test 2 (Case Insensitive Allowed App): Passed');
        passed++;
    } catch (e: any) {
         if (e.message && e.message.includes('Security Error')) {
            console.error('❌ Test 2: Failed (Threw security error for allowed app)');
            failed++;
        } else {
            console.log('✅ Test 2 (Case Insensitive Allowed App): Passed (bypassed security check)');
            passed++;
        }
    }

    // Test 3: Disallowed application (Command Injection)
    try {
        openApplication('cmd.exe /c calc.exe');
        console.error('❌ Test 3 (Disallowed App): Failed (Did not throw security error)');
        failed++;
    } catch (e: any) {
        if (e.message && e.message.includes("Security Error: Application 'cmd.exe /c calc.exe' is not in the allowed list.")) {
            console.log('✅ Test 3 (Disallowed App): Passed (Threw expected security error)');
            passed++;
        } else {
             console.error(`❌ Test 3 (Disallowed App): Failed with unexpected error: ${e.message}`);
             failed++;
        }
    }

     // Test 4: Disallowed application (Malicious path)
    try {
        openApplication('../../../../windows/system32/cmd.exe');
        console.error('❌ Test 4 (Malicious Path): Failed (Did not throw security error)');
        failed++;
    } catch (e: any) {
        if (e.message && e.message.includes("Security Error")) {
            console.log('✅ Test 4 (Malicious Path): Passed (Threw expected security error)');
            passed++;
        } else {
             console.error(`❌ Test 4 (Malicious Path): Failed with unexpected error: ${e.message}`);
             failed++;
        }
    }

    console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
