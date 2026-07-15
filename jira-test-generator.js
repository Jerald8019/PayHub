#!/usr/bin/env node

/**
 * Jira Acceptance Criteria to Playwright Test Generator
 * 
 * Usage:
 *   node scripts/jira-test-generator.js
 *   (Interactive mode - paste your Jira acceptance criteria)
 * 
 * Or with file:
 *   node scripts/jira-test-generator.js acceptance-criteria.txt
 * 
 * Acceptance Criteria Format Examples:
 * 
 * Format 1 - Given/When/Then:
 *   Given I am logged in as an admin
 *   When I navigate to Global Adjustment Header
 *   And I click "Add New"
 *   Then I should see the adjustment form
 * 
 * Format 2 - Bullet points:
 *   - User can search for customer by ID
 *   - Search results display customer name and details
 *   - User can click on customer to view full profile
 * 
 * Format 3 - Numbered list:
 *   1. Navigate to customer search page
 *   2. Enter customer ID "700"
 *   3. Click search button
 *   4. Verify customer appears in results
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Parse Jira acceptance criteria into structured test data
 */
function parseAcceptanceCriteria(criteriaText) {
  const lines = criteriaText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const parsed = {
    testName: '',
    scenarios: [],
    needsAuth: false,
    testData: {}
  };

  let currentScenario = null;
  
  for (const line of lines) {
    // Detect Given/When/Then format
    if (line.match(/^(Given|When|Then|And)\s+/i)) {
      const match = line.match(/^(Given|When|Then|And)\s+(.+)/i);
      const keyword = match[1].toLowerCase();
      const text = match[2];
      
      if (keyword === 'given') {
        currentScenario = { given: text, when: [], then: [] };
        parsed.scenarios.push(currentScenario);
        
        // Check if authentication is needed
        if (text.match(/logged in|authenticated|signed in/i)) {
          parsed.needsAuth = true;
        }
      } else if (keyword === 'when' || keyword === 'and') {
        if (currentScenario) {
          currentScenario.when.push(text);
        }
      } else if (keyword === 'then') {
        if (currentScenario) {
          currentScenario.then.push(text);
        }
      }
      
      // Extract test data (numbers, IDs, etc.)
      const dataMatch = text.match(/"([^"]+)"|'([^']+)'|(\d{3,})/g);
      if (dataMatch) {
        dataMatch.forEach(data => {
          const cleanData = data.replace(/['"]/g, '');
          if (!parsed.testData[cleanData]) {
            parsed.testData[cleanData] = cleanData;
          }
        });
      }
    }
    // Detect bullet points or numbered lists
    else if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
      const text = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      
      if (!currentScenario) {
        currentScenario = { given: 'User is on the application', when: [], then: [] };
        parsed.scenarios.push(currentScenario);
      }
      
      // Classify as action or assertion
      if (text.match(/should|verify|check|see|display|appear|show/i)) {
        currentScenario.then.push(text);
      } else {
        currentScenario.when.push(text);
      }
      
      // Check for auth keywords
      if (text.match(/login|logged in|authenticate/i)) {
        parsed.needsAuth = true;
      }
      
      // Extract test data
      const dataMatch = text.match(/"([^"]+)"|'([^']+)'|(\d{3,})/g);
      if (dataMatch) {
        dataMatch.forEach(data => {
          const cleanData = data.replace(/['"]/g, '');
          if (!parsed.testData[cleanData]) {
            parsed.testData[cleanData] = cleanData;
          }
        });
      }
    }
  }
  
  // Generate test name from first scenario
  if (parsed.scenarios.length > 0) {
    const firstScenario = parsed.scenarios[0];
    // Use first action or first assertion for test name
    const mainAction = firstScenario.when[0] || firstScenario.then[0] || firstScenario.given;
    parsed.testName = mainAction ? mainAction.substring(0, 80) : 'Feature Test';
  }

  return parsed;
}

/**
 * Generate Playwright test code from parsed criteria
 */
function generateTestCode(parsed) {
  const imports = parsed.needsAuth
    ? `import { test, expect } from '../fixtures/auth';`
    : `import { test, expect } from '@playwright/test';`;

  const pageParam = parsed.needsAuth ? '{ authenticatedPage: page }' : '{ page }';

  // Generate test data constants
  let dataConstants = '';
  if (Object.keys(parsed.testData).length > 0) {
    const dataEntries = Object.entries(parsed.testData)
      .map(([key, value]) => {
        const varName = key.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        return `  ${varName}: '${value}'`;
      })
      .join(',\n');

    dataConstants = `\nconst TEST_DATA = {\n${dataEntries}\n};\n`;
  }

  // Generate test cases from scenarios
  const testCases = parsed.scenarios.map((scenario, index) => {
    // Create a concise test name from the main action
    let testName = 'complete the workflow';
    if (scenario.when.length > 0) {
      testName = scenario.when[0].substring(0, 60);
    } else if (scenario.then.length > 0) {
      testName = scenario.then[0].substring(0, 60);
    }

    // Remove common prefixes
    testName = testName.replace(/^(I |User |Admin |The user )/i, '');

    const steps = [];

    // Add setup step only if it's meaningful
    if (scenario.given && scenario.given !== 'User is on the application' && !scenario.given.match(/logged in|authenticated/i)) {
      steps.push(`    await test.step('Setup: ${scenario.given}', async () => {
      // TODO: Implement setup
      // ${scenario.given}
    });`);
    }

    // Add action steps
    if (scenario.when.length > 0) {
      steps.push(`    await test.step('Perform actions', async () => {
      // TODO: Implement actions
${scenario.when.map(action => `      // ${action}`).join('\n')}
    });`);
    }

    // Add assertion steps
    if (scenario.then.length > 0) {
      steps.push(`    await test.step('Verify results', async () => {
      // TODO: Add assertions
${scenario.then.map(assertion => `      // ${assertion}`).join('\n')}

      // Placeholder assertion - replace with actual checks
      await expect(page).toHaveURL(/.*ashleynet.com.*/);
    });`);
    }

    return `  test('should ${testName}', async (${pageParam}) => {
    test.setTimeout(120000);

${steps.join('\n\n')}
  });`;
  }).join('\n\n');

  const featureName = parsed.testName || 'Feature';

  return `${imports}

/**
 * ${featureName} Tests
 * Generated from Jira acceptance criteria
 */
${dataConstants}
test.describe('${featureName}', () => {
${testCases}
});
`;
}

/**
 * Main interactive function
 */
async function main() {
  console.log('🎯 Jira Acceptance Criteria to Playwright Test Generator\n');

  // Check if file argument provided
  const fileArg = process.argv[2];
  let criteriaText = '';

  if (fileArg && fs.existsSync(fileArg)) {
    console.log(`📄 Reading from file: ${fileArg}\n`);
    criteriaText = fs.readFileSync(fileArg, 'utf-8');

    // Skip the interactive prompt for file input
    console.log('🔍 Parsing acceptance criteria...\n');
    const parsed = parseAcceptanceCriteria(criteriaText);

    console.log('📊 Parsed Information:');
    console.log(`  - Test Name: ${parsed.testName}`);
    console.log(`  - Scenarios: ${parsed.scenarios.length}`);
    console.log(`  - Needs Auth: ${parsed.needsAuth ? 'Yes' : 'No'}`);
    console.log(`  - Test Data: ${Object.keys(parsed.testData).length} items`);
    console.log('');

    const testName = await question('Enter test file name (or press Enter to auto-generate): ');
    rl.close();

    generateAndSaveTest(parsed, testName);
    return;
  } else {
    console.log('Paste your Jira acceptance criteria below.');
    console.log('Supported formats:');
    console.log('  - Given/When/Then');
    console.log('  - Bullet points (-, *, •)');
    console.log('  - Numbered lists (1., 2., 3.)');
    console.log('\nPress Enter twice when done:\n');

    const lines = [];
    let emptyLineCount = 0;

    for await (const line of rl) {
      if (line.trim() === '') {
        emptyLineCount++;
        if (emptyLineCount >= 2) break;
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    }

    criteriaText = lines.join('\n');
  }

  if (!criteriaText.trim()) {
    console.error('❌ No acceptance criteria provided');
    rl.close();
    process.exit(1);
  }

  console.log('\n🔍 Parsing acceptance criteria...\n');
  const parsed = parseAcceptanceCriteria(criteriaText);

  console.log('📊 Parsed Information:');
  console.log(`  - Test Name: ${parsed.testName}`);
  console.log(`  - Scenarios: ${parsed.scenarios.length}`);
  console.log(`  - Needs Auth: ${parsed.needsAuth ? 'Yes' : 'No'}`);
  console.log(`  - Test Data: ${Object.keys(parsed.testData).length} items`);
  console.log('');

  const testName = await question('Enter test file name (or press Enter to auto-generate): ');
  rl.close();

  generateAndSaveTest(parsed, testName);
}

/**
 * Generate and save test file
 */
function generateAndSaveTest(parsed, testName) {
  console.log('\n🔨 Generating test...\n');

  const testCode = generateTestCode(parsed);

  const filename = (testName || parsed.testName)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '.spec.ts';

  const filepath = path.join(__dirname, '..', 'tests', filename);
  fs.writeFileSync(filepath, testCode);

  console.log('✅ Test generated successfully!');
  console.log('📁 File:', filepath);
  console.log('\n' + '='.repeat(60));
  console.log(testCode);
  console.log('='.repeat(60));
  console.log('\n💡 Next steps:');
  console.log(`   1. Review the generated test: ${filename}`);
  console.log(`   2. Implement the TODO sections with actual selectors and actions`);
  console.log(`   3. Run it: npx playwright test ${filename}`);
  console.log(`   4. Adjust as needed\n`);
}

main().catch(console.error);


