const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Fetch Group Job Runs from a specific calculation set group
 * 
 * Usage:
 *   node scripts/fetch-group-runs.js <groupId>
 *   node scripts/fetch-group-runs.js 3
 */

async function fetchGroupRuns(groupId, authStatePath = 'auth-state-dev.json') {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // Load authentication state if available
  if (fs.existsSync(authStatePath)) {
    console.log(`Loading auth state from ${authStatePath}...`);
    const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  } else {
    console.log(`Warning: Auth state file not found at ${authStatePath}`);
    console.log('You may need to login manually');
  }
  
  const page = await context.newPage();
  
  try {
    const url = `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/${groupId}`;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Fetching Group Job Runs for Group ID: ${groupId}`);
    console.log(`URL: ${url}`);
    console.log('='.repeat(60));
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for the table to be visible
    console.log('\nWaiting for table to load...');
    await page.waitForSelector('table', { timeout: 30000 });
    
    // Take a screenshot for debugging
    const screenshotPath = `debug-group-${groupId}-runs.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    // First, let's inspect the page structure to find the right table
    console.log('\nInspecting page structure...');
    const pageInfo = await page.evaluate(() => {
      const allTables = Array.from(document.querySelectorAll('table'));
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());

      const tablesInfo = allTables.map((table, idx) => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const rowCount = table.querySelectorAll('tbody tr').length;
        const firstRow = table.querySelector('tbody tr');
        const firstCells = firstRow ? Array.from(firstRow.querySelectorAll('td')).map(td => td.textContent?.trim()) : [];

        return {
          tableIndex: idx,
          headers,
          rowCount,
          firstRowSample: firstCells
        };
      });

      return {
        tableCount: allTables.length,
        headings,
        tables: tablesInfo
      };
    });

    console.log('Page structure:', JSON.stringify(pageInfo, null, 2));

    // Look for "Group Job Runs" section or heading
    console.log('\nLooking for "Group Job Runs" section...');
    const hasGroupJobRunsHeading = await page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: /group.*job.*runs/i }).count() > 0;

    if (hasGroupJobRunsHeading) {
      console.log('✓ Found "Group Job Runs" heading');
    } else {
      console.log('⚠ Could not find "Group Job Runs" heading');
      console.log('Looking for table with ID column containing hash IDs...');
    }

    // Try to find the right table - looking for one with columns like ID, Status, Submission Status, etc.
    const targetTableIndex = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));

      for (let i = 0; i < tables.length; i++) {
        const headers = Array.from(tables[i].querySelectorAll('thead th')).map(th => th.textContent?.trim().toLowerCase());

        // Look for a table with columns that match your screenshot: ID, Status, Submission Status, Triggered At, Pay Period
        if (headers.includes('id') && headers.includes('status') && (headers.includes('submission status') || headers.includes('pay period'))) {
          return i;
        }
      }

      return 0; // Default to first table
    });

    console.log(`Using table index: ${targetTableIndex}`);

    // Extract all rows from the target table
    console.log('\nExtracting table data...');
    const runs = await page.evaluate((tableIdx) => {
      const tables = document.querySelectorAll('table');
      const targetTable = tables[tableIdx];
      if (!targetTable) {
        console.log('Table not found at index', tableIdx);
        return [];
      }

      const rows = Array.from(targetTable.querySelectorAll('tbody tr'));

      return rows.map(row => {
        const cells = row.querySelectorAll('td');

        // Try to extract all cell data as-is first to see the structure
        const cellData = Array.from(cells).map(cell => {
          const text = cell.textContent?.trim() || '';
          const badges = Array.from(cell.querySelectorAll('[class*="badge"], [class*="bg-"], span[class*="text-"]')).map(b => b.textContent?.trim());
          return { text, badges };
        });

        // Based on your screenshot, the columns are:
        // 0: ID (like "A0EE8D40...")
        // 1: Status (green "SUCCEEDED" or red "FAILED" badge)
        // 2: Submission Status (blue "Awaiting Approval" badge)
        // 3: Triggered At (date/time)
        // 4: Pay Period (blue badge with period info)

        const id = cells[0]?.textContent?.trim() || '';
        const status = cells[1]?.textContent?.trim() || '';
        const submissionStatus = cells[2]?.textContent?.trim() || '';
        const triggeredAt = cells[3]?.textContent?.trim() || '';
        const payPeriod = cells[4]?.textContent?.trim() || '';

        return {
          id,
          shortId: id.substring(0, 8),
          status,
          submissionStatus,
          triggeredAt,
          payPeriod,
          _debug: cellData // Keep debug info
        };
      });
    }, targetTableIndex);
    
    console.log(`\nFound ${runs.length} runs\n`);
    
    // Display summary
    const statusCounts = runs.reduce((acc, run) => {
      acc[run.status] = (acc[run.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    const submissionCounts = runs.reduce((acc, run) => {
      acc[run.submissionStatus] = (acc[run.submissionStatus] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nSubmission Status Summary:');
    Object.entries(submissionCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    // Save to JSON files
    const allRunsPath = path.join(process.cwd(), `group-${groupId}-runs.json`);
    fs.writeFileSync(allRunsPath, JSON.stringify(runs, null, 2));
    console.log(`\nSaved all runs to: ${allRunsPath}`);
    
    // Filter and save successful runs
    const successfulRuns = runs.filter(run => run.status === 'SUCCEEDED');
    if (successfulRuns.length > 0) {
      const successfulPath = path.join(process.cwd(), `group-${groupId}-successful-runs.json`);
      fs.writeFileSync(successfulPath, JSON.stringify(successfulRuns, null, 2));
      console.log(`Saved ${successfulRuns.length} successful runs to: ${successfulPath}`);
    }
    
    // Filter and save runs awaiting approval
    const awaitingApproval = runs.filter(run => run.submissionStatus === 'Awaiting Approval');
    if (awaitingApproval.length > 0) {
      const awaitingPath = path.join(process.cwd(), `group-${groupId}-awaiting-approval.json`);
      fs.writeFileSync(awaitingPath, JSON.stringify(awaitingApproval, null, 2));
      console.log(`Saved ${awaitingApproval.length} runs awaiting approval to: ${awaitingPath}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ Successfully fetched group job runs');
    console.log('='.repeat(60) + '\n');
    
    return runs;
    
  } catch (error) {
    console.error('\n❌ Error fetching group runs:', error.message);
    await page.screenshot({ path: `error-group-${groupId}-fetch.png`, fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

// Main execution
if (require.main === module) {
  const groupId = process.argv[2] || '3';
  const authState = process.argv[3] || 'auth-state-dev.json';
  
  fetchGroupRuns(groupId, authState)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = { fetchGroupRuns };
