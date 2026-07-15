const { chromium } = require('@playwright/test');
const fs = require('fs');

/**
 * Debug script to find where the Group Job Runs table actually is
 */

async function debugFindJobRuns() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  
  const authPath = 'auth-state-dev.json';
  if (fs.existsSync(authPath)) {
    const authState = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
    await context.addCookies(authState.cookies);
  }
  
  const page = await context.newPage();
  
  const url = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/3';
  
  console.log('\n' + '='.repeat(70));
  console.log('DEBUGGING: Finding Group Job Runs Table');
  console.log('='.repeat(70));
  console.log(`\nNavigating to: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-initial-page.png', fullPage: true });
  console.log('Screenshot 1: debug-initial-page.png');
  
  // Check page content
  const pageContent = await page.evaluate(() => {
    const allText = document.body.textContent || '';
    return {
      hasGroupJobRuns: allText.includes('Group Job Runs'),
      hasRecentJobRuns: allText.includes('Recent Job Runs'),
      hasSLFCAB: allText.includes('SLFCAB'),
      hasPayProcess: allText.includes('Pay Process'),
      title: document.title,
      url: window.location.href
    };
  });
  
  console.log('\nPage Content Check:');
  console.log(`  Title: ${pageContent.title}`);
  console.log(`  URL: ${pageContent.url}`);
  console.log(`  Has "Group Job Runs": ${pageContent.hasGroupJobRuns}`);
  console.log(`  Has "Recent Job Runs": ${pageContent.hasRecentJobRuns}`);
  console.log(`  Has "SLFCAB": ${pageContent.hasSLFCAB}`);
  console.log(`  Has "Pay Process": ${pageContent.hasPayProcess}`);
  
  // Navigate to Calculation Set Groups
  console.log('\nClicking on "Calculation Set Groups"...');
  const calcGroupsLink = page.locator('a:has-text("Calculation Set Groups")').first();
  await calcGroupsLink.click();
  await page.waitForTimeout(3000);

  console.log(`URL after clicking: ${page.url()}`);
  await page.screenshot({ path: 'debug-calc-groups-list.png', fullPage: true });
  console.log('Screenshot: debug-calc-groups-list.png');

  // Look for SLFCAB in the list
  console.log('\nLooking for SLFCAB link in the groups list...');
  const slfcabLink = page.locator('a:has-text("SLFCAB")').first();
  const linkExists = await slfcabLink.count() > 0;
  
  if (linkExists) {
    console.log('✓ Found SLFCAB link, clicking...');
    await slfcabLink.click();
    await page.waitForTimeout(3000);
    
    const newUrl = page.url();
    console.log(`New URL after click: ${newUrl}`);
    
    await page.screenshot({ path: 'debug-after-slfcab-click.png', fullPage: true });
    console.log('Screenshot 2: debug-after-slfcab-click.png');
    
    // Check for Group Job Runs now
    const afterClickContent = await page.evaluate(() => {
      const allText = document.body.textContent || '';
      const tables = Array.from(document.querySelectorAll('table'));
      const tableInfo = tables.map(t => ({
        headers: Array.from(t.querySelectorAll('thead th')).map(th => th.textContent?.trim()),
        rowCount: t.querySelectorAll('tbody tr').length
      }));
      
      return {
        hasGroupJobRuns: allText.includes('Group Job Runs'),
        tables: tableInfo
      };
    });
    
    console.log(`\nAfter clicking SLFCAB:`);
    console.log(`  Has "Group Job Runs": ${afterClickContent.hasGroupJobRuns}`);
    console.log(`  Tables found: ${afterClickContent.tables.length}`);
    
    afterClickContent.tables.forEach((t, i) => {
      console.log(`\n  Table ${i}:`);
      console.log(`    Headers: [${t.headers.join(', ')}]`);
      console.log(`    Rows: ${t.rowCount}`);
    });
    
    // If we found Group Job Runs, try to extract the data
    if (afterClickContent.hasGroupJobRuns) {
      console.log('\n✓ Found "Group Job Runs" text! Looking for the table...');
      
      const jobRuns = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        
        for (const table of tables) {
          const headers = Array.from(table.querySelectorAll('thead th')).map(th => 
            th.textContent?.trim()
          );
          
          // Look for table with ID and Submission Status columns
          if (headers.some(h => h === 'ID') && headers.some(h => h?.includes('Submission'))) {
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            return rows.map(row => {
              const cells = Array.from(row.querySelectorAll('td'));
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
        return [];
      });
      
      if (jobRuns.length > 0) {
        console.log(`\n✓✓✓ SUCCESS! Found ${jobRuns.length} job runs!`);
        console.log('\nSample:');
        jobRuns.slice(0, 3).forEach((run, i) => {
          console.log(`${i + 1}. ${run.id} - ${run.status}`);
        });
        
        fs.writeFileSync('debug-job-runs-found.json', JSON.stringify(jobRuns, null, 2));
        console.log('\nSaved to: debug-job-runs-found.json');
      }
    }
  } else {
    console.log('⚠ SLFCAB link not found');
    
    // List all links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).slice(0, 20).map(a => ({
        text: a.textContent?.trim(),
        href: a.href
      }));
    });
    
    console.log('\nAvailable links (first 20):');
    links.forEach(link => {
      if (link.text) {
        console.log(`  - ${link.text}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('Browser will stay open for 30 seconds for inspection...');
  console.log('='.repeat(70));
  
  await page.waitForTimeout(30000);
  await browser.close();
}

debugFindJobRuns()
  .then(() => console.log('\nDone!'))
  .catch(err => console.error('\nError:', err));
