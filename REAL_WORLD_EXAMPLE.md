# 🌟 Real World Example: Jira Ticket to Working Test

## 📋 The Jira Ticket

**Ticket:** PROJ-456  
**Title:** Create Customer Override with Specific Adjustment  
**Type:** Story  
**Priority:** High

**Description:**
As a pricing manager, I need to create customer-specific price overrides so that I can apply custom adjustments to individual customers.

**Acceptance Criteria:**
```
Given I am logged in as a pricing manager
When I navigate to the Global Adjustment Header page
And I search for customer "700"
And I click on the customer row
And I click "Add Override" button
And I enter adjustment value "DISCOUNT10"
And I enter percentage "10"
And I set effective date to "2026-01-01"
And I click "Save"
Then I should see confirmation message "Override created successfully"
And the override should appear in the customer's override list
And the override status should be "Active"
```

---

## 🚀 Step 1: Save Criteria to File

Create `jira-proj-456.txt`:
```bash
# In PowerShell
@"
Given I am logged in as a pricing manager
When I navigate to the Global Adjustment Header page
And I search for customer "700"
And I click on the customer row
And I click "Add Override" button
And I enter adjustment value "DISCOUNT10"
And I enter percentage "10"
And I set effective date to "2026-01-01"
And I click "Save"
Then I should see confirmation message "Override created successfully"
And the override should appear in the customer's override list
And the override status should be "Active"
"@ | Out-File -FilePath jira-proj-456.txt -Encoding UTF8
```

---

## 🎯 Step 2: Run Generator

```bash
node scripts/jira-test-generator.js jira-proj-456.txt
```

**Output:**
```
🎯 Jira Acceptance Criteria to Playwright Test Generator

📄 Reading from file: jira-proj-456.txt

🔍 Parsing acceptance criteria...

📊 Parsed Information:
  - Test Name: I navigate to the Global Adjustment Header page
  - Scenarios: 1
  - Needs Auth: Yes
  - Test Data: 6 items

Enter test file name (or press Enter to auto-generate):
```

**Type:** `customer-override-creation`

---

## 📝 Step 3: Review Generated Test

File created: `tests/customer-override-creation.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth';

const TEST_DATA = {
  700: '700',
  add_override: 'Add Override',
  discount10: 'DISCOUNT10',
  10: '10',
  2026_01_01: '2026-01-01',
  save: 'Save',
  override_created_successfully: 'Override created successfully',
  active: 'Active'
};

test.describe('Create Customer Override', () => {
  test('should create customer override with adjustment', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);

    await test.step('Perform actions', async () => {
      // TODO: Implement actions
      // I navigate to the Global Adjustment Header page
      // I search for customer "700"
      // I click on the customer row
      // I click "Add Override" button
      // I enter adjustment value "DISCOUNT10"
      // I enter percentage "10"
      // I set effective date to "2026-01-01"
      // I click "Save"
    });

    await test.step('Verify results', async () => {
      // TODO: Add assertions
      // I should see confirmation message "Override created successfully"
      // the override should appear in the customer's override list
      // the override status should be "Active"
    });
  });
});
```

---

## 🔧 Step 4: Improve Test Data Names

First, let's make the TEST_DATA more readable:

```typescript
const TEST_DATA = {
  customerId: '700',              // Better than '700'
  adjustmentValue: 'DISCOUNT10',  // Better than 'discount10'
  percentage: '10',               // Better than '10'
  effectiveDate: '2026-01-01',    // Better than '2026_01_01'
  status: 'Active'                // Better than 'active'
};
```

---

## 🔍 Step 5: Find Selectors with Playwright Inspector

Run:
```bash
npx playwright codegen https://stage.ashleynet.com
```

Manually perform the actions and copy the selectors:
- Customer search input: `#txt_customer_search`
- Customer row: `tr:has-text("700")`
- Add Override button: `button:has-text("Add Override")`
- Adjustment value input: `#txt_adjustment_value`
- Percentage input: `#txt_percentage`
- Effective date input: `#txt_effective_date`
- Save button: `button:has-text("Save")`

---

## 💻 Step 6: Implement the Test

Replace TODOs with actual code:

```typescript
import { test, expect, navigateToGlobalAdjustment } from '../fixtures/auth';

const TEST_DATA = {
  customerId: '700',
  adjustmentValue: 'DISCOUNT10',
  percentage: '10',
  effectiveDate: '2026-01-01',
  status: 'Active'
};

test.describe('Customer Override Creation - PROJ-456', () => {
  test('should create customer override with specific adjustment', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);

    await test.step('Navigate to Global Adjustment page', async () => {
      await navigateToGlobalAdjustment(page);
      await expect(page.getByRole('button', { name: 'Add New' })).toBeVisible();
    });

    await test.step('Search for customer', async () => {
      await page.locator('#txt_customer_search').fill(TEST_DATA.customerId);
      await page.getByRole('button', { name: 'Search' }).click();
      
      // Wait for results
      await expect(page.locator(`tr:has-text("${TEST_DATA.customerId}")`)).toBeVisible();
    });

    await test.step('Open customer and add override', async () => {
      // Click on customer row
      await page.locator(`tr:has-text("${TEST_DATA.customerId}")`).click();
      
      // Click Add Override button
      await page.getByRole('button', { name: 'Add Override' }).click();
    });

    await test.step('Fill override details', async () => {
      await page.locator('#txt_adjustment_value').fill(TEST_DATA.adjustmentValue);
      await page.locator('#txt_percentage').fill(TEST_DATA.percentage);
      await page.locator('#txt_effective_date').fill(TEST_DATA.effectiveDate);
      
      // Save the override
      await page.getByRole('button', { name: 'Save' }).click();
    });

    await test.step('Verify override was created', async () => {
      // Check for success message
      await expect(page.getByText('Override created successfully')).toBeVisible();
      
      // Verify override appears in list
      const overrideRow = page.locator(`tr:has-text("${TEST_DATA.adjustmentValue}")`);
      await expect(overrideRow).toBeVisible();
      
      // Verify status is Active
      await expect(overrideRow.getByText(TEST_DATA.status)).toBeVisible();
      
      // Verify percentage
      await expect(overrideRow.getByText(TEST_DATA.percentage)).toBeVisible();
    });
  });
});
```

---

## 🏃 Step 7: Run the Test

```bash
npx playwright test customer-override-creation.spec.ts
```

**Expected Output:**
```
Running 1 test using 1 worker

  ✓  [chromium] › customer-override-creation.spec.ts:7:3 › Customer Override Creation - PROJ-456 › should create customer override with specific adjustment (45s)

  1 passed (47s)
```

---

## 🎉 Step 8: Update Jira Ticket

Add comment to PROJ-456:
```
✅ Automated test created: tests/customer-override-creation.spec.ts
✅ Test passing in CI/CD
✅ Covers all acceptance criteria
```

---

## 📊 Time Breakdown

| Task | Time |
|------|------|
| Copy criteria from Jira | 30 sec |
| Run generator | 30 sec |
| Improve test data names | 2 min |
| Find selectors with Inspector | 5 min |
| Implement test code | 8 min |
| Run and debug test | 5 min |
| **Total** | **~20 min** |

**Without generator:** ~35-40 minutes  
**Time saved:** ~15-20 minutes per test! ⚡

---

## 🎓 Lessons Learned

### What Worked Well ✅
- Generator correctly detected auth requirement
- All test data was extracted automatically
- Test structure was clean and organized
- TODO comments were helpful guides

### What Needed Manual Work 🔧
- Renaming TEST_DATA keys for readability
- Finding actual selectors (can't be automated)
- Adding explicit waits for dynamic content
- Implementing specific assertions

### Improvements for Next Time 💡
- Create helper function for customer search
- Add cleanup to delete test override
- Parameterize test for multiple customers
- Add screenshot on failure

---

## 🚀 Next Steps

1. **Add to CI/CD pipeline**
2. **Create more tests** from Jira backlog
3. **Build helper library** for common actions
4. **Share with team** - show them the generator!
5. **Track metrics** - tests created, time saved, bugs found

---

**You just went from Jira ticket to working test in 20 minutes! 🎉**

