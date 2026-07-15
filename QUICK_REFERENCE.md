# 🚀 Quick Reference - Test Generators

## 📝 Generate Tests in 30 Seconds

### Method 1: Jira Acceptance Criteria (NEW! ⭐)
```bash
npm run generate:jira  # Paste Jira acceptance criteria
```
**Best for:** Converting Jira tickets to tests
**Supports:** Given/When/Then, bullet points, numbered lists

### Method 2: Interactive (Questions)
```bash
npm run generate:interactive  # Answer 5 questions
```
**Best for:** Quick test scaffolding

### Method 3: AI-Powered (OpenAI)
```bash
npm run generate:test "Test description"  # Needs API key
```
**Best for:** Complex scenarios with smart code generation

### Method 4: ChatGPT (Manual)
```
Prompt: "Generate Playwright test for [FEATURE] that [ACTIONS] and verifies [RESULTS]"
Example: "Generate Playwright test for customer search that searches for ID 700 and verifies results table appears"
```

### Method 5: VS Code Snippets
```
Type in .spec.ts file:
  pwtest-auth  → Full test with auth
  pwtest       → Basic test
  step         → Test step
  download     → File download
```

---

## 🎯 Sample Prompts

### Login Test
```
Generate test that logs in with invalid credentials and verifies error message appears
```

### Form Test
```
Generate test that fills form with value=TEST, tValue=2.5, dates 2026-01-01 to 2026-12-31, submits, and verifies success
```

### Search Test
```
Generate test that searches for customer 700, verifies results, exports to Excel, validates download
```

### CRUD Test
```
Generate test that creates item, edits it, verifies changes, deletes it, confirms deletion
```

---

## 🛠️ Common Commands

```bash
# Run tests
npm test                                    # All tests
npx playwright test login.spec.ts          # Specific file
npx playwright test -g "should login"      # By name

# Debug
npx playwright test --ui                   # UI mode
npx playwright test --debug                # Debug mode
npx playwright test --headed               # See browser

# Reports
npm run report                             # Show HTML report
npx playwright show-trace trace.zip        # View trace

# Generate
npm run generate:interactive               # Interactive generator
npm run generate:test "description"        # AI generator
npx playwright codegen URL                 # Record actions
```

---

## 📚 File Structure

```
tests/
  ├── customer-override-search.spec.ts    # Sample: Search tests
  ├── global-adjustment-crud.spec.ts      # Sample: CRUD tests
  ├── exclusion-status.spec.ts            # Sample: E2E workflow
  └── Loginpage.spec.ts                   # Sample: Login tests

fixtures/
  └── auth.ts                              # Auth helpers

scripts/
  ├── generate-test.js                     # AI generator
  └── test-generator-interactive.js        # Interactive generator

Docs/
  ├── AI_TEST_GENERATOR_SETUP.md          # Setup guide
  ├── TEST_GENERATOR_GUIDE.md             # Detailed guide
  ├── SAMPLE_TESTS_DEMO.md                # Sample tests info
  └── QUICK_REFERENCE.md                  # This file
```

---

## 🎨 Code Snippets

### Basic Test Structure
```typescript
import { test, expect } from '../fixtures/auth';

test.describe('Feature Name', () => {
  test('should do something', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);
    
    await test.step('Step 1', async () => {
      // Actions
    });
    
    await test.step('Verify', async () => {
      await expect(page).toHaveURL(/pattern/);
    });
  });
});
```

### With Test Data
```typescript
const TEST_DATA = {
  customer: '700',
  value: 'TEST',
};

test('should use test data', async ({ authenticatedPage: page }) => {
  await page.locator('#field').fill(TEST_DATA.customer);
});
```

### File Download
```typescript
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export' }).click();
const download = await downloadPromise;
expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
```

---

## ✅ Best Practices

### DO:
- ✅ Use `test.describe()` to group related tests
- ✅ Use `test.step()` for multi-step tests
- ✅ Extract test data to constants
- ✅ Add meaningful assertions
- ✅ Use `authenticatedPage` for logged-in tests
- ✅ Set appropriate timeouts
- ✅ Add console.log for debugging

### DON'T:
- ❌ Hardcode credentials in tests
- ❌ Use generic test names like "test"
- ❌ Skip assertions
- ❌ Use fixed waits (prefer waitForSelector)
- ❌ Ignore test failures

---

## 🔍 Debugging Tips

### Test Failing?
```bash
# See what's happening
npx playwright test --headed --debug

# Check the trace
npx playwright show-report
# Click on failed test → View trace
```

### Selector Not Found?
```bash
# Use codegen to get correct selector
npx playwright codegen https://stage.ashleynet.com

# Or use Playwright Inspector
npx playwright test --debug
```

### Slow Test?
```typescript
// Increase timeout
test.setTimeout(180000); // 3 minutes

// Or for specific action
await expect(element).toBeVisible({ timeout: 60000 });
```

---

## 🎯 Quick Wins

### Generate 10 Tests in 10 Minutes:
1. List your features
2. For each feature, use ChatGPT prompt
3. Paste generated code
4. Run and adjust
5. Done!

### Example Session:
```
Feature 1: Login → Generate test → Paste → Run
Feature 2: Search → Generate test → Paste → Run
Feature 3: Export → Generate test → Paste → Run
...
```

---

## 📞 Need Help?

- **Setup issues?** → Read `AI_TEST_GENERATOR_SETUP.md`
- **How to use?** → Read `TEST_GENERATOR_GUIDE.md`
- **Examples?** → Read `SAMPLE_TESTS_DEMO.md`
- **Playwright docs?** → https://playwright.dev

---

## 🎉 You're All Set!

**Generate your first test now:**
1. Open ChatGPT
2. Paste: "Generate Playwright test for [YOUR FEATURE]"
3. Copy the code
4. Run it!

**Happy testing!** 🚀

