# 🎯 Sample Tests Generated - Demo

I've created **3 sample tests** to show you how the AI test generator works!

## ✅ Generated Tests

### 1. **`customer-override-search.spec.ts`**
**What it tests:**
- Searching for a specific customer (ID: 700)
- Clearing search to show all customers
- Handling empty search results
- Input field validation

**Features demonstrated:**
- ✅ Uses `authenticatedPage` fixture
- ✅ Organized with `test.describe()` and `test.step()`
- ✅ Multiple test scenarios in one file
- ✅ Proper assertions with `expect()`
- ✅ Test data extracted to constants
- ✅ Console logging for debugging

**Run it:**
```bash
npx playwright test customer-override-search.spec.ts
```

---

### 2. **`global-adjustment-crud.spec.ts`**
**What it tests:**
- Creating new global adjustments
- Exporting to Excel with download validation
- Form validation (required fields)
- Date range validation
- Search/filter functionality

**Features demonstrated:**
- ✅ CRUD operations pattern
- ✅ File download handling
- ✅ Dynamic test data (using timestamps for uniqueness)
- ✅ Validation testing
- ✅ Edge case handling

**Run it:**
```bash
npx playwright test global-adjustment-crud.spec.ts
```

---

### 3. **`exclusion-status.spec.ts`** (Already refactored)
**What it tests:**
- Complete E2E workflow
- Creating adjustment, exporting, searching customers

---

## 🎨 How These Were "Generated"

These tests demonstrate what an AI would generate based on prompts like:

### Prompt for Test 1:
```
Generate a Playwright test for customer override search that:
- Uses authenticatedPage fixture
- Navigates to Global Adjustment Header
- Opens Customer Override section
- Searches for customer 700
- Verifies results appear
- Clears search to show all customers
- Includes test for non-existent customer
- Includes input validation test
Use test.describe() and test.step() for organization.
```

### Prompt for Test 2:
```
Generate a Playwright test for Global Adjustment CRUD operations:
- Create new adjustment with unique value
- Verify it appears in list
- Export to Excel and validate download
- Test form validation (required fields)
- Test date range validation (end before start)
- Include search/filter test
Use dynamic test data with timestamps for uniqueness.
```

---

## 🚀 Try Generating Your Own

### Using ChatGPT:

1. Copy this prompt:
```
You are a Playwright test expert for Ashley staging (https://stage.ashleynet.com).

Import: import { test, expect, navigateToGlobalAdjustment } from '../fixtures/auth'
Use authenticatedPage fixture for logged-in tests.

Generate a test that:
[YOUR DESCRIPTION HERE]

Requirements:
- Use test.describe() for grouping
- Use test.step() for multi-step tests
- Add expect() assertions
- Extract test data to constants
- Add console.log for debugging
- Set timeout to 120000
```

2. Replace `[YOUR DESCRIPTION HERE]` with something like:
   - "Tests the login error handling with invalid credentials"
   - "Tests creating multiple adjustments in a loop"
   - "Tests pagination in the results table"
   - "Tests sorting functionality by clicking column headers"

3. Paste the generated code into a new `.spec.ts` file!

---

### Using Interactive Generator:

```bash
npm run generate:interactive
```

Then answer:
```
1. What feature are you testing? Order Management
2. What actions should the test perform? Create order, verify in list, edit order, delete order
3. What should be verified? Order appears, details correct, deletion successful
4. Does this test need login? yes
5. Any specific test data? order number: 12345, customer: 700
```

---

### Using VS Code Snippets:

1. Create a new file: `tests/my-new-test.spec.ts`
2. Type: `pwtest-auth`
3. Press `Tab`
4. Fill in the placeholders!

**Other useful snippets:**
- `step` - Add a test step
- `assert-visible` - Assert element is visible
- `download` - Handle file download
- `fill` - Fill a form field
- `click` - Click a button

---

## 📊 Comparison: Manual vs AI-Generated

### Manual Test Writing:
```typescript
// Takes 15-30 minutes
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('...');
  await page.click('...');
  // ... lots of manual coding
});
```

### AI-Generated Test:
```typescript
// Takes 30 seconds with AI
import { test, expect, navigateToGlobalAdjustment } from '../fixtures/auth';

const TEST_DATA = {
  customer: '700',
};

test.describe('Customer Search', () => {
  test('should search for customer and verify results', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);
    
    await test.step('Navigate to search', async () => {
      await navigateToGlobalAdjustment(page);
      // ... well-structured code
    });
    
    await test.step('Perform search', async () => {
      // ... clear steps
    });
    
    await test.step('Verify results', async () => {
      // ... proper assertions
    });
  });
});
```

**Benefits:**
- ✅ 30x faster
- ✅ Better structure
- ✅ More comprehensive
- ✅ Follows best practices
- ✅ Includes edge cases

---

## 🎯 Next Steps

1. **Run the sample tests:**
   ```bash
   npx playwright test customer-override-search.spec.ts
   npx playwright test global-adjustment-crud.spec.ts
   ```

2. **Adjust selectors** if needed (some are commented out as placeholders)

3. **Generate your own test** using one of the methods above

4. **Build a test library** - generate tests for all your features!

---

## 💡 Pro Tips

### Make Tests More Robust:
- Add `await page.waitForLoadState('networkidle')` after navigation
- Use `await expect(element).toBeVisible({ timeout: 10000 })` for slow elements
- Add retry logic for flaky operations

### Organize Tests:
- Group related tests in `test.describe()` blocks
- Use `test.beforeEach()` for common setup
- Use `test.afterEach()` for cleanup

### Debug Generated Tests:
```bash
# Run with UI mode
npx playwright test customer-override-search.spec.ts --ui

# Run with debug mode
npx playwright test customer-override-search.spec.ts --debug

# Run specific test
npx playwright test customer-override-search.spec.ts -g "should search for specific customer"
```

---

## 🎉 You're Ready!

You now have:
- ✅ 3 sample tests to learn from
- ✅ 4 ways to generate new tests
- ✅ Complete documentation
- ✅ VS Code snippets for fast coding

**Start generating tests and save hours of manual work!** 🚀

