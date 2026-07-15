/**
 * Debug: See what's on the Calculation Set Groups list page
 */

const { chromium } = require('playwright');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth-state-dev.json');
const BASE_URL = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/';

async function main() {
  console.log('\n🔍 Debugging Calculation Set Groups page...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  // Navigate to groups list
  const url = `${BASE_URL}calculation-set-groups`;
  console.log(`📍 Navigating to: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(8000);

  // Check page title and URL
  const pageTitle = await page.title();
  const currentUrl = page.url();
  console.log(`📄 Page Title: ${pageTitle}`);
  console.log(`📍 Current URL: ${currentUrl}\n`);

  // Get page content summary
  const pageInfo = await page.evaluate(() => {
    return {
      hasH1: !!document.querySelector('h1'),
      h1Text: document.querySelector('h1')?.textContent?.trim() || '',
      bodyText: document.body?.textContent?.substring(0, 500) || '',
      linkCount: document.querySelectorAll('a').length,
      tableCount: document.querySelectorAll('table').length,
      buttonCount: document.querySelectorAll('button').length
    };
  });

  console.log('📊 Page Info:');
  console.log(`   H1: ${pageInfo.h1Text || 'None'}`);
  console.log(`   Links: ${pageInfo.linkCount}`);
  console.log(`   Tables: ${pageInfo.tableCount}`);
  console.log(`   Buttons: ${pageInfo.buttonCount}`);
  console.log(`\n📄 Body text preview:\n${pageInfo.bodyText}...\n`);

  // Take screenshot
  await page.screenshot({ path: 'debug-groups-list.png', fullPage: true });
  console.log('📸 Screenshot saved: debug-groups-list.png\n');

  // Debug: Extract all links
  const links = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    return allLinks.map(link => ({
      text: link.textContent?.trim() || '',
      href: link.getAttribute('href') || '',
      hasPayProcess: (link.textContent || '').includes('Pay Process')
    })).filter(l => l.href || l.hasPayProcess);
  });

  console.log('📋 ALL LINKS ON PAGE:');
  console.log('═'.repeat(80));
  links.forEach((link, i) => {
    if (link.hasPayProcess || link.href.includes('calculation-set-groups')) {
      console.log(`${i + 1}. Text: "${link.text}"`);
      console.log(`   Href: ${link.href}`);
      console.log('');
    }
  });
  console.log('═'.repeat(80));

  // Check for buttons/rows in tables
  const tableInfo = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.map((table, idx) => {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      return {
        tableIndex: idx,
        rowCount: rows.length,
        firstRowText: rows[0]?.textContent?.trim().substring(0, 100) || '',
        hasLinks: rows.some(row => row.querySelector('a'))
      };
    });
  });

  console.log('\n📊 TABLES ON PAGE:');
  console.log('═'.repeat(80));
  tableInfo.forEach(t => {
    console.log(`Table ${t.tableIndex}: ${t.rowCount} rows, Has links: ${t.hasLinks}`);
    console.log(`First row: ${t.firstRowText}...`);
    console.log('');
  });
  console.log('═'.repeat(80));

  console.log('\n✅ Done! Check the screenshot and output above.\n');
  console.log('Press Ctrl+C to close the browser.\n');
  
  // Keep browser open
  await page.waitForTimeout(300000);
  await browser.close();
}

main().catch(console.error);
