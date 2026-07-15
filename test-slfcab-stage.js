/**
 * Quick test to see what's on SLFCAB page in STAGE
 */

const { chromium } = require('playwright');

async function testSLFCABStage() {
  console.log('Testing SLFCAB - Pay Process in STAGE...\n');

  const browser = await chromium.launch({ headless: false }); // Show browser
  const context = await browser.newContext({ storageState: 'auth-state-stage.json' });
  const page = await context.newPage();

  const url = 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/10';
  console.log(`Navigating to: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Search for text containing "Run"
  const pageText = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, div, span, p'));
    const textsWithRun = headings
      .map(el => el.textContent?.trim())
      .filter(text => text && text.toLowerCase().includes('run'))
      .slice(0, 10);

    return {
      fullBodyIncludes: document.body.textContent?.includes('Group Job Runs'),
      textsWithRun: textsWithRun
    };
  });

  console.log('Searching for "Run" text...');
  console.log(`Body contains "Group Job Runs": ${pageText.fullBodyIncludes}`);
  console.log('Headings/text containing "run":');
  pageText.textsWithRun.forEach((text, i) => {
    console.log(`  ${i + 1}. "${text.substring(0, 80)}"`);
  });
  console.log('');

  // Try scrolling to the bottom of the page
  console.log('Scrolling to bottom of page...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  console.log('✓ Scrolled to bottom\n');

  // Check what's on the page
  const pageInfo = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    const buttons = Array.from(document.querySelectorAll('button'));
    
    const tableInfo = tables.map((table, idx) => {
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
      const rowCount = table.querySelectorAll('tbody tr').length;
      return { idx, headers, rowCount };
    });

    const buttonTexts = buttons.slice(0, 5).map(b => b.textContent?.trim().substring(0, 50));

    return {
      tableCount: tables.length,
      buttonCount: buttons.length,
      tables: tableInfo,
      firstButtons: buttonTexts,
      hasJobRunsText: document.body.textContent?.includes('Group Job Runs')
    };
  });

  console.log('📊 Page Info:');
  console.log(`   Tables found: ${pageInfo.tableCount}`);
  console.log(`   Buttons found: ${pageInfo.buttonCount}`);
  console.log(`   Has "Group Job Runs" text: ${pageInfo.hasJobRunsText}\n`);

  console.log('📋 Tables:');
  pageInfo.tables.forEach(t => {
    console.log(`   Table ${t.idx}: ${t.rowCount} rows`);
    console.log(`      Headers: [${t.headers.join(', ')}]`);
  });

  console.log('\n🔘 First 5 buttons:');
  pageInfo.firstButtons.forEach((text, i) => {
    console.log(`   ${i + 1}. "${text}"`);
  });

  // Try to find runs using the same logic as discovery script
  const runInfo = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));

    for (const table of tables) {
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
      const hasId = headers.some(h => h && h.toLowerCase() === 'id');
      const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');

      if (hasId && hasStatus) {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        console.log(`Found runs table with ${rows.length} rows`);

        // Try to find a SUCCEEDED run first
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          const statusCell = cells[1];
          const statusText = statusCell?.textContent?.trim() || '';

          const idCell = cells[0];
          const button = idCell?.querySelector('button');

          if (button) {
            const buttonText = button.textContent?.trim() || '';
            const buttonTitle = button.getAttribute('title') || '';
            const fullId = buttonTitle || buttonText;

            if (statusText.includes('SUCCEEDED')) {
              return {
                found: true,
                buttonText: buttonText,
                fullId: fullId,
                status: statusText,
                method: 'SUCCEEDED run'
              };
            }
          }
        }

        // If no SUCCEEDED run, take first run
        const firstRow = rows[0];
        if (firstRow) {
          const idCell = firstRow.querySelector('td:first-child');
          const button = idCell?.querySelector('button');

          if (button) {
            const buttonText = button.textContent?.trim() || '';
            const buttonTitle = button.getAttribute('title') || '';
            const statusCell = firstRow.querySelectorAll('td')[1];
            const statusText = statusCell?.textContent?.trim() || '';

            return {
              found: true,
              buttonText: buttonText,
              fullId: buttonTitle || buttonText,
              status: statusText,
              method: 'First run'
            };
          }
        }
      }
    }

    return { found: false };
  });

  console.log('\n🔍 Run Detection Result:');
  if (runInfo.found) {
    console.log(`   ✅ Found run!`);
    console.log(`   Method: ${runInfo.method}`);
    console.log(`   Button text: "${runInfo.buttonText}"`);
    console.log(`   Full ID: "${runInfo.fullId}"`);
    console.log(`   Status: "${runInfo.status}"`);
  } else {
    console.log(`   ❌ No runs found`);
    console.log(`   💡 The table detection logic might need adjustment`);
  }

  console.log('\n⏸️  Browser will stay open for 10 seconds for inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('\n✅ Test complete');
}

testSLFCABStage().catch(console.error);
