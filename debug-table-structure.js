/**
 * Debug script to see the actual table structure
 */

const { chromium } = require('playwright');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth-state-dev.json');
const BASE_URL = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  // Navigate to AHSHBW group (ID 2)
  const url = `${BASE_URL}calculation-set-groups/2`;
  console.log(`\n📍 Navigating to: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Wait for table
  await page.waitForSelector('table tbody tr', { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Debug: Extract table headers
  const headers = await page.evaluate(() => {
    const headerCells = Array.from(document.querySelectorAll('table thead th'));
    return headerCells.map((th, index) => ({
      index,
      text: th.textContent?.trim() || ''
    }));
  });

  console.log('📊 TABLE HEADERS:');
  console.log('═'.repeat(80));
  headers.forEach(h => {
    console.log(`Column ${h.index}: "${h.text}"`);
  });
  console.log('═'.repeat(80));

  // Debug: Extract first row data with all details
  const firstRow = await page.evaluate(() => {
    const firstRowElement = document.querySelector('table tbody tr');
    if (!firstRowElement) return null;

    const cells = Array.from(firstRowElement.querySelectorAll('td'));
    return cells.map((cell, index) => {
      const link = cell.querySelector('a');
      const button = cell.querySelector('button');
      const badge = cell.querySelector('span, .badge');
      
      return {
        index,
        textContent: cell.textContent?.trim() || '',
        hasLink: !!link,
        linkHref: link?.getAttribute('href') || '',
        linkText: link?.textContent?.trim() || '',
        hasButton: !!button,
        buttonText: button?.textContent?.trim() || '',
        hasBadge: !!badge,
        badgeText: badge?.textContent?.trim() || '',
        innerHTML: cell.innerHTML.substring(0, 200) // First 200 chars
      };
    });
  });

  console.log('\n📋 FIRST ROW DATA:');
  console.log('═'.repeat(80));
  if (firstRow) {
    firstRow.forEach(cell => {
      console.log(`\nColumn ${cell.index}:`);
      console.log(`  Text: "${cell.textContent}"`);
      if (cell.hasLink) {
        console.log(`  Link: ${cell.linkHref}`);
        console.log(`  Link Text: "${cell.linkText}"`);
      }
      if (cell.hasButton) {
        console.log(`  Button: "${cell.buttonText}"`);
      }
      if (cell.hasBadge) {
        console.log(`  Badge: "${cell.badgeText}"`);
      }
      console.log(`  HTML: ${cell.innerHTML.substring(0, 150)}...`);
    });
  } else {
    console.log('No rows found!');
  }
  console.log('═'.repeat(80));

  console.log('\n✅ Done! Press Ctrl+C to close.\n');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
  await browser.close();
}

main().catch(console.error);
