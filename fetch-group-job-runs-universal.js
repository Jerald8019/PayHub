const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Universal Group Job Runs Fetcher
 * 
 * Usage:
 *   node scripts/fetch-group-job-runs-universal.js <groupName> [options]
 *   
 * Examples:
 *   node scripts/fetch-group-job-runs-universal.js "SLFCAB"
 *   node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED
 *   node scripts/fetch-group-job-runs-universal.js "Pay Process" --submission="Awaiting Approval"
 *   node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --submission="Awaiting Approval"
 *   node scripts/fetch-group-job-runs-universal.js --list  (to list all available groups)
 * 
 * Options:
 *   --status=<SUCCEEDED|FAILED>           Filter by status
 *   --submission=<status>                  Filter by submission status (e.g., "Awaiting Approval", "Not Submitted")
 *   --list                                 List all available groups and exit
 *   --output=<filename>                    Custom output filename (default: <groupname>-job-runs.json)
 */

async function fetchGroupJobRuns(options = {}) {
  const {
    groupName = null,
    statusFilter = null,
    submissionFilter = null,
    outputFile = null,
    listGroups = false,
    authStatePath = process.env.AUTH_FILE || 'auth-state-dev.json'
  } = options;

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
    console.log('\n' + '='.repeat(70));
    console.log('UNIVERSAL GROUP JOB RUNS FETCHER');
    console.log('='.repeat(70));

    // Determine environment from AUTH_FILE or ENVIRONMENT variable
    const environment = (process.env.ENVIRONMENT || 'dev').toLowerCase();
    const isDev = environment === 'dev';
    const envName = isDev ? 'DEV' : 'STAGE';

    // Navigate to base URL based on environment
    const baseUrl = isDev
      ? 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine'
      : 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine';

    console.log(`\nEnvironment: ${envName}`);
    console.log(`Navigating to: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Click on "Calculation Set Groups"
    console.log('\nNavigating to Calculation Set Groups...');
    await page.click('a:has-text("Calculation Set Groups")');
    await page.waitForTimeout(3000);

    // Wait for table to load
    console.log('\nWaiting for groups table to load...');
    await page.waitForSelector('table tbody tr', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to load all groups (lazy loading)
    console.log('Scrolling to trigger lazy loading...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(3000);

    // Get list of all available groups
    console.log('\nFetching list of available groups...');

    // Wait for content to load
    await page.waitForTimeout(2000);

    const availableGroups = await page.evaluate(() => {
      // Try multiple selectors to find group links
      let groupLinks = Array.from(document.querySelectorAll('a[href*="/calculation-set-groups/"]'));

      // If no links found, try looking in table or list
      if (groupLinks.length === 0) {
        groupLinks = Array.from(document.querySelectorAll('a')).filter(a =>
          a.href && a.href.includes('/calculation-set-groups/')
        );
      }

      return groupLinks.map(link => ({
        name: link.textContent?.trim() || '',
        href: link.href,
        id: link.href.match(/calculation-set-groups\/(\d+)/)?.[1]
      })).filter(g => g.name && g.id);
    });

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-groups-list-page.png', fullPage: true });
    console.log(`Found ${availableGroups.length} groups`);
    
    // If --list flag, show all groups and exit
    if (listGroups) {
      console.log('\n' + '='.repeat(70));
      console.log('AVAILABLE CALCULATION SET GROUPS:');
      console.log('='.repeat(70));
      availableGroups.forEach((group, idx) => {
        console.log(`${idx + 1}. ${group.name} (ID: ${group.id})`);
      });
      console.log('='.repeat(70));
      return { groups: availableGroups };
    }
    
    // Find the target group
    if (!groupName) {
      throw new Error('Group name is required. Use --list to see available groups.');
    }
    
    console.log(`\nLooking for group: "${groupName}"`);
    const targetGroup = availableGroups.find(g => 
      g.name.toLowerCase().includes(groupName.toLowerCase())
    );
    
    if (!targetGroup) {
      console.log('\n❌ Group not found!');
      console.log('\nAvailable groups:');
      availableGroups.forEach(g => console.log(`  - ${g.name}`));
      throw new Error(`Group "${groupName}" not found`);
    }
    
    console.log(`✓ Found group: ${targetGroup.name} (ID: ${targetGroup.id})`);
    
    // Click on the target group
    console.log(`\nClicking on group: ${targetGroup.name}...`);
    await page.click(`a[href*="/calculation-set-groups/${targetGroup.id}"]`);
    await page.waitForTimeout(3000);
    
    console.log(`Current URL: ${page.url()}`);
    await page.screenshot({ path: `debug-${targetGroup.id}-page.png`, fullPage: true });
    
    // Scroll to "Group Job Runs" section
    const groupJobRunsHeading = page.locator('text="Group Job Runs"');
    if (await groupJobRunsHeading.count() > 0) {
      await groupJobRunsHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      console.log('✓ Found "Group Job Runs" section');
    }
    
    // Extract job runs data
    console.log('\nExtracting job runs data...');
    const allJobRuns = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => 
          th.textContent?.trim()
        );
        
        const hasId = headers.some(h => h && h.toLowerCase() === 'id');
        const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');
        const hasSubmission = headers.some(h => h && h.toLowerCase().includes('submission'));
        
        if (hasId && hasStatus && hasSubmission) {
          const rows = Array.from(table.querySelectorAll('tbody tr'));
          
          return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            
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
              payPeriod
            };
          });
        }
      }
      
      return [];
    });
    
    if (allJobRuns.length === 0) {
      console.log('\n⚠ No job runs found for this group');
      return { jobRuns: [] };
    }
    
    console.log(`✓ Extracted ${allJobRuns.length} job runs`);
    
    // Apply filters
    let filteredRuns = [...allJobRuns];
    
    if (statusFilter) {
      console.log(`\nApplying status filter: ${statusFilter}`);
      filteredRuns = filteredRuns.filter(run => 
        run.status.toUpperCase() === statusFilter.toUpperCase()
      );
      console.log(`  ${filteredRuns.length} runs match`);
    }
    
    if (submissionFilter) {
      console.log(`\nApplying submission status filter: ${submissionFilter}`);
      filteredRuns = filteredRuns.filter(run => 
        run.submissionStatus.toLowerCase().includes(submissionFilter.toLowerCase())
      );
      console.log(`  ${filteredRuns.length} runs match`);
    }
    
    // Generate output filename
    const defaultFilename = targetGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-job-runs.json';
    const finalOutputFile = outputFile || defaultFilename;
    
    // Save all runs (unfiltered)
    const allRunsFile = `${targetGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-all-runs.json`;
    fs.writeFileSync(allRunsFile, JSON.stringify(allJobRuns, null, 2));
    console.log(`\n✓ Saved all ${allJobRuns.length} runs to: ${allRunsFile}`);
    
    // Save filtered runs
    if (statusFilter || submissionFilter) {
      fs.writeFileSync(finalOutputFile, JSON.stringify(filteredRuns, null, 2));
      console.log(`✓ Saved ${filteredRuns.length} filtered runs to: ${finalOutputFile}`);
    }
    
    // Display summary
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    
    const summary = {
      total: allJobRuns.length,
      byStatus: {},
      bySubmission: {}
    };
    
    allJobRuns.forEach(run => {
      summary.byStatus[run.status] = (summary.byStatus[run.status] || 0) + 1;
      summary.bySubmission[run.submissionStatus] = (summary.bySubmission[run.submissionStatus] || 0) + 1;
    });
    
    console.log(`\nGroup: ${targetGroup.name}`);
    console.log(`Total Runs: ${summary.total}`);
    
    console.log('\nBy Status:');
    Object.entries(summary.byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    console.log('\nBy Submission Status:');
    Object.entries(summary.bySubmission).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    if (filteredRuns.length > 0 && filteredRuns.length !== allJobRuns.length) {
      console.log(`\nFiltered Results: ${filteredRuns.length} runs`);
    }
    
    console.log('\n--- SAMPLE RUNS ---');
    const samplesToShow = Math.min(5, filteredRuns.length);
    filteredRuns.slice(0, samplesToShow).forEach((run, i) => {
      console.log(`\n${i + 1}. ${run.id}`);
      console.log(`   Status: ${run.status}`);
      console.log(`   Submission: ${run.submissionStatus}`);
      console.log(`   Triggered: ${run.triggeredAt}`);
      console.log(`   Pay Period: ${run.payPeriod}`);
    });
    
    return {
      group: targetGroup,
      allRuns: allJobRuns,
      filteredRuns: filteredRuns,
      summary
    };
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'error-universal-fetch.png', fullPage: true });
    throw error;
  } finally {
    console.log('\n' + '='.repeat(70));
    console.log('Closing browser in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    groupName: null,
    statusFilter: null,
    submissionFilter: null,
    outputFile: null,
    listGroups: false
  };
  
  for (const arg of args) {
    if (arg === '--list') {
      options.listGroups = true;
    } else if (arg.startsWith('--status=')) {
      options.statusFilter = arg.split('=')[1];
    } else if (arg.startsWith('--submission=')) {
      options.submissionFilter = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.outputFile = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
      options.groupName = arg;
    }
  }
  
  return options;
}

// Run if called directly
if (require.main === module) {
  const options = parseArgs();
  
  fetchGroupJobRuns(options)
    .then(() => {
      console.log('\n✓ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = { fetchGroupJobRuns };
