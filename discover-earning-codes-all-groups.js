/**
 * Discover UKG Earning Codes Across All 15 Calculation Set Groups
 * 
 * This script:
 * 1. Navigates to each of the 15 calculation set groups
 * 2. Opens the most recent SUCCEEDED run
 * 3. Extracts all UKG Pro Earning Codes from the "Review Staged Earnings" page
 * 4. Saves a comprehensive report of which codes exist in which groups
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Get environment from environment variable (default to 'dev')
const environment = (process.env.ENVIRONMENT || 'dev').toLowerCase();
const isDev = environment === 'dev';
const envName = isDev ? 'DEV' : 'STAGE';

// Environment-specific configuration
const config = {
  baseUrl: isDev
    ? 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine'
    : 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine',
  authFile: isDev ? 'auth-state-dev.json' : 'auth-state-stage.json'
};

// All 15 calculation set groups (DEV IDs - STAGE may differ)
const ALL_GROUPS_DEV = [
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

const ALL_GROUPS_STAGE = [
  { id: '1', name: 'AGRHBW - Pay Process' },
  { id: '2', name: 'AHSHBW - Pay Process' },
  { id: '15', name: 'DSGHRL - Pay Process' },
  { id: '16', name: 'DSGSAL - Pay Process' },
  { id: '17', name: 'DSMHRL - Pay Process' },
  { id: '5', name: 'ECMHBW - Pay Process' },
  { id: '6', name: 'KWFHBW - Pay Process' },
  { id: '13', name: 'KWFSBW - Pay Process' },
  { id: '7', name: 'RLFHBW - Pay Process' },
  { id: '12', name: 'RLFSBW - Pay Process' },
  { id: '10', name: 'SLFCAB - Pay Process' },
  { id: '14', name: 'SLFNSB - Pay Process' },
  { id: '11', name: 'SLFNVB - Pay Process' },
  { id: '8', name: 'SWFHBW - Pay Process' },
  { id: '9', name: 'SWFSBW - Pay Process' }
];

const ALL_GROUPS = isDev ? ALL_GROUPS_DEV : ALL_GROUPS_STAGE;

async function discoverEarningCodes() {
  console.log('═'.repeat(80));
  console.log(`🔍 DISCOVERING UKG EARNING CODES ACROSS ALL 15 GROUPS (${envName})`);
  console.log('═'.repeat(80));
  console.log(`🌍 Environment: ${envName}`);
  console.log(`🔗 Base URL: ${config.baseUrl}`);
  console.log(`🔑 Auth File: ${config.authFile}`);
  console.log('═'.repeat(80));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: config.authFile });
  const page = await context.newPage();

  const results = {
    environment: envName,
    timestamp: new Date().toISOString(),
    groups: []
  };

  const allEarningCodes = new Set();

  for (let i = 0; i < ALL_GROUPS.length; i++) {
    const group = ALL_GROUPS[i];
    console.log(`\n[${ i + 1}/15] 📂 ${group.name} (ID: ${group.id})`);
    
    try {
      // Navigate to group
      const groupUrl = `${config.baseUrl}/calculation-set-groups/${group.id}`;
      console.log(`   🔗 ${groupUrl}`);
      await page.goto(groupUrl, { waitUntil: 'domcontentloaded', timeout: 120000 }); // Increased to 120 seconds for slow STAGE
      await page.waitForTimeout(3000);

      // Scroll to "Group Job Runs" section to trigger lazy loading
      try {
        const groupJobRunsHeading = page.locator('text="Group Job Runs"');
        if (await groupJobRunsHeading.count() > 0) {
          await groupJobRunsHeading.scrollIntoViewIfNeeded();
          await page.waitForTimeout(2000); // Wait for content to load after scroll
          console.log(`   ✓ Scrolled to "Group Job Runs" section`);
        }

        // Now wait for the table to appear
        await page.waitForSelector('table tbody tr', { timeout: 10000 });
        console.log(`   ✓ Runs table loaded`);
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`   ⚠️  Runs table not found`);
      }

      // Debug: Check what's on the page
      const pageInfo = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const buttons = Array.from(document.querySelectorAll('button'));
        return {
          tableCount: tables.length,
          buttonCount: buttons.length,
          hasJobRunsText: document.body.textContent?.includes('Group Job Runs') || false,
          firstButtonText: buttons[0]?.textContent?.substring(0, 50) || 'No buttons'
        };
      });
      console.log(`   📊 Page has ${pageInfo.tableCount} tables, ${pageInfo.buttonCount} buttons`);

      // Find first run from the table
      const runInfo = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));

        for (const table of tables) {
          const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
          const hasId = headers.some(h => h && h.toLowerCase() === 'id');
          const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');
          const hasSubmission = headers.some(h => h && h.toLowerCase().includes('submission'));

          // This is the Group Job Runs table (has ID, Status, and Submission Status columns)
          if (hasId && hasStatus && hasSubmission) {
            const rows = Array.from(table.querySelectorAll('tbody tr'));

            // Try to find a SUCCEEDED run first
            for (const row of rows) {
              const cells = row.querySelectorAll('td');
              if (cells.length < 2) continue;

              const idCell = cells[0];
              const statusCell = cells[1];
              const statusText = statusCell?.textContent?.trim() || '';

              // Get run ID from button, link, or plain text
              let runId = '';
              let clickableElement = null;

              // Try button first
              const button = idCell.querySelector('button');
              if (button) {
                runId = button.getAttribute('title') || button.textContent?.trim() || '';
                clickableElement = button;
              } else {
                // Try link
                const link = idCell.querySelector('a');
                if (link) {
                  runId = link.getAttribute('title') || link.textContent?.trim() || '';
                  clickableElement = link;
                } else {
                  // Try plain text
                  runId = idCell.textContent?.trim() || '';
                  clickableElement = idCell;
                }
              }

              // Prefer SUCCEEDED runs
              if (runId && statusText.includes('SUCCEEDED')) {
                return {
                  found: true,
                  runId: runId,
                  clickText: runId.substring(0, 20), // Use first 20 chars for clicking
                  status: statusText,
                  hasButton: !!button
                };
              }
            }

            // If no SUCCEEDED run, take first run with an ID
            const firstRow = rows[0];
            if (firstRow) {
              const cells = firstRow.querySelectorAll('td');
              if (cells.length >= 2) {
                const idCell = cells[0];
                const statusCell = cells[1];

                // Get run ID
                let runId = '';
                const button = idCell.querySelector('button');
                if (button) {
                  runId = button.getAttribute('title') || button.textContent?.trim() || '';
                } else {
                  const link = idCell.querySelector('a');
                  if (link) {
                    runId = link.getAttribute('title') || link.textContent?.trim() || '';
                  } else {
                    runId = idCell.textContent?.trim() || '';
                  }
                }

                if (runId) {
                  return {
                    found: true,
                    runId: runId,
                    clickText: runId.substring(0, 20),
                    status: statusCell?.textContent?.trim() || '',
                    hasButton: !!button
                  };
                }
              }
            }
          }
        }

        return { found: false };
      });

      if (!runInfo.found) {
        console.log(`   ⚠️  No runs found - skipping`);
        console.log(`   💡 Debug: Check if page loaded correctly. Tables: ${pageInfo.tableCount}`);
        results.groups.push({
          name: group.name,
          id: group.id,
          status: 'NO_RUNS',
          earningCodes: []
        });
        continue;
      }

      console.log(`   ✓ Found run: ${runInfo.runId.substring(0, 50)}... (${runInfo.status})`);

      // Click the run - try button first, then link, then text
      try {
        if (runInfo.hasButton) {
          await page.locator(`button:has-text("${runInfo.clickText}")`).first().click();
        } else {
          // Try clicking a link or any element with the run ID text
          await page.locator(`a:has-text("${runInfo.clickText}")`).first().click();
        }
        await page.waitForTimeout(3000);
      } catch (e) {
        console.log(`   ⚠️  Could not click run - trying alternative method`);
        // Fallback: try clicking any element with the run ID text
        try {
          await page.locator(`text="${runInfo.clickText}"`).first().click();
          await page.waitForTimeout(3000);
        } catch (e2) {
          console.log(`   ❌ Failed to click run: ${e2.message}`);
          results.groups.push({
            name: group.name,
            id: group.id,
            status: 'CLICK_FAILED',
            error: 'Could not click run ID'
          });
          continue;
        }
      }

      // Click "Review Staged Earnings"
      const reviewButton = page.getByRole('button', { name: 'Review Staged Earnings' });
      const hasReview = await reviewButton.count() > 0;
      
      if (!hasReview) {
        console.log(`   ⚠️  No "Review Staged Earnings" button - skipping`);
        results.groups.push({
          name: group.name,
          id: group.id,
          status: 'NO_REVIEW_BUTTON',
          earningCodes: []
        });
        await page.goto(groupUrl); // Go back
        continue;
      }

      await reviewButton.click();
      await page.waitForTimeout(5000);

      // Extract earning codes from "UKG Pro Earning Codes (Staged)" table
      const earningCodes = await page.evaluate(() => {
        const codes = [];

        // Find the table with earning codes
        const tables = Array.from(document.querySelectorAll('table'));

        for (const table of tables) {
          const rows = Array.from(table.querySelectorAll('tbody tr'));

          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
              const codeText = cells[0]?.textContent?.trim() || '';

              // Filter: Earning codes are uppercase letters (may contain /, numbers)
              // Exclude: Employee IDs (6-digit numbers), 'Total' row
              const isEarningCode = codeText.match(/^[A-Z][A-Z0-9/]{2,10}$/) && // Starts with letter
                                    !codeText.match(/^\d{6}$/) && // Not 6-digit employee ID
                                    codeText !== 'Total';

              if (isEarningCode) {
                const hours = cells[1]?.textContent?.trim() || '0';
                const amount = cells[2]?.textContent?.trim() || '$0.00';

                codes.push({
                  code: codeText,
                  hours: hours,
                  amount: amount
                });
              }
            }
          }
        }

        // Remove duplicates
        const unique = [];
        const seen = new Set();
        for (const c of codes) {
          if (!seen.has(c.code)) {
            seen.add(c.code);
            unique.push(c);
          }
        }

        return unique;
      });

      console.log(`   ✓ Found ${earningCodes.length} earning codes`);
      earningCodes.forEach(ec => {
        console.log(`      - ${ec.code}`);
        allEarningCodes.add(ec.code);
      });

      results.groups.push({
        name: group.name,
        id: group.id,
        status: 'SUCCESS',
        earningCodes: earningCodes,
        count: earningCodes.length
      });

      // Go back to groups list
      await page.goto(groupUrl);
      await page.waitForTimeout(2000);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.groups.push({
        name: group.name,
        id: group.id,
        status: 'ERROR',
        error: error.message,
        earningCodes: []
      });
    }
  }

  await browser.close();

  // Generate summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 DISCOVERY SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Groups Scanned: ${ALL_GROUPS.length}`);
  console.log(`Successful Scans: ${results.groups.filter(g => g.status === 'SUCCESS').length}`);
  console.log(`Total Unique Earning Codes Found: ${allEarningCodes.size}`);
  console.log('═'.repeat(80));

  // Show all unique codes
  console.log('\n🔤 ALL UNIQUE EARNING CODES FOUND:');
  console.log('═'.repeat(80));
  const sortedCodes = Array.from(allEarningCodes).sort();
  sortedCodes.forEach((code, i) => {
    const groupsWithCode = results.groups.filter(g =>
      g.earningCodes.some(ec => ec.code === code)
    );
    console.log(`${String(i + 1).padStart(3)}. ${code.padEnd(10)} → Found in ${groupsWithCode.length} group(s)`);
  });
  console.log('═'.repeat(80));

  // Show which codes appear in which groups
  console.log('\n📋 EARNING CODES BY GROUP:');
  console.log('═'.repeat(80));
  results.groups.forEach(group => {
    if (group.status === 'SUCCESS') {
      console.log(`\n${group.name} (${group.count} codes):`);
      console.log(`   ${group.earningCodes.map(ec => ec.code).join(', ')}`);
    }
  });
  console.log('═'.repeat(80));

  // Save results
  const outputFile = `earning-codes-discovery-${envName.toLowerCase()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${outputFile}`);

  // Generate markdown summary
  const mdContent = generateMarkdownReport(results, allEarningCodes, envName);
  const mdFile = `earning-codes-discovery-${envName.toLowerCase()}.md`;
  fs.writeFileSync(mdFile, mdContent);
  console.log(`📄 Markdown report saved to: ${mdFile}`);

  console.log('\n✅ Discovery complete!');
}

function generateMarkdownReport(results, allEarningCodes, envName) {
  const sortedCodes = Array.from(allEarningCodes).sort();

  let md = `# UKG Earning Codes Discovery Report - ${envName}\n\n`;
  md += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  md += `**Environment:** ${envName}\n\n`;
  md += '---\n\n';

  md += `## 📊 Summary\n\n`;
  md += `- **Total Groups Scanned:** ${results.groups.length}\n`;
  md += `- **Successful Scans:** ${results.groups.filter(g => g.status === 'SUCCESS').length}\n`;
  md += `- **Total Unique Earning Codes:** ${sortedCodes.length}\n\n`;
  md += '---\n\n';

  md += `## 🔤 All Unique Earning Codes (${sortedCodes.length})\n\n`;
  md += '| # | Code | Found in Groups | Groups |\n';
  md += '|---|------|-----------------|--------|\n';

  sortedCodes.forEach((code, i) => {
    const groupsWithCode = results.groups.filter(g =>
      g.earningCodes.some(ec => ec.code === code)
    );
    const groupNames = groupsWithCode.map(g => g.name.split(' - ')[0]).join(', ');
    md += `| ${i + 1} | **${code}** | ${groupsWithCode.length} | ${groupNames} |\n`;
  });

  md += '\n---\n\n';
  md += `## 📂 Earning Codes by Group\n\n`;

  results.groups.forEach(group => {
    md += `### ${group.name}\n\n`;

    if (group.status === 'SUCCESS') {
      md += `**Status:** ✅ Success  \n`;
      md += `**Earning Codes Found:** ${group.count}\n\n`;
      md += '| Code | Hours | Amount |\n';
      md += '|------|-------|--------|\n';
      group.earningCodes.forEach(ec => {
        md += `| ${ec.code} | ${ec.hours} | ${ec.amount} |\n`;
      });
    } else {
      md += `**Status:** ⚠️ ${group.status}\n\n`;
      if (group.error) {
        md += `**Error:** ${group.error}\n\n`;
      }
    }
    md += '\n';
  });

  return md;
}

// Run the discovery
discoverEarningCodes().catch(console.error);
