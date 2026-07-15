const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Fetch Group Job Runs from the calculation-set-groups page
 * This script will scroll and look for the actual job runs table
 */

async function fetchGroupJobRuns(groupId = '3', authStatePath = 'auth-state-dev.json') {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();
  
  // Load authentication
  if (fs.existsSync(authStatePath)) {
    console.log(`Loading auth from ${authStatePath}...`);
    const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  }
  
  const page = await context.newPage();
  
  try {
    const url = `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/${groupId}`;
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`FETCHING GROUP JOB RUNS - Group ID: ${groupId}`);
    console.log(`URL: ${url}`);
    console.log('='.repeat(70));
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Page loaded, waiting for content...');
    await page.waitForTimeout(3000);

    // Look for table or wait for it to appear
    console.log('\nWaiting for table to appear...');
    try {
      await page.waitForSelector('table', { timeout: 10000 });
      console.log('✓ Table found');
    } catch (e) {
      console.log('⚠ No table found yet, continuing anyway...');
    }

    // Scroll down to load all content
    console.log('\nScrolling page to load all content...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await page.screenshot({ path: `group-${groupId}-fullpage.png`, fullPage: true });
    console.log(`Screenshot: group-${groupId}-fullpage.png`);
    
    // Look for all sections and tables
    console.log('\nAnalyzing page structure...');
    const pageAnalysis = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim()
      }));

      const tables = Array.from(document.querySelectorAll('table')).map((table, idx) => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const rowCount = table.querySelectorAll('tbody tr').length;

        // Get first row sample
        const firstRow = table.querySelector('tbody tr');
        let firstRowSample = [];
        if (firstRow) {
          firstRowSample = Array.from(firstRow.querySelectorAll('td')).map(td => {
            const text = td.textContent?.trim() || '';
            return text.length > 50 ? text.substring(0, 50) + '...' : text;
          });
        }

        return { idx, headers, rowCount, firstRowSample };
      });

      // Also check for div-based tables or grids
      const divTables = Array.from(document.querySelectorAll('[class*="table"], [class*="grid"], [class*="data"]')).length;

      return { headings, tables, divTablesCount: divTables };
    });
    
    console.log('\n--- HEADINGS ON PAGE ---');
    pageAnalysis.headings.forEach(h => console.log(`  ${h.tag}: ${h.text}`));
    
    console.log('\n--- TABLES FOUND ---');
    pageAnalysis.tables.forEach(t => {
      console.log(`\nTable ${t.idx}: ${t.rowCount} rows`);
      console.log(`  Headers: [${t.headers.join(', ')}]`);
      if (t.firstRowSample.length > 0) {
        console.log(`  First row: [${t.firstRowSample.join(', ')}]`);
      }
    });
    
    // Now try to extract the job runs from the "Group Job Runs" section
    console.log('\n' + '='.repeat(70));
    console.log('EXTRACTING GROUP JOB RUNS DATA...');
    console.log('='.repeat(70));

    // First, try to scroll to "Group Job Runs" section
    const groupJobRunsExists = await page.locator('text="Group Job Runs"').count() > 0;
    if (groupJobRunsExists) {
      console.log('✓ Found "Group Job Runs" section, scrolling to it...');
      await page.locator('text="Group Job Runs"').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    }

    const jobRuns = await page.evaluate(() => {
      // First, find the "Group Job Runs" heading
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, div, span'));
      const groupJobRunsHeading = headings.find(h => h.textContent?.trim() === 'Group Job Runs');

      if (groupJobRunsHeading) {
        console.log('✓ Found "Group Job Runs" heading');

        // Find the nearest table after this heading
        let nextElement = groupJobRunsHeading.nextElementSibling;
        let table = null;

        // Search through next siblings to find a table
        while (nextElement && !table) {
          if (nextElement.tagName === 'TABLE') {
            table = nextElement;
          } else {
            table = nextElement.querySelector('table');
          }
          if (!table) {
            nextElement = nextElement.nextElementSibling;
          }
        }

        // Also check within the parent's children
        if (!table) {
          const parent = groupJobRunsHeading.parentElement;
          if (parent) {
            table = parent.querySelector('table');
          }
        }

        if (table) {
          console.log('✓ Found table after "Group Job Runs" heading');

          const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
          console.log('Table headers:', headers);

          const rows = Array.from(table.querySelectorAll('tbody tr'));
          console.log(`Found ${rows.length} rows`);

          const data = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));

            const id = cells[0]?.textContent?.trim() || '';
            const status = cells[1]?.textContent?.trim() || '';
            const submissionStatus = cells[2]?.textContent?.trim() || '';
            const triggeredAt = cells[3]?.textContent?.trim() || '';
            const payPeriod = cells[4]?.textContent?.trim() || '';

            return {
              id: id,
              shortId: id.substring(0, 8),
              status: status,
              submissionStatus: submissionStatus,
              triggeredAt: triggeredAt,
              payPeriod: payPeriod
            };
          });

          return data;
        }
      }

      // Fallback: Look for any table with the right column structure
      console.log('Fallback: Searching all tables for matching headers...');
      const tables = Array.from(document.querySelectorAll('table'));

      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const headers = Array.from(table.querySelectorAll('thead th')).map(th =>
          th.textContent?.trim()
        );

        console.log(`Table ${i} headers:`, headers);

        // Look for ID, Status, Submission Status columns
        const hasId = headers.some(h => h && h.toLowerCase() === 'id');
        const hasSubmissionStatus = headers.some(h => h && h.toLowerCase().includes('submission'));

        if (hasId && hasSubmissionStatus) {
          console.log(`✓ Found matching table at index ${i}`);

          const rows = Array.from(table.querySelectorAll('tbody tr'));
          const data = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));

            return {
              id: cells[0]?.textContent?.trim() || '',
              shortId: (cells[0]?.textContent?.trim() || '').substring(0, 8),
              status: cells[1]?.textContent?.trim() || '',
              submissionStatus: cells[2]?.textContent?.trim() || '',
              triggeredAt: cells[3]?.textContent?.trim() || '',
              payPeriod: cells[4]?.textContent?.trim() || ''
            };
          });

          return data;
        }
      }

      console.log('⚠ Could not find Group Job Runs table');
      return [];
    });
    
    if (jobRuns && jobRuns.length > 0) {
      console.log(`\n✓ Successfully extracted ${jobRuns.length} job runs!`);
      
      // Display summary
      const statusCounts = {};
      const submissionCounts = {};
      
      jobRuns.forEach(run => {
        statusCounts[run.status] = (statusCounts[run.status] || 0) + 1;
        submissionCounts[run.submissionStatus] = (submissionCounts[run.submissionStatus] || 0) + 1;
      });
      
      console.log('\n--- STATUS SUMMARY ---');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      console.log('\n--- SUBMISSION STATUS SUMMARY ---');
      Object.entries(submissionCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      console.log('\n--- SAMPLE RUNS ---');
      jobRuns.slice(0, 3).forEach((run, idx) => {
        console.log(`\n${idx + 1}. ID: ${run.id}`);
        console.log(`   Status: ${run.status}`);
        console.log(`   Submission: ${run.submissionStatus}`);
        console.log(`   Triggered: ${run.triggeredAt}`);
        console.log(`   Pay Period: ${run.payPeriod}`);
      });
      
      // Save all runs
      const allRunsPath = `group-${groupId}-job-runs.json`;
      fs.writeFileSync(allRunsPath, JSON.stringify(jobRuns, null, 2));
      console.log(`\n✓ Saved all runs to: ${allRunsPath}`);
      
      // Save successful runs only
      const successfulRuns = jobRuns.filter(r => r.status.toUpperCase().includes('SUCCEED'));
      if (successfulRuns.length > 0) {
        const successPath = `group-${groupId}-successful-runs.json`;
        fs.writeFileSync(successPath, JSON.stringify(successfulRuns, null, 2));
        console.log(`✓ Saved ${successfulRuns.length} successful runs to: ${successPath}`);
      }
      
      return jobRuns;
      
    } else {
      console.log('\n⚠ No job runs found');
      console.log('Please check the screenshot to see what\'s on the page');
      return [];
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'error-fetch-job-runs.png', fullPage: true });
    throw error;
    
  } finally {
    console.log('\n' + '='.repeat(70));
    console.log('Browser will stay open for 10 seconds...');
    console.log('='.repeat(70));
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  const groupId = process.argv[2] || '3';
  
  fetchGroupJobRuns(groupId)
    .then(() => {
      console.log('\n✓ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Failed:', error);
      process.exit(1);
    });
}

module.exports = { fetchGroupJobRuns };
