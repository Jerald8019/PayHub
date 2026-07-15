/**
 * Test Earning Codes Discovery for SLFCAB in STAGE
 * Quick test to verify the discovery logic works before running all 15 groups
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function testDiscoverSLFCAB() {
  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log('🔍 TEST: Discovering Earning Codes in SLFCAB (STAGE)');
  console.log('════════════════════════════════════════════════════════════════════════════════');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // Load STAGE auth
  const authState = JSON.parse(fs.readFileSync('auth-state-stage.json', 'utf-8'));
  await context.addCookies(authState.cookies);
  
  const page = await context.newPage();
  
  try {
    const groupUrl = 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/10';
    console.log(`\n📍 Navigating to: ${groupUrl}`);
    
    await page.goto(groupUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(3000);
    
    // Scroll to "Group Job Runs" section
    console.log('📜 Scrolling to "Group Job Runs" section...');
    try {
      const groupJobRunsHeading = page.locator('text="Group Job Runs"');
      if (await groupJobRunsHeading.count() > 0) {
        await groupJobRunsHeading.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        console.log('   ✓ Scrolled to section');
      }
      
      await page.waitForSelector('table tbody tr', { timeout: 10000 });
      console.log('   ✓ Table loaded\n');
    } catch (e) {
      console.log('   ⚠️  Runs table not found\n');
    }
    
    // Check page info
    const pageInfo = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        tableCount: tables.length,
        buttonCount: buttons.length,
        hasJobRunsText: document.body.textContent?.includes('Group Job Runs') || false,
        firstButtonText: buttons[0]?.textContent?.substring(0, 50) || 'No buttons'
      };
    });
    console.log(`📊 Page Info:`);
    console.log(`   Tables: ${pageInfo.tableCount}`);
    console.log(`   Buttons: ${pageInfo.buttonCount}`);
    console.log(`   Has "Group Job Runs": ${pageInfo.hasJobRunsText}\n`);
    
    // Find runs using the correct table structure
    const runInfo = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim());
        const hasId = headers.some(h => h && h.toLowerCase() === 'id');
        const hasStatus = headers.some(h => h && h.toLowerCase() === 'status');
        const hasSubmission = headers.some(h => h && h.toLowerCase().includes('submission'));
        
        if (hasId && hasStatus && hasSubmission) {
          const rows = Array.from(table.querySelectorAll('tbody tr'));
          console.log(`Found runs table with ${rows.length} rows`);
          
          // Try to find a SUCCEEDED run
          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) continue;
            
            const idCell = cells[0];
            const statusCell = cells[1];
            const statusText = statusCell?.textContent?.trim() || '';
            
            // Get run ID from button, link, or text
            let runId = '';
            let clickableElement = null;
            
            const button = idCell.querySelector('button');
            if (button) {
              runId = button.getAttribute('title') || button.textContent?.trim() || '';
              clickableElement = button;
            } else {
              const link = idCell.querySelector('a');
              if (link) {
                runId = link.getAttribute('title') || link.textContent?.trim() || '';
                clickableElement = link;
              } else {
                runId = idCell.textContent?.trim() || '';
              }
            }
            
            if (runId && statusText.includes('SUCCEEDED')) {
              return {
                found: true,
                runId: runId,
                clickText: runId.substring(0, 20),
                status: statusText,
                hasButton: !!button
              };
            }
          }
          
          // If no SUCCEEDED, take first run
          const firstRow = rows[0];
          if (firstRow) {
            const cells = firstRow.querySelectorAll('td');
            if (cells.length >= 2) {
              const idCell = cells[0];
              const statusCell = cells[1];
              
              let runId = '';
              const button = idCell.querySelector('button');
              if (button) {
                runId = button.getAttribute('title') || button.textContent?.trim() || '';
              } else {
                const link = idCell.querySelector('a');
                if (link) {
                  runId = link.getAttribute('title') || link.textContent?.trim() || '';
                } else {
                  runId = idCell.textContent?.trim() || '';
                }
              }
              
              if (runId) {
                return {
                  found: true,
                  runId: runId,
                  clickText: runId.substring(0, 20),
                  status: statusCell?.textContent?.trim() || '',
                  hasButton: !!button
                };
              }
            }
          }
        }
      }
      
      return { found: false };
    });
    
    console.log(`🔍 Run Detection:`);
    if (runInfo.found) {
      console.log(`   ✅ Found run: ${runInfo.runId.substring(0, 20)}...`);
      console.log(`   Status: ${runInfo.status}`);
      console.log(`   Has button: ${runInfo.hasButton}\n`);
    } else {
      console.log(`   ❌ No runs found\n`);
    }
    
    console.log('⏸️  Browser will stay open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testDiscoverSLFCAB().catch(console.error);
