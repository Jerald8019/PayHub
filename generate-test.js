#!/usr/bin/env node

/**
 * AI-Powered Playwright Test Generator
 * 
 * Usage:
 *   node scripts/generate-test.js "Test description here"
 * 
 * Example:
 *   node scripts/generate-test.js "Create a test that searches for customer 700 and verifies results"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-4'; // or 'gpt-3.5-turbo' for faster/cheaper

const SYSTEM_PROMPT = `You are an expert Playwright test automation engineer.

Project Context:
- Base URL: https://stage.ashleynet.com
- Authentication: Uses fixtures/auth.ts with authenticatedPage fixture and login() function
- Framework: Playwright with TypeScript
- Existing test structure: Uses test.describe(), test.step(), expect() assertions

Code Style Requirements:
- Import from '../fixtures/auth'
- Use authenticatedPage fixture for authenticated tests
- Extract test data to constants
- Use descriptive test names: "should [action] when [condition]"
- Add assertions with expect()
- Use test.step() for multi-step workflows
- Prefer getByRole() over locator() when possible
- Add comments for complex logic
- Set appropriate timeouts

Generate ONLY the TypeScript code for the test file. No explanations, just code.`;

async function generateTest(description) {
  if (!OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.log('\nSet it with:');
    console.log('  export OPENAI_API_KEY="your-api-key-here"  # Linux/Mac');
    console.log('  $env:OPENAI_API_KEY="your-api-key-here"   # Windows PowerShell');
    process.exit(1);
  }

  console.log('🤖 Generating test for:', description);
  console.log('⏳ Please wait...\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate a Playwright test: ${description}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;

    // Extract code from markdown if present
    const codeMatch = generatedCode.match(/```(?:typescript|ts)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : generatedCode;

    // Generate filename from description
    const filename = description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '.spec.ts';

    const filepath = path.join(__dirname, '..', 'tests', filename);

    // Save the generated test
    fs.writeFileSync(filepath, code.trim() + '\n');

    console.log('✅ Test generated successfully!');
    console.log('📁 File:', filepath);
    console.log('\n' + '='.repeat(60));
    console.log(code.trim());
    console.log('='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log(`   1. Review the generated test: ${filename}`);
    console.log(`   2. Run it: npx playwright test ${filename}`);
    console.log(`   3. Adjust as needed\n`);

  } catch (error) {
    console.error('❌ Error generating test:', error.message);
    process.exit(1);
  }
}

// Main
const description = process.argv.slice(2).join(' ');

if (!description) {
  console.log('Usage: node scripts/generate-test.js "Test description"');
  console.log('\nExamples:');
  console.log('  node scripts/generate-test.js "Test customer search with ID 700"');
  console.log('  node scripts/generate-test.js "Create order and verify in order list"');
  console.log('  node scripts/generate-test.js "Test export to Excel functionality"');
  process.exit(1);
}

generateTest(description);

