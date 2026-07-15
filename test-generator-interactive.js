#!/usr/bin/env node

/**
 * Interactive AI Test Generator
 * Asks questions and generates Playwright tests
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

async function main() {
  console.log('🤖 Playwright Test Generator\n');
  console.log('Answer a few questions to generate your test:\n');

  const testName = await question('1. What feature are you testing? (e.g., "Customer Search"): ');
  const actions = await question('2. What actions should the test perform? (e.g., "search for customer, verify results"): ');
  const assertions = await question('3. What should be verified? (e.g., "results table shows data, customer name visible"): ');
  const needsAuth = await question('4. Does this test need login? (yes/no): ');
  const testData = await question('5. Any specific test data? (e.g., "customer ID: 700") [optional]: ');

  rl.close();

  console.log('\n🔨 Generating test...\n');

  // Generate test code
  const useAuth = needsAuth.toLowerCase().startsWith('y');
  const filename = testName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '.spec.ts';
  
  const testCode = generateTestCode({
    testName,
    actions,
    assertions,
    useAuth,
    testData
  });

  const filepath = path.join(__dirname, '..', 'tests', filename);
  fs.writeFileSync(filepath, testCode);

  console.log('✅ Test generated!');
  console.log('📁 File:', filepath);
  console.log('\n' + '='.repeat(60));
  console.log(testCode);
  console.log('='.repeat(60));
  console.log('\n💡 Next: Review and run with: npx playwright test ' + filename);
}

function generateTestCode({ testName, actions, assertions, useAuth, testData }) {
  const imports = useAuth 
    ? `import { test, expect } from '../fixtures/auth';`
    : `import { test, expect } from '@playwright/test';`;

  const pageParam = useAuth ? '{ authenticatedPage: page }' : '{ page }';

  const dataConstants = testData ? `
const TEST_DATA = {
  ${testData.split(',').map(d => {
    const [key, value] = d.split(':').map(s => s.trim());
    return `${key.replace(/\s+/g, '')}: '${value}'`;
  }).join(',\n  ')}
};
` : '';

  return `${imports}

/**
 * ${testName} Tests
 */
${dataConstants}
test.describe('${testName}', () => {
  test('should ${actions}', async (${pageParam}) => {
    test.setTimeout(120000);

    // TODO: Navigate to the page
    // await page.goto('/path/to/page');

    // TODO: Perform actions
    // ${actions.split(',').map(a => `// ${a.trim()}`).join('\n    ')}

    // TODO: Add assertions
    // ${assertions.split(',').map(a => `// await expect(page).${a.trim()}`).join('\n    ')}

    // Placeholder assertion - replace with actual checks
    await expect(page).toHaveURL(/.*ashleynet.com.*/);
  });
});
`;
}

main().catch(console.error);

