const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Fetch Group Job Runs from SLFCAB - Pay Process group
 * Navigates through the UI to find the correct page
 * Supports both DEV and STAGE environments
 */

async function fetchSLFCABJobRuns() {
  // Get environment from environment variable (default to 'dev')
  const environment = (process.env.ENVIRONMENT || 'dev').toLowerCase();
  const isDev = environment === 'dev';
  const envName = isDev ? 'DEV' : 'STAGE';

  // Environment-specific configuration
  const config = {
    baseUrl: isDev
      ? 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine'
      : 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine',
    groupId: isDev ? 3 : 10,
    authFile: isDev ? 'auth-state-dev.json' : 'auth-state-stage.json'
  };

  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();

  // Load authentication
  if (fs.existsSync(config.authFile)) {
    console.log(`Loading auth from ${config.authFile}...`);
    const authState = JSON.parse(fs.readFileSync(config.authFile, 'utf-8'));
    await context.addCookies(authState.cookies);
  }

  const page = await context.newPage();

  try {
    console.log('\n' + '='.repeat(70));
    console.log(`FETCHING SLFCAB GROUP JOB RUNS (${envName})`);
    console.log('='.repeat(70));
    console.log(`Environment: ${envName}`);
    console.log(`Base URL: ${config.baseUrl}`);
    console.log(`Group ID: ${config.groupId}`);
    console.log(`Auth File: ${config.authFile}`);
    console.log('='.repeat(70));

    // Start at home page first to ensure proper authentication
    console.log(`\nStep 1: Navigating to home page: ${config.baseUrl}`);
    await page.goto(config.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    console.log(`✓ Loaded home page: ${page.url()}`);

    // Click "Calculation Set Groups"
    console.log('\nStep 2: Clicking "Calculation Set Groups"...');
    await page.waitForSelector('text=Calculation Set Groups', { timeout: 30000 });
    await page.click('a:has-text("Calculation Set Groups")');
    await page.waitForTimeout(3000);
    console.log(`✓ Navigated to groups page: ${page.url()}`);

    // Now navigate to SLFCAB (ID 3) or click the button
    console.log('\nStep 3: Navigating to SLFCAB group...');

    // Try clicking the SLFCAB button first
    try {
      await page.waitForSelector('text=SLFCAB - Pay Process', { timeout: 10000 });
      await page.click('button:has-text("SLFCAB - Pay Process")');
      await page.waitForTimeout(4000);
      console.log(`✓ Clicked SLFCAB button: ${page.url()}`);
    } catch (e) {
      // Fallback: navigate directly
      console.log('  Button not found, trying direct URL...');
      const slfcabUrl = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/3';
      await page.goto(slfcabUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3000);
      console.log(`✓ Navigated via URL: ${page.url()}`);
    }

    console.log(`\nFinal URL: ${page.url()}`);

    // Verify we're on the SLFCAB page
    const pageTitle = await page.textContent('h1, h2, h3, h4, h5, h6');
    console.log(`Page title/heading: ${pageTitle}`);

    // Take screenshot of group page
    await page.screenshot({ path: 'debug-slfcab-page.png', fullPage: true });
    console.log('✓ Screenshot saved to debug-slfcab-page.png');
    
    // Scroll down to ensure "Group Job Runs" section is visible
    console.log('\nScrolling to "Group Job Runs" section...');
    const groupJobRunsHeading = page.locator('text="Group Job Runs"');
    if (await groupJobRunsHeading.count() > 0) {
      await groupJobRunsHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      console.log('✓ Found "Group Job Runs" section');
    }
    
    // First, debug what's on the page
    console.log('\nDebugging page content...');
    const pageDebug = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      const tableInfo = tables.map((table, idx) => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const rowCount = table.querySelectorAll('tbody tr').length;
        return { idx, headers, rowCount };
      });

      return {
        tableCount: tables.length,
        tables: tableInfo,
        hasGroupJobRunsText: document.body.textContent?.includes('Group Job Runs') || false
      };
    });

    console.log(`Tables found: ${pageDebug.tableCount}`);
    console.log(`Has "Group Job Runs" text: ${pageDebug.hasGroupJobRunsText}`);
    pageDebug.tables.forEach(t => {
      console.log(`  Table ${t.idx}: ${t.rowCount} rows, headers: [${t.headers.join(', ')}]`);
    });

    // First, let's inspect the first ID cell to find where the UUID is stored
    console.log('\nInspecting first ID cell to find UUID location...');
    const firstCellInfo = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const hasId = headers.some(h => h && h.toLowerCase() === 'id');
        const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');
        if (hasId && hasStatus) {
          const firstRow = table.querySelector('tbody tr');
          if (firstRow) {
            const idCell = firstRow.querySelector('td:first-child');
            const button = idCell?.querySelector('button');
            const link = idCell?.querySelector('a');

            return {
              cellHTML: idCell?.outerHTML.substring(0, 800),
              buttonText: button?.textContent?.trim(),
              buttonOnclick: button?.getAttribute('onclick'),
              buttonTitle: button?.getAttribute('title'),
              linkHref: link?.getAttribute('href'),
              allButtonAttrs: button ? Array.from(button.attributes).map(a => `${a.name}="${a.value.substring(0, 100)}"`).join(' | ') : null
            };
          }
        }
      }
      return null;
    });

    if (firstCellInfo) {
      console.log('First ID Cell Info:');
      console.log('  Button Text:', firstCellInfo.buttonText);
      console.log('  Button onclick:', firstCellInfo.buttonOnclick);
      console.log('  Button title:', firstCellInfo.buttonTitle);
      console.log('  Link href:', firstCellInfo.linkHref);
      console.log('  All button attributes:', firstCellInfo.allButtonAttrs);
      console.log('  Cell HTML:', firstCellInfo.cellHTML);
      console.log('');

      // Try to find UUID in any of these
      const combined = JSON.stringify(firstCellInfo);
      const uuidMatch = combined.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
      if (uuidMatch) {
        console.log(`✓ Found full UUID: ${uuidMatch[1]}\n`);
      } else {
        console.log('⚠ No full UUID found - may need to click the button to get it\n');
      }
    }

    // Extract job runs data by clicking each button to get the full URL
    console.log('\nExtracting job runs data by clicking buttons...');

    // First, get ALL row data at once
    const allRowsData = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const hasId = headers.some(h => h && h.toLowerCase() === 'id');
        const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');
        if (hasId && hasStatus) {
          const rows = table.querySelectorAll('tbody tr');
          return Array.from(rows).map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return {
              shortText: cells[0]?.textContent?.trim() || '',
              status: cells[1]?.textContent?.trim() || '',
              submissionStatus: cells[2]?.textContent?.trim() || '',
              triggeredAt: cells[3]?.textContent?.trim() || '',
              payPeriod: cells[4]?.textContent?.trim() || ''
            };
          });
        }
      }
      return [];
    });

    console.log(`Found ${allRowsData.length} rows to process...`);

    const jobRuns = [];

    for (let i = 0; i < allRowsData.length; i++) {
      console.log(`\nProcessing row ${i + 1}/${allRowsData.length}...`);

      const rowData = allRowsData[i];
      console.log(`  Short ID: ${rowData.shortText}`);
      console.log(`  Status: ${rowData.status}`);

      // Always get fresh button list after each navigation
      // Wait a bit for page to be fully loaded before querying buttons
      await page.waitForTimeout(500);
      const buttons = await page.locator('table tbody tr td:first-child button').all();
      console.log(`  Found ${buttons.length} buttons in the table`);

      if (buttons.length === 0) {
        console.log(`  ⚠ WARNING: No buttons found! Trying alternative selector...`);
        // Try a more specific selector
        const altButtons = await page.locator('table tbody button').all();
        console.log(`  Found ${altButtons.length} buttons with alternative selector`);
      }

      // Click the i-th button (matching the row index)
      if (buttons.length > i && buttons[i]) {
        // Verify the button text matches what we expect
        const buttonText = await buttons[i].textContent();
        console.log(`  Clicking button ${i} with text: ${buttonText}`);

        await buttons[i].click();
        await page.waitForTimeout(3000);

        // Get the URL which contains the full UUID
        const currentUrl = page.url();
        console.log(`  URL: ${currentUrl}`);

        // Extract UUID from URL: /group-run-details/UUID
        const uuidMatch = currentUrl.match(/\/group-run-details\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        const fullId = uuidMatch ? uuidMatch[1] : rowData.shortText;

        console.log(`  ✓ Full UUID: ${fullId}`);

        jobRuns.push({
          id: fullId,
          shortId: fullId.substring(0, 8),
          status: rowData.status,
          submissionStatus: rowData.submissionStatus,
          triggeredAt: rowData.triggeredAt,
          payPeriod: rowData.payPeriod
        });

        // Go back to the list
        console.log(`  Going back to list...`);
        await page.goBack();
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(2000);

        // Wait for table to be visible again AND wait for buttons to be clickable
        await page.waitForSelector('table tbody tr', { timeout: 10000 });
        await page.waitForSelector('table tbody tr td:first-child button', { timeout: 10000 });
        await page.waitForTimeout(2000); // Give it more time for dynamic rendering
        console.log(`  ✓ Back on list page`);
      } else {
        console.log(`  ⚠ No buttons found`);
      }
    }

    console.log(`\n✓ Extracted ${jobRuns.length} job runs!`);
    
    if (jobRuns.length > 0) {
      console.log(`\n✓ Successfully extracted ${jobRuns.length} job runs!`);
      
      // Save to file
      const outputPath = 'slfcab-group-job-runs.json';
      fs.writeFileSync(outputPath, JSON.stringify(jobRuns, null, 2));
      console.log(`\n✓ Saved all runs to: ${outputPath}`);
      
      // Show summary
      console.log('\n--- SUMMARY ---');
      const succeeded = jobRuns.filter(r => r.status === 'SUCCEEDED').length;
      const failed = jobRuns.filter(r => r.status === 'FAILED').length;
      console.log(`  SUCCEEDED: ${succeeded}`);
      console.log(`  FAILED: ${failed}`);
      console.log(`  TOTAL: ${jobRuns.length}`);
      
      console.log('\n--- SAMPLE RUNS ---');
      jobRuns.slice(0, 5).forEach((run, i) => {
        console.log(`${i + 1}. ${run.id}`);
        console.log(`   Status: ${run.status} | ${run.submissionStatus}`);
        console.log(`   Triggered: ${run.triggeredAt}`);
      });
      
      return jobRuns;
    } else {
      console.log('\n⚠ No job runs found');
      return [];
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'error-fetch.png', fullPage: true });
    throw error;
  } finally {
    console.log('\n' + '='.repeat(70));
    console.log('Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// Run
fetchSLFCABJobRuns()
  .then(() => {
    console.log('\n✓ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
