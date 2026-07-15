const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Fetch actual Group Job Runs by clicking into a calculation set
 * 
 * Usage:
 *   node scripts/fetch-actual-job-runs.js <groupId> <calcSetNumber>
 *   node scripts/fetch-actual-job-runs.js 3 377
 */

async function fetchActualJobRuns(groupId, calcSetNumber, authStatePath = 'auth-state-dev.json') {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // Load authentication state if available
  if (fs.existsSync(authStatePath)) {
    console.log(`Loading auth state from ${authStatePath}...`);
    const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  }
  
  const page = await context.newPage();
  
  try {
    const url = `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/${groupId}`;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Fetching Job Runs for Group ID: ${groupId}`);
    console.log(`URL: ${url}`);
    console.log('='.repeat(60));
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('table', { timeout: 30000 });
    
    console.log('\nLooking for all sections and tables on the page...');
    
    // Check if there are multiple sections or if we need to navigate
    const pageStructure = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim()
      }));
      
      const tables = Array.from(document.querySelectorAll('table'));
      const tableInfo = tables.map((table, idx) => ({
        index: idx,
        headers: Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim()),
        rowCount: table.querySelectorAll('tbody tr').length
      }));
      
      return { sections, tables: tableInfo };
    });
    
    console.log('\nPage sections:');
    pageStructure.sections.forEach(s => console.log(`  ${s.tag}: ${s.text}`));
    
    console.log('\nTables found:');
    pageStructure.tables.forEach(t => {
      console.log(`  Table ${t.index}: ${t.rowCount} rows`);
      console.log(`    Headers: ${t.headers.join(', ')}`);
    });
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-page-initial.png', fullPage: true });
    console.log('\nScreenshot saved: debug-page-initial.png');
    
    // If we have a calc set number, try to click on it
    if (calcSetNumber) {
      console.log(`\nLooking for calculation set #${calcSetNumber}...`);
      const calcSetButton = page.locator(`button:has-text("#${calcSetNumber}")`).first();
      const buttonExists = await calcSetButton.count() > 0;
      
      if (buttonExists) {
        console.log(`Found calculation set #${calcSetNumber}, clicking...`);
        await calcSetButton.click();
        await page.waitForTimeout(2000); // Wait for navigation/content to load
        
        await page.screenshot({ path: 'debug-after-click.png', fullPage: true });
        console.log('Screenshot saved: debug-after-click.png');
        
        // Check if URL changed or new content appeared
        const newUrl = page.url();
        console.log(`Current URL: ${newUrl}`);
      }
    }
    
    // Now look for the Group Job Runs table
    console.log('\nLooking for Group Job Runs table...');
    const jobRunsTable = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      
      // Look for table with headers: ID, Status, Submission Status, Triggered At, Pay Period
      for (let i = 0; i < tables.length; i++) {
        const headers = Array.from(tables[i].querySelectorAll('thead th')).map(th => th.textContent?.trim().toLowerCase());
        
        if (headers.includes('id') && headers.includes('status')) {
          console.log('Found potential job runs table with headers:', headers);
          
          const rows = Array.from(tables[i].querySelectorAll('tbody tr'));
          return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
              id: cells[0]?.textContent?.trim() || '',
              status: cells[1]?.textContent?.trim() || '',
              submissionStatus: cells[2]?.textContent?.trim() || '',
              triggeredAt: cells[3]?.textContent?.trim() || '',
              payPeriod: cells[4]?.textContent?.trim() || ''
            };
          });
        }
      }
      
      return null;
    });
    
    if (jobRunsTable && jobRunsTable.length > 0) {
      console.log(`\n✓ Found ${jobRunsTable.length} job runs!`);
      
      // Save to file
      const outputPath = path.join(process.cwd(), `group-${groupId}-job-runs.json`);
      fs.writeFileSync(outputPath, JSON.stringify(jobRunsTable, null, 2));
      console.log(`Saved to: ${outputPath}`);
      
      // Show sample
      console.log('\nSample runs:');
      jobRunsTable.slice(0, 3).forEach((run, i) => {
        console.log(`\n${i + 1}. ID: ${run.id}`);
        console.log(`   Status: ${run.status}`);
        console.log(`   Submission: ${run.submissionStatus}`);
      });
      
      return jobRunsTable;
    } else {
      console.log('\n⚠ Could not find Group Job Runs table');
      console.log('Please check the screenshots to see what\'s on the page');
      return [];
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
    throw error;
  } finally {
    // Keep browser open for inspection
    console.log('\nBrowser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    await browser.close();
  }
}

// Main execution
if (require.main === module) {
  const groupId = process.argv[2] || '3';
  const calcSetNumber = process.argv[3]; // Optional
  const authState = process.argv[4] || 'auth-state-dev.json';
  
  fetchActualJobRuns(groupId, calcSetNumber, authState)
    .then(() => {
      console.log('\nDone!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = { fetchActualJobRuns };
