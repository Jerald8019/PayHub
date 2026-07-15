const { chromium } = require('@playwright/test');
const fs = require('fs');

/**
 * Interactive page explorer - opens the page and lets you see what's there
 * Usage: node scripts/explore-page.js <url>
 */

async function explorePage(url, authStatePath = 'auth-state-dev.json') {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  
  if (fs.existsSync(authStatePath)) {
    const authState = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  }
  
  const page = await context.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  // Extract ALL information about the page
  const pageData = await page.evaluate(() => {
    // Get all headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      tag: h.tagName,
      text: h.textContent?.trim(),
      classes: h.className
    }));
    
    // Get all tables with detailed info
    const tables = Array.from(document.querySelectorAll('table')).map((table, idx) => {
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      
      const rowSamples = rows.slice(0, 3).map(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => ({
          text: cell.textContent?.trim(),
          hasButton: cell.querySelector('button') !== null,
          hasBadge: cell.querySelector('[class*="badge"]') !== null,
          classes: cell.className
        }));
        return cells;
      });
      
      return {
        index: idx,
        headers,
        totalRows: rows.length,
        sampleRows: rowSamples
      };
    });
    
    // Look for navigation elements
    const navItems = Array.from(document.querySelectorAll('nav a, nav button')).map(el => el.textContent?.trim());
    
    // Look for tabs
    const tabs = Array.from(document.querySelectorAll('[role="tab"], .tab, .tabs button')).map(el => el.textContent?.trim());
    
    return {
      title: document.title,
      url: window.location.href,
      headings,
      tables,
      navItems,
      tabs
    };
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('PAGE EXPLORATION RESULTS');
  console.log('='.repeat(80));
  console.log(`\nTitle: ${pageData.title}`);
  console.log(`URL: ${pageData.url}`);
  
  console.log('\n--- HEADINGS ---');
  pageData.headings.forEach(h => {
    console.log(`${h.tag}: "${h.text}"`);
  });
  
  if (pageData.tabs.length > 0) {
    console.log('\n--- TABS ---');
    pageData.tabs.forEach(tab => console.log(`  - ${tab}`));
  }
  
  if (pageData.navItems.length > 0) {
    console.log('\n--- NAVIGATION ITEMS ---');
    pageData.navItems.slice(0, 10).forEach(item => console.log(`  - ${item}`));
  }
  
  console.log('\n--- TABLES ---');
  pageData.tables.forEach(table => {
    console.log(`\nTable ${table.index}: ${table.totalRows} rows`);
    console.log(`Headers: [${table.headers.join(', ')}]`);
    
    if (table.sampleRows.length > 0) {
      console.log('Sample rows:');
      table.sampleRows.forEach((row, rowIdx) => {
        console.log(`  Row ${rowIdx + 1}:`);
        row.forEach((cell, cellIdx) => {
          const flags = [];
          if (cell.hasButton) flags.push('has button');
          if (cell.hasBadge) flags.push('has badge');
          const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
          console.log(`    Col ${cellIdx}: "${cell.text}"${flagStr}`);
        });
      });
    }
  });
  
  // Save full data to JSON
  fs.writeFileSync('page-exploration.json', JSON.stringify(pageData, null, 2));
  console.log('\n✓ Full data saved to: page-exploration.json');
  
  // Take screenshot
  await page.screenshot({ path: 'page-exploration.png', fullPage: true });
  console.log('✓ Screenshot saved to: page-exploration.png');
  
  console.log('\n' + '='.repeat(80));
  console.log('Browser will stay open for 60 seconds for manual inspection...');
  console.log('='.repeat(80) + '\n');
  
  await page.waitForTimeout(60000);
  await browser.close();
}

if (require.main === module) {
  const url = process.argv[2] || 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/3';
  
  explorePage(url)
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
