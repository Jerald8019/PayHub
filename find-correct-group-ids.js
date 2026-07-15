/**
 * Find the correct Group IDs by checking the page title
 */

const { chromium } = require('playwright');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'auth-state-dev.json');
const BASE_URL = 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine/';

// Test all possible IDs from 1 to 25
const TEST_IDS = Array.from({ length: 25 }, (_, i) => (i + 1).toString());

async function main() {
  console.log('\n' + '═'.repeat(80));
  console.log('🔍 FINDING CORRECT GROUP IDs IN DEV');
  console.log('═'.repeat(80));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();

  const results = [];

  for (const id of TEST_IDS) {
    try {
      const url = `${BASE_URL}calculation-set-groups/${id}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Get the page title/heading
      const groupName = await page.evaluate(() => {
        // Try multiple selectors
        const h1 = document.querySelector('h1');
        const heading = document.querySelector('[class*="heading"]');
        const title = document.querySelector('.page-title, .title');
        
        return h1?.textContent?.trim() || 
               heading?.textContent?.trim() || 
               title?.textContent?.trim() || 
               '';
      });

      if (groupName && groupName.includes('Pay Process')) {
        console.log(`✅ ID ${id.padStart(2)}: ${groupName}`);
        results.push({ id, name: groupName });
      } else {
        console.log(`❌ ID ${id.padStart(2)}: Not found or not a Pay Process group`);
      }
    } catch (error) {
      console.log(`❌ ID ${id.padStart(2)}: Error - ${error.message}`);
    }
  }

  await browser.close();

  console.log('\n' + '═'.repeat(80));
  console.log('📊 RESULTS - Copy this array to your scripts:');
  console.log('═'.repeat(80));
  console.log('\nconst ALL_GROUPS = [');
  results.forEach(r => {
    console.log(`  { id: '${r.id}', name: '${r.name}' },`);
  });
  console.log('];\n');
  console.log('═'.repeat(80));
}

main().catch(console.error);
