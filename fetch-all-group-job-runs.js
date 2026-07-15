/**
 * Fetch Group Job Runs for ALL 16 Calculation Set Groups
 * 
 * Usage:
 *   node scripts/fetch-all-group-job-runs.js
 *   node scripts/fetch-all-group-job-runs.js --status=SUCCEEDED
 * 
 * Output:
 *   - Individual files: <groupname>-job-runs.json (16 files)
 *   - Combined file: all-groups-job-runs.json (all data)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth-state-dev.json');
const BASE_URL = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/';

// All 15 calculation set groups in DEV with CORRECT IDs (verified from DEV environment)
const ALL_GROUPS = [
  { id: '10', name: 'AGRHBW - Pay Process' },
  { id: '2', name: 'AHSHBW - Pay Process' },
  { id: '18', name: 'DSGHRL - Pay Process' },
  { id: '19', name: 'DSGSAL - Pay Process' },
  { id: '20', name: 'DSMHRL - Pay Process' },
  { id: '8', name: 'ECMHBW - Pay Process' },
  { id: '6', name: 'KWFHBW - Pay Process' },
  { id: '13', name: 'KWFSBW - Pay Process' },
  { id: '9', name: 'RLFHBW - Pay Process' },
  { id: '12', name: 'RLFSBW - Pay Process' },
  { id: '3', name: 'SLFCAB - Pay Process' },
  { id: '16', name: 'SLFNSB - Pay Process' },
  { id: '11', name: 'SLFNVB - Pay Process' },
  { id: '7', name: 'SWFHBW - Pay Process' },
  { id: '14', name: 'SWFSBW - Pay Process' }
];

// Parse command line arguments
const args = process.argv.slice(2);
const statusFilter = args.find(arg => arg.startsWith('--status='))?.split('=')[1];
const submissionFilter = args.find(arg => arg.startsWith('--submission='))?.split('=')[1];

console.log('\n' + '═'.repeat(80));
console.log('🌍 FETCHING GROUP JOB RUNS FROM ALL 16 CALCULATION SET GROUPS');
console.log('═'.repeat(80));
console.log(`📅 Started: ${new Date().toLocaleString()}`);
if (statusFilter) console.log(`🔍 Filter: Status = ${statusFilter}`);
if (submissionFilter) console.log(`🔍 Filter: Submission = ${submissionFilter}`);
console.log('═'.repeat(80));

async function fetchGroupJobRuns(page, group) {
  console.log(`\n[${group.id}] 📊 ${group.name}`);
  console.log('─'.repeat(80));

  // Validate group object
  if (!group || !group.id) {
    console.error('   ❌ Invalid group object:', group);
    return { group: group?.name || 'Unknown', runs: [], success: false, error: 'Invalid group ID' };
  }

  try {
    // Navigate directly to the group's page
    const url = `${BASE_URL}calculation-set-groups/${group.id}`;
    console.log(`   Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Wait for the "Group Job Runs" section specifically
    console.log('   Waiting for Group Job Runs section...');

    // Wait for the "Submission Status" dropdown (unique to Group Job Runs section)
    try {
      await page.waitForSelector('text=Submission Status', { timeout: 15000 });
      console.log('   ✓ Found Submission Status filter');
    } catch (e) {
      console.log('   ⚠️  Submission Status filter not found');
    }

    // Wait a bit more for the table to fully render
    await page.waitForTimeout(3000);

    // Wait for table with data
    await page.waitForSelector('table tbody tr', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Extract runs from the table that has "Submission Status" column
    const runs = await page.evaluate(() => {
      const allTables = Array.from(document.querySelectorAll('table'));

      if (allTables.length === 0) {
        console.log('❌ No tables found on page');
        return [];
      }

      // Find the table that has "Submission Status" in its headers (this is unique to Group Job Runs)
      let targetTable = null;
      for (const table of allTables) {
        const headers = Array.from(table.querySelectorAll('thead th, thead td'));
        const hasSubmissionStatus = headers.some(h =>
          h.textContent && h.textContent.includes('Submission Status')
        );
        if (hasSubmissionStatus) {
          targetTable = table;
          console.log('   ✓ Found table with "Submission Status" column');
          break;
        }
      }

      // Fallback: use last table if we couldn't find one with Submission Status column
      if (!targetTable) {
        console.log('   ⚠️ Could not find table with "Submission Status" column, using last table');
        targetTable = allTables[allTables.length - 1];
      }

      const rows = Array.from(targetTable.querySelectorAll('tbody tr'));

      return rows.map((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('td'));

        if (rowIndex === 0) {
          console.log(`   First row has ${cells.length} cells`);
        }

        if (cells.length < 5) {
          if (rowIndex === 0) {
            console.log(`   ⚠️ First row has only ${cells.length} cells (need at least 5)`);
          }
          return null;
        }

        // Column 0: ID (Run ID - UUID, shown as link)
        const runIdLink = cells[0]?.querySelector('a');
        let runId = '';
        let displayId = '';

        if (runIdLink) {
          const href = runIdLink.getAttribute('href') || '';
          displayId = runIdLink.textContent?.trim() || '';

          // Extract UUID from URL like: /payhub/calculation-engine/group-runs/8f1ee508-331d-4a6a-b94e-a6a7ea909e5c
          const match = href.match(/group-runs\/([a-f0-9A-F-]+)/i);
          if (match) {
            runId = match[1];
          } else {
            // If no UUID in URL, use the display ID
            runId = displayId;
          }
        }

        if (!runId) {
          runId = cells[0]?.textContent?.trim() || '';
          displayId = runId;
        }

        // Column 1: Status (badge)
        const statusBadge = cells[1]?.querySelector('span, button, .badge');
        const status = statusBadge?.textContent?.trim() || cells[1]?.textContent?.trim() || '';

        // Column 2: Submission Status (badge)
        const submissionBadge = cells[2]?.querySelector('span, button, .badge');
        const submissionStatus = submissionBadge?.textContent?.trim() || cells[2]?.textContent?.trim() || '';

        // Column 3: Triggered At (date/time)
        const triggeredAt = cells[3]?.textContent?.trim() || '';

        // Column 4: Pay Period (date range or text)
        const payPeriod = cells[4]?.textContent?.trim() || '';

        return {
          id: runId,                    // UUID
          displayId: displayId,         // Short ID shown in UI
          status: status,               // SUCCEEDED, FAILED, etc.
          submissionStatus: submissionStatus, // Awaiting Approval, Not Submitted, etc.
          triggeredAt: triggeredAt,     // Date/Time
          payPeriod: payPeriod          // Pay Period
        };
      }).filter(run => run && run.id);
    });

    console.log(`   ✓ Found ${runs.length} job runs`);

    // Debug: Show first run if available
    if (runs.length > 0) {
      console.log(`   📋 Sample: ID=${runs[0].displayId || runs[0].id.substring(0, 8)}, Status=${runs[0].status}`);
    }

    return { group: group.name, runs, success: true };

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { group: group.name, runs: [], success: false, error: error.message };
  }
}

async function main() {
  // Check auth file
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(`\n❌ Authentication file not found: ${AUTH_FILE}`);
    console.log('\nPlease authenticate first:');
    console.log('   npx playwright test tests/save-auth-dev.spec.ts --headed\n');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  const allResults = [];
  const summary = {
    totalGroups: ALL_GROUPS.length,
    successful: 0,
    failed: 0,
    totalRuns: 0,
    byGroup: {}
  };

  // Fetch from each group
  for (let i = 0; i < ALL_GROUPS.length; i++) {
    const group = ALL_GROUPS[i];
    const result = await fetchGroupJobRuns(page, group);
    
    if (result.success) {
      summary.successful++;
      summary.totalRuns += result.runs.length;
      
      // Apply filters if specified
      let filteredRuns = result.runs;
      if (statusFilter) {
        filteredRuns = filteredRuns.filter(run => 
          run.status.toUpperCase().includes(statusFilter.toUpperCase())
        );
      }
      if (submissionFilter) {
        filteredRuns = filteredRuns.filter(run => 
          run.submissionStatus.includes(submissionFilter)
        );
      }

      // Save individual group file
      const filename = `${group.name.split(' ')[0].toLowerCase()}-job-runs.json`;
      fs.writeFileSync(filename, JSON.stringify(filteredRuns, null, 2));
      console.log(`   💾 Saved to: ${filename}`);
      
      summary.byGroup[group.name] = filteredRuns.length;
      allResults.push(...filteredRuns.map(run => ({ ...run, group: group.name, groupId: group.id })));
    } else {
      summary.failed++;
    }
  }

  await browser.close();

  // Save combined file
  const combinedFile = 'all-groups-job-runs.json';
  fs.writeFileSync(combinedFile, JSON.stringify(allResults, null, 2));

  // Print summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(80));
  console.log(`✓ Groups processed: ${summary.successful}/${summary.totalGroups}`);
  console.log(`✓ Total runs found: ${summary.totalRuns}`);
  console.log(`✓ Runs after filters: ${allResults.length}`);
  console.log(`\n💾 Combined file: ${combinedFile}`);
  console.log('\n' + '═'.repeat(80));
  console.log('✅ COMPLETE!');
  console.log('═'.repeat(80) + '\n');
}

main().catch(console.error);
