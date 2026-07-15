/**
 * Simple Node.js server to execute Playwright tests from the UI
 * Run with: node server-validation.js
 */

const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML)

// Execute Playwright test
function runPlaywrightTest(testFile, options = {}, headed = false) {
    return new Promise((resolve, reject) => {
        const headedFlag = headed ? '--headed' : '';
        const command = `npx playwright test ${testFile} ${headedFlag} --reporter=line`.trim();

        console.log(`Executing: ${command}`);
        console.log(`Environment Variables:`, options);

        // Pass environment variables through exec options (Windows-compatible)
        const execOptions = {
            cwd: __dirname,
            env: {
                ...process.env,  // Inherit existing environment
                ...options       // Add our custom environment variables
            }
        };

        exec(command, execOptions, (error, stdout, stderr) => {
            // Check if test actually passed by examining output and exit code
            const output = stdout + stderr;

            // Playwright exit codes:
            // 0 = all tests passed
            // 1 = at least one test failed
            const exitCode = error ? error.code : 0;
            const success = exitCode === 0;

            console.log(`Test result: ${success ? 'PASSED ✓' : 'FAILED ✗'} (Exit code: ${exitCode})`);

            // Extract summary info
            let passedCount = 0;
            let failedCount = 0;
            let skippedCount = 0;

            const passedMatch = output.match(/(\d+)\s+passed/i);
            const failedMatch = output.match(/(\d+)\s+failed/i);
            const skippedMatch = output.match(/(\d+)\s+skipped/i);

            if (passedMatch) passedCount = parseInt(passedMatch[1]);
            if (failedMatch) failedCount = parseInt(failedMatch[1]);
            if (skippedMatch) skippedCount = parseInt(skippedMatch[1]);

            // Check if test was skipped due to no DBLPC
            const wasSkippedNoDblpc = output.includes('No DBLPC earnings found');

            if (failedCount > 0) {
                console.log(`  ❌ ${failedCount} test(s) failed`);
            }
            if (passedCount > 0) {
                console.log(`  ✓ ${passedCount} test(s) passed`);
            }
            if (skippedCount > 0) {
                console.log(`  ⏭️  ${skippedCount} test(s) skipped`);
            }

            resolve({
                success: success,
                error: error ? error.message : null,
                stdout,
                stderr,
                exitCode: exitCode,
                passedCount,
                failedCount,
                skippedCount,
                wasSkippedNoDblpc
            });
        });
    });
}

// Helper: Convert date from YYYY-MM-DD to MM/DD/YYYY
function convertDateFormat(dateStr) {
    if (!dateStr) return dateStr;

    // Check if already in MM/DD/YYYY format
    if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        return dateStr;
    }

    // Convert from YYYY-MM-DD to MM/DD/YYYY
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    }

    return dateStr;
}

// API: Start Group Run
app.post('/api/start-group-run', async (req, res) => {
    const {
        environment,
        groupName,
        groupId,
        payPeriodStart,
        payPeriodEnd,
        correctionRun,
        autoCancel,
        checkOnly
    } = req.body;

    // Convert dates from HTML date format (YYYY-MM-DD) to script format (MM/DD/YYYY)
    const convertedStart = convertDateFormat(payPeriodStart);
    const convertedEnd = convertDateFormat(payPeriodEnd);

    console.log(`Date conversion: ${payPeriodStart} → ${convertedStart}, ${payPeriodEnd} → ${convertedEnd}`);

    const options = {
        TEST_ENV: environment,
        GROUP_NAME: groupName,
        GROUP_ID: groupId,
        PAY_PERIOD_START: convertedStart,
        PAY_PERIOD_END: convertedEnd,
        CORRECTION_RUN: correctionRun,
        AUTO_CANCEL: autoCancel,
        CHECK_ONLY: checkOnly
    };

    const result = await runPlaywrightTest('tests/group-run-ui-driven.spec.ts', options);

    res.json(result);
});

// API: Run DBLPC Validation
app.post('/api/validate-dblpc', async (req, res) => {
    const { runId } = req.body;
    
    const scripts = [
        'tests/slfcab-dblpc-1-totals.spec.ts',
        'tests/slfcab-dblpc-2-avgrate.spec.ts',
        'tests/slfcab-dblpc-3-daily.spec.ts'
    ];
    
    const results = [];
    
    for (const script of scripts) {
        const result = await runPlaywrightTest(script);
        results.push({
            script: path.basename(script),
            ...result
        });
    }
    
    res.json({
        runId,
        results,
        summary: {
            total: results.length,
            passed: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
        }
    });
});

// API: Get Successful Runs (from cache) - DEV
app.get('/api/successful-runs', async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        const runsPath = path.join(__dirname, 'slfcab-group-job-runs.json');
        const runsData = fs.readFileSync(runsPath, 'utf-8');
        const runs = JSON.parse(runsData);

        console.log(`✓ Loaded ${runs.length} DEV runs from cache`);
        res.json(runs);
    } catch (error) {
        console.error('Error loading DEV runs:', error);
        res.json([]);
    }
});

// API: Get STAGE Runs (from cache)
app.get('/api/stage-runs', async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        const runsPath = path.join(__dirname, 'slfcab-stage-runs.json');
        if (!fs.existsSync(runsPath)) {
            console.log('⚠️  STAGE runs file not found, fetching fresh data...');
            // If file doesn't exist, trigger fetch
            return res.json([]);
        }

        const runsData = fs.readFileSync(runsPath, 'utf-8');
        const runs = JSON.parse(runsData);

        console.log(`✓ Loaded ${runs.length} STAGE runs from cache`);
        res.json(runs);
    } catch (error) {
        console.error('Error loading STAGE runs:', error);
        res.json([]);
    }
});

// API: Fetch Successful Runs (alias for refresh)
app.post('/api/fetch-successful-runs', async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    console.log('\n🔄 FETCHING: Getting successful runs from PayHub DEV...');
    console.log('═'.repeat(80));

    // Run the Playwright script to fetch fresh data
    const result = await runPlaywrightTest('tests/fetch-successful-runs.spec.ts', {}, false);

    if (result.success) {
        try {
            const runsPath = path.join(__dirname, 'successful-runs.json');
            const runsData = fs.readFileSync(runsPath, 'utf-8');
            const runs = JSON.parse(runsData);

            console.log(`✅ Successfully fetched ${runs.length} successful runs from DEV`);
            console.log('═'.repeat(80));

            res.json({
                success: true,
                runs: runs,
                message: `Successfully fetched ${runs.length} runs from PayHub DEV`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error reading successful runs file:', error);
            res.json({
                success: false,
                runs: [],
                message: 'Failed to read successful runs file after fetch',
                error: error.message
            });
        }
    } else {
        res.json({
            success: false,
            runs: [],
            message: 'Failed to fetch runs from PayHub',
            error: result.stderr || 'Unknown error'
        });
    }
});

// API: Refresh Successful Runs (real-time fetch from DEV)
app.post('/api/refresh-successful-runs', async (req, res) => {
    const fs = require('fs');
    const path = require('path');

    console.log('\n🔄 REAL-TIME FETCH: Fetching successful runs from PayHub DEV...');
    console.log('═'.repeat(80));

    // Run the Playwright script to fetch fresh data
    const result = await runPlaywrightTest('tests/fetch-successful-runs.spec.ts', {}, false);

    if (result.success) {
        try {
            const runsPath = path.join(__dirname, 'successful-runs.json');
            const runsData = fs.readFileSync(runsPath, 'utf-8');
            const runs = JSON.parse(runsData);

            console.log(`✅ Successfully fetched ${runs.length} successful runs from DEV`);
            console.log('═'.repeat(80));

            res.json({
                success: true,
                runs: runs,
                message: `Successfully fetched ${runs.length} runs from PayHub DEV`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error reading successful runs file:', error);
            res.json({
                success: false,
                runs: [],
                message: 'Failed to read successful runs file after fetch',
                error: error.message
            });
        }
    } else {
        console.error('❌ Playwright script failed to fetch runs');
        console.log('═'.repeat(80));

        res.json({
            success: false,
            runs: [],
            message: 'Playwright script failed to fetch runs from DEV',
            error: result.output
        });
    }
});

// API: Verify Run ID exists
app.post('/api/verify-run-id', async (req, res) => {
    const { runId, environment } = req.body;
    const envName = environment === 'stage' ? 'STAGE' : 'DEV';

    console.log(`\n🔍 Verifying Run ID: ${runId} in ${envName}`);

    // Check format - Run ID format: UUID (e.g., "789fea8e-cf21-42bc-9f89-fe6750ae8666")
    // Can be either full UUID or short form (first 8 chars)
    const isFullUUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(runId);
    const isShortForm = /^[a-f0-9]{8}$/i.test(runId);

    if (!isFullUUID && !isShortForm) {
        console.log(`❌ Invalid Run ID format: ${runId}`);
        res.json({
            exists: false,
            message: `Invalid Run ID format. Expected UUID format (e.g., "789fea8e-cf21-42bc-9f89-fe6750ae8666") or short form (e.g., "789fea8e"), got "${runId}"`
        });
        return;
    }

    console.log(`✓ Run ID format is valid (${isFullUUID ? 'Full UUID' : 'Short form'})`);
    console.log(`🔎 Checking if Run ID exists in PayHub ${envName}...`);

    // Run actual Playwright verification script with environment
    const result = await runPlaywrightTest('tests/verify-run-id.spec.ts', {
        RUN_ID: runId,
        ENVIRONMENT: environment || 'dev'
    }, false);

    if (result.success) {
        console.log(`✅ Run ID "${runId}" verified successfully in ${envName}`);
        res.json({
            exists: true,
            message: `Run ID "${runId}" exists in PayHub ${envName} environment`
        });
    } else {
        console.log(`❌ Run ID "${runId}" does not exist in PayHub ${envName}`);
        res.json({
            exists: false,
            message: `Run ID "${runId}" does not exist in PayHub ${envName} environment for SLFCAB group`
        });
    }
});

// API: Run Single Validation Script
app.post('/api/validate-script', async (req, res) => {
    const { scriptFile, headed, runId, environment } = req.body;

    // Pass runId and environment as environment variables
    const options = {
        ...(runId ? { RUN_ID: runId } : {}),
        ...(environment ? { ENVIRONMENT: environment } : {})
    };

    const result = await runPlaywrightTest(`tests/${scriptFile}`, options, headed || false);

    res.json(result);
});

// API: Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is running!' });
});

// API: Fetch SLFCAB Runs (real-time)
app.post('/api/fetch-slfcab-runs', (req, res) => {
    const { environment } = req.body;
    const envName = environment === 'stage' ? 'STAGE' : 'DEV';

    console.log(`\n🔄 Fetching SLFCAB runs from PayHub ${envName}...`);
    console.log('═'.repeat(80));

    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    // Pass environment as env variable to the script
    const command = `node scripts/fetch-slfcab-job-runs.js`;
    const execOptions = {
        cwd: __dirname,
        env: {
            ...process.env,
            ENVIRONMENT: environment || 'dev'
        }
    };

    console.log(`📍 Executing command: ${command}`);
    console.log(`🌍 Environment: ${envName}`);
    console.log(`📂 Working directory: ${__dirname}`);

    exec(command, execOptions, (error, stdout, stderr) => {
        console.log('\n📋 Script Output:');
        console.log(stdout);

        if (stderr) {
            console.log('\n⚠️ Script Errors:');
            console.log(stderr);
        }

        if (error) {
            console.error('❌ Error executing script:', error.message);
            return res.json({
                success: false,
                error: error.message,
                stderr,
                stdout
            });
        }

        // Read the generated slfcab-group-job-runs.json file
        const dataFile = path.join(__dirname, 'slfcab-group-job-runs.json');
        console.log(`\n📁 Looking for file: ${dataFile}`);
        console.log(`📂 File exists: ${fs.existsSync(dataFile)}`);

        if (fs.existsSync(dataFile)) {
            const runs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
            console.log(`✅ Successfully fetched ${runs.length} SLFCAB runs from ${envName}`);
            console.log('═'.repeat(80));

            res.json({
                success: true,
                runs,
                message: `Fetched ${runs.length} SLFCAB runs from PayHub DEV`,
                timestamp: new Date().toISOString(),
                stdout
            });
        } else {
            console.log('❌ Data file was not created by the script');
            res.json({
                success: false,
                error: 'Data file not created',
                stdout,
                stderr
            });
        }
    });
});

// API: Discover Earning Codes (All Groups)
app.post('/api/discover-earning-codes', (req, res) => {
    console.log('\n🔍 Discovering earning codes from all 15 calculation set groups...');
    const { environment } = req.body;

    const { exec } = require('child_process');
    const envValue = environment === 'STAGE' ? 'stage' : 'dev';
    const command = `node scripts/discover-earning-codes-all-groups.js`;

    console.log(`   Command: ${command}`);
    console.log(`   Environment: ${envValue}`);

    // Pass environment variable properly for Windows
    const options = {
        cwd: __dirname,
        env: { ...process.env, ENVIRONMENT: envValue }
    };

    exec(command, options, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error discovering earning codes:', error);
            return res.json({
                success: false,
                error: error.message,
                stderr,
                stdout
            });
        }

        // Read the generated JSON file
        const fs = require('fs');
        const path = require('path');
        const envName = environment === 'STAGE' ? 'stage' : 'dev';
        const dataFile = path.join(__dirname, `earning-codes-discovery-${envName}.json`);

        if (fs.existsSync(dataFile)) {
            const results = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
            console.log(`✅ Successfully discovered earning codes from ${results.groups.length} groups`);

            return res.json({
                success: true,
                results: results,
                stdout,
                message: `Discovery complete! Found codes in ${results.groups.filter(g => g.status === 'SUCCESS').length} groups`
            });
        } else {
            return res.json({
                success: false,
                error: 'Discovery file not found',
                stdout,
                stderr
            });
        }
    });
});

// API: Fetch Runs for Specific Group
app.post('/api/fetch-group-runs', (req, res) => {
    const { environment, groupName } = req.body;
    const envName = environment === 'stage' ? 'STAGE' : 'DEV';
    const authFile = environment === 'stage' ? 'auth-state-stage.json' : 'auth-state-dev.json';

    console.log(`\n🔄 Fetching ${groupName} runs from PayHub ${envName}...`);
    console.log('═'.repeat(80));

    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    // Use universal script with group name as argument
    const command = `node scripts/fetch-group-job-runs-universal.js "${groupName}"`;
    const execOptions = {
        cwd: __dirname,
        env: {
            ...process.env,
            AUTH_FILE: authFile,
            ENVIRONMENT: environment || 'dev'
        }
    };

    console.log(`📍 Executing command: ${command}`);
    console.log(`🌍 Environment: ${envName}`);
    console.log(`📂 Group: ${groupName}`);
    console.log(`🔑 Auth File: ${authFile}`);

    exec(command, execOptions, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error fetching runs:', error);
            console.error('STDERR:', stderr);
            return res.json({
                success: false,
                error: error.message,
                stderr,
                stdout
            });
        }

        // The universal script creates a file with the group name
        const sanitizedGroupName = groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const dataFile = path.join(__dirname, `${sanitizedGroupName}-all-runs.json`);

        console.log(`📁 Looking for file: ${dataFile}`);

        if (fs.existsSync(dataFile)) {
            const runs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
            console.log(`✅ Successfully fetched ${runs.length} ${groupName} runs from ${envName}`);
            console.log('═'.repeat(80));

            res.json({
                success: true,
                runs,
                groupName,
                environment: envName,
                message: `Fetched ${runs.length} runs from ${groupName} in ${envName}`,
                timestamp: new Date().toISOString(),
                stdout
            });
        } else {
            console.log('❌ Data file was not created by the script');
            console.log('STDOUT:', stdout);
            console.log('STDERR:', stderr);
            res.json({
                success: false,
                error: 'Data file not created - group might not exist or have no runs',
                stdout,
                stderr
            });
        }
    });
});

// API: Fetch All Group Runs
app.post('/api/fetch-all-group-runs', (req, res) => {
    const { environment } = req.body;
    const envName = environment === 'stage' ? 'STAGE' : 'DEV';

    console.log(`\n🌍 Fetching runs from all 15 calculation set groups in ${envName}...`);
    console.log('📍 Route called successfully');

    const { exec } = require('child_process');
    const command = 'node scripts/fetch-all-group-job-runs.js';

    const execOptions = {
        cwd: __dirname,
        env: {
            ...process.env,
            ENVIRONMENT: environment || 'dev'
        }
    };

    exec(command, execOptions, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error fetching group runs:', error);
            return res.json({
                success: false,
                error: error.message,
                stderr
            });
        }

        // Read the generated all-groups-job-runs.json file
        const fs = require('fs');
        const path = require('path');
        const dataFile = path.join(__dirname, 'all-groups-job-runs.json');

            if (fs.existsSync(dataFile)) {
                const runs = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
                console.log(`✅ Successfully fetched ${runs.length} runs from all groups`);

                // Calculate group statistics
                const groupStats = {};

                // All 15 group IDs in DEV (CORRECT IDs)
                const allGroupIds = ['10', '2', '18', '19', '20', '8', '6', '13', '9', '12', '3', '16', '11', '7', '14'];

                // Count runs per group
                runs.forEach(run => {
                    const groupId = run.groupId || run.group_id;
                    if (groupId) {
                        if (!groupStats[groupId]) {
                            groupStats[groupId] = { count: 0, error: false };
                        }
                        groupStats[groupId].count++;
                    }
                });

                // Mark groups with 0 runs or errors (check individual JSON files)
                allGroupIds.forEach(groupId => {
                    if (!groupStats[groupId]) {
                        groupStats[groupId] = { count: 0, error: false };
                    }
                });

                res.json({
                    success: true,
                    runs,
                    groupStats,
                    message: `Fetched ${runs.length} runs from all groups`,
                    stdout
                });
            } else {
                res.json({
                    success: false,
                    error: 'Data file not created',
                    stdout,
                    stderr
                });
            }
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 PayHub Validation Server Running`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📍 Server URL: http://localhost:${PORT}`);
    console.log(`📋 Open UI: http://localhost:${PORT}/group-run-ui-enhanced.html`);
    console.log(`\n${'='.repeat(60)}\n`);
});
