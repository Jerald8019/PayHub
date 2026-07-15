/**
 * Verify Current Group IDs from PayHub DEV
 * 
 * Usage: node scripts/verify-group-ids.js
 * 
 * This script will:
 * 1. Navigate to the Calculation Set Groups page
 * 2. Extract all group names and their IDs
 * 3. Display them in the console
 * 4. Save to verify-group-ids-output.json
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth-state-dev.json');
const BASE_URL = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/';

async function main() {
  console.log('\n' + '═'.repeat(80));
  console.log('🔍 VERIFYING CALCULATION SET GROUP IDs');
  console.log('═'.repeat(80));

  // Check auth file
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(`\n❌ Authentication file not found: ${AUTH_FILE}`);
    console.log('\nPlease authenticate first:');
    console.log('   npx playwright test tests/save-auth-dev.spec.ts --headed\n');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  try {
    // Navigate directly to the Calculation Set Groups page
    const groupsUrl = `${BASE_URL}calculation-set-groups`;
    console.log(`\n📍 Navigating to: ${groupsUrl}`);
    await page.goto(groupsUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ path: 'verify-groups-page.png', fullPage: true });
    console.log('📸 Screenshot saved: verify-groups-page.png');

    // Wait for page to fully load
    console.log('\n⏳ Waiting for table to load...');
    try {
      await page.waitForSelector('table tbody tr', { timeout: 30000 });
      console.log('✓ Table found');
    } catch (e) {
      console.log('⚠️  Table not found, trying alternative selectors...');
    }
    await page.waitForTimeout(3000);

    // Debug: Log page content
    const pageText = await page.textContent('body');
    console.log(`\n📄 Page contains ${pageText.length} characters`);
    console.log(`📄 Sample text: ${pageText.substring(0, 200)}...`);

    // Extract groups from table with multiple strategies
    console.log('\n📊 Extracting group data from page...');

    // Strategy 1: Get all links with group IDs
    const groups = await page.evaluate(() => {
      const results = [];

      // Find all links/buttons that contain "Pay Process"
      const elements = Array.from(document.querySelectorAll('a, button'));

      for (const el of elements) {
        const text = el.textContent?.trim() || '';

        if (text.includes('Pay Process')) {
          const href = el.getAttribute('href') || el.getAttribute('onclick') || '';
          const match = href.match(/calculation-set-groups[\/\\](\d+)/);

          if (match) {
            const id = match[1];
            results.push({ name: text, id });
          } else {
            // Try to find ID in nearby elements
            results.push({ name: text, id: '' });
          }
        }
      }

      // Also check table rows
      const rows = Array.from(document.querySelectorAll('table tbody tr, table tr'));
      for (const row of rows) {
        const link = row.querySelector('a[href*="calculation-set-groups"]');
        if (link) {
          const href = link.getAttribute('href') || '';
          const match = href.match(/calculation-set-groups[\/\\](\d+)/);
          const name = link.textContent?.trim() || row.textContent?.trim() || '';

          if (match && name.includes('Pay Process')) {
            const id = match[1];
            // Check if not already added
            if (!results.find(r => r.id === id && r.name === name)) {
              results.push({ name, id });
            }
          }
        }
      }

      // Remove duplicates
      const unique = [];
      const seen = new Set();

      for (const item of results) {
        const key = `${item.name}-${item.id}`;
        if (!seen.has(key) && item.id) {
          seen.add(key);
          unique.push(item);
        }
      }

      return unique.sort((a, b) => a.name.localeCompare(b.name));
    });

    console.log(`\n✅ Found ${groups.length} calculation set groups:\n`);
    console.log('═'.repeat(80));
    groups.forEach((g, i) => {
      console.log(`${String(i + 1).padStart(2)}. ${g.name.padEnd(35)} → ID: ${g.id || 'NOT FOUND'}`);
    });
    console.log('═'.repeat(80));

    // Save to file
    const outputFile = 'verify-group-ids-output.json';
    fs.writeFileSync(outputFile, JSON.stringify(groups, null, 2));
    console.log(`\n💾 Saved to: ${outputFile}`);

    // Generate code for dropdown
    console.log('\n📝 COPY THIS FOR THE DROPDOWN:\n');
    console.log('═'.repeat(80));
    groups.forEach(g => {
      if (g.id) {
        console.log(`<option value="${g.name}" data-group-id="${g.id}">${g.name}</option>`);
      }
    });
    console.log('═'.repeat(80));

    // Generate code for ALL_GROUPS array
    console.log('\n📝 COPY THIS FOR ALL_GROUPS ARRAY:\n');
    console.log('═'.repeat(80));
    console.log('const ALL_GROUPS = [');
    groups.forEach(g => {
      if (g.id) {
        console.log(`  { id: '${g.id}', name: '${g.name}' },`);
      }
    });
    console.log('];');
    console.log('═'.repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'verify-groups-error.png', fullPage: true });
    console.log('📸 Error screenshot saved: verify-groups-error.png');
  } finally {
    await browser.close();
    console.log('\n✅ Complete!\n');
  }
}

main().catch(console.error);
