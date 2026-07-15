# 🎓 Jira Test Generator - Complete Tutorial

## Step-by-Step Guide: From Jira Ticket to Working Test

---

## 📋 Step 1: Copy Acceptance Criteria from Jira

Let's say you have this Jira ticket:

**Story:** As an admin user, I want to create a new global adjustment with exclusion status

**Acceptance Criteria:**
```
Given I am logged in as an admin user
When I navigate to the Global Adjustment Header page
And I click on the "Add New" button
And I enter the following details:
  - Adjustment Value: "ZJAB"
  - T Value: "1.5"
  - Start Date: "2025-12-31"
  - End Date: "2026-04-30"
And I select exclusion status "Active"
And I click the "Save" button
Then I should see a success message "Adjustment created successfully"
And the new adjustment "ZJAB" should appear in the adjustments list
And the adjustment should have status "Active"
```

---

## 🚀 Step 2: Run the Generator

### Option A: Interactive Mode
```bash
npm run generate:jira
```

Then paste the acceptance criteria and press Enter twice.

### Option B: From File
Save the criteria to a file (e.g., `jira-ticket-123.txt`) and run:
```bash
node scripts/jira-test-generator.js jira-ticket-123.txt
```

---

## 📝 Step 3: Review Generated Test

The generator creates this template:

```typescript
import { test, expect } from '../fixtures/auth';

const TEST_DATA = {
  add_new: 'Add New',
  zjab: 'ZJAB',
  1_5: '1.5',
  2025_12_31: '2025-12-31',
  2026_04_30: '2026-04-30',
  active: 'Active',
  save: 'Save',
  adjustment_created_successfully: 'Adjustment created successfully'
};

test.describe('Create Global Adjustment', () => {
  test('should create new adjustment with exclusion status', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);

    await test.step('Perform actions', async () => {
      // TODO: Implement actions
      // I navigate to the Global Adjustment Header page
      // I click on the "Add New" button
      // I enter Adjustment Value: "ZJAB"
      // I enter T Value: "1.5"
      // etc...
    });

    await test.step('Verify results', async () => {
      // TODO: Add assertions
      // I should see success message
    });
  });
});
```

**What the generator did for you:**
- ✅ Detected you need authentication (uses `authenticatedPage`)
- ✅ Extracted all test data into constants
- ✅ Created organized test.step() blocks
- ✅ Added helpful TODO comments

---

## 🔧 Step 4: Implement the TODOs

Now you need to replace the TODOs with actual Playwright code.

### 4.1: Use Playwright Inspector to Find Selectors

Run this command to open Playwright Inspector:
```bash
npx playwright test --debug
```

Or use the Codegen tool:
```bash
npx playwright codegen https://stage.ashleynet.com
```

### 4.2: Implement the Actions

Replace the TODO comments with actual code:

```typescript
await test.step('Navigate and create adjustment', async () => {
  // Navigate to Global Adjustment Header page
  await page.goto('/SiteHome/Forms/Home.aspx?hmt=1&hph=1');
  await page.getByRole('link', { name: 'Global Adjustment Header' }).click();
  await page.getByRole('link', { name: '0', exact: true }).click();
  
  // Click "Add New" button
  await page.getByRole('button', { name: 'Add New' }).click();
  
  // Fill in the form
  await page.locator('#txt_value').fill(TEST_DATA.zjab);
  await page.locator('#txttvalue').fill(TEST_DATA['1_5']);
  await page.locator('#txtorderdate').fill(TEST_DATA['2025_12_31']);
  await page.locator('#txtto').fill(TEST_DATA['2026_04_30']);
  
  // Select exclusion status
  await page.locator('#ddl_status').selectOption(TEST_DATA.active);
  
  // Click Save
  await page.getByRole('button', { name: 'Submit And Close' }).click();
});
```

### 4.3: Implement the Assertions

```typescript
await test.step('Verify results', async () => {
  // Verify we're back to the main page
  await expect(page.getByRole('button', { name: 'Add New' })).toBeVisible();
  
  // Verify the adjustment appears in the list
  await expect(page.getByText(TEST_DATA.zjab)).toBeVisible();
  
  // Verify the status
  const row = page.locator(`tr:has-text("${TEST_DATA.zjab}")`);
  await expect(row.getByText(TEST_DATA.active)).toBeVisible();
  
  // Verify T Value
  await expect(row.getByText(TEST_DATA['1_5'])).toBeVisible();
});
```

---

## ✅ Step 5: Final Implemented Test

Here's what your complete test looks like:

```typescript
import { test, expect, navigateToGlobalAdjustment } from '../fixtures/auth';

const TEST_DATA = {
  adjustmentValue: 'ZJAB',
  tValue: '1.5',
  startDate: '2025-12-31',
  endDate: '2026-04-30',
  status: 'Active'
};

test.describe('Create Global Adjustment with Exclusion Status', () => {
  test('should create new adjustment and verify it appears in list', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);

    await test.step('Navigate to Global Adjustment page', async () => {
      await navigateToGlobalAdjustment(page);
      await expect(page.getByRole('button', { name: 'Add New' })).toBeVisible();
    });

    await test.step('Create new adjustment', async () => {
      await page.getByRole('button', { name: 'Add New' }).click();
      
      await page.locator('#txt_value').fill(TEST_DATA.adjustmentValue);
      await page.locator('#txttvalue').fill(TEST_DATA.tValue);
      await page.locator('#txtorderdate').fill(TEST_DATA.startDate);
      await page.locator('#txtto').fill(TEST_DATA.endDate);
      await page.locator('#ddl_status').selectOption(TEST_DATA.status);
      
      await page.getByRole('button', { name: 'Submit And Close' }).click();
    });

    await test.step('Verify adjustment was created', async () => {
      await expect(page.getByRole('button', { name: 'Add New' })).toBeVisible();
      await expect(page.getByText(TEST_DATA.adjustmentValue)).toBeVisible();
      
      const row = page.locator(`tr:has-text("${TEST_DATA.adjustmentValue}")`);
      await expect(row.getByText(TEST_DATA.status)).toBeVisible();
      await expect(row.getByText(TEST_DATA.tValue)).toBeVisible();
    });
  });
});
```

---

## 🏃 Step 6: Run the Test

```bash
npx playwright test createglobaladjustmentwithexclusion.spec.ts
```

Or run with UI mode:
```bash
npx playwright test createglobaladjustmentwithexclusion.spec.ts --ui
```

Or debug mode:
```bash
npx playwright test createglobaladjustmentwithexclusion.spec.ts --debug
```

---

## 📊 Time Saved

**Without Generator:**
- ⏱️ 10-15 minutes to write boilerplate
- ⏱️ 5 minutes to structure test.step() blocks
- ⏱️ 5 minutes to extract test data
- **Total: ~20-25 minutes**

**With Generator:**
- ⏱️ 30 seconds to run generator
- ⏱️ 10-15 minutes to implement selectors
- **Total: ~15 minutes**

**Time Saved: ~10 minutes per test!** ⚡

---

## 💡 Pro Tips

### Tip 1: Use Helper Functions
Notice how we used `navigateToGlobalAdjustment(page)` from `fixtures/auth.ts`? Create reusable helpers!

### Tip 2: Better Test Data Names
The generator creates names like `1_5` for "1.5". Rename them to be more descriptive:
```typescript
const TEST_DATA = {
  adjustmentValue: 'ZJAB',  // Better than 'zjab'
  tValue: '1.5',            // Better than '1_5'
};
```

### Tip 3: Add Cleanup
Add a cleanup step to delete test data:
```typescript
test.afterEach(async ({ page }) => {
  // Delete the test adjustment
  await deleteAdjustment(page, TEST_DATA.adjustmentValue);
});
```

### Tip 4: Use Data-Driven Tests
If you have multiple scenarios, use `test.describe.parallel()`:
```typescript
const scenarios = [
  { value: 'ZJAB', tValue: '1.5', status: 'Active' },
  { value: 'TEST', tValue: '2.0', status: 'Inactive' },
];

scenarios.forEach(scenario => {
  test(`should create adjustment ${scenario.value}`, async ({ page }) => {
    // Test implementation
  });
});
```

---

## 🐛 Troubleshooting

### Issue: Selectors don't work
**Solution:** Use Playwright Inspector to find correct selectors:
```bash
npx playwright test --debug
```

### Issue: Test times out
**Solution:** Increase timeout or add explicit waits:
```typescript
test.setTimeout(180000); // 3 minutes
await page.waitForLoadState('networkidle');
```

### Issue: Element not visible
**Solution:** Add explicit visibility checks:
```typescript
await expect(page.locator('#txt_value')).toBeVisible();
await page.locator('#txt_value').fill(TEST_DATA.adjustmentValue);
```

---

## 📚 Next Steps

1. ✅ Generate more tests from your Jira backlog
2. ✅ Create a library of reusable helper functions
3. ✅ Set up CI/CD to run tests automatically
4. ✅ Add visual regression testing
5. ✅ Create test data factories

---

**Happy Testing! 🎉**

