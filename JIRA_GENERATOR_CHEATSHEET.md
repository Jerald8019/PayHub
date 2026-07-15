# 🚀 Jira Test Generator - Quick Cheat Sheet

## ⚡ Quick Commands

```bash
# Interactive mode (paste criteria)
npm run generate:jira

# From file
node scripts/jira-test-generator.js my-criteria.txt

# With piped input (Windows)
echo test-name | node scripts/jira-test-generator.js criteria.txt
```

---

## 📝 Supported Formats

### ✅ Given/When/Then (BDD)
```
Given I am logged in as admin
When I click "Add New"
And I enter value "TEST"
Then I should see success message
```

### ✅ Bullet Points
```
- Navigate to customer page
- Enter customer ID "700"
- Click search
- Verify results appear
```

### ✅ Numbered Lists
```
1. Login as admin
2. Navigate to settings
3. Update configuration
4. Save changes
5. Verify success
```

---

## 🎯 What Gets Auto-Detected

| Criteria Contains | Generator Does |
|-------------------|----------------|
| "logged in", "authenticated" | Uses `authenticatedPage` fixture |
| Values in "quotes" | Extracts to TEST_DATA |
| Numbers like 700, 123 | Extracts to TEST_DATA |
| "should", "verify", "see" | Puts in assertions step |
| "click", "enter", "navigate" | Puts in actions step |

---

## 📊 Generated Test Structure

```typescript
import { test, expect } from '../fixtures/auth';  // ← Auto-selected

const TEST_DATA = {                               // ← Auto-extracted
  value: 'TEST',
  customer_id: '700'
};

test.describe('Feature Name', () => {             // ← Auto-named
  test('should do something', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);                      // ← Auto-set
    
    await test.step('Perform actions', async () => {
      // TODO: Your actions here                 // ← You implement
    });
    
    await test.step('Verify results', async () => {
      // TODO: Your assertions here              // ← You implement
    });
  });
});
```

---

## 🔧 Implementation Checklist

After generating the test:

- [ ] Review the generated file in `tests/` folder
- [ ] Rename TEST_DATA keys if needed (e.g., `1_5` → `tValue`)
- [ ] Use Playwright Inspector to find selectors: `npx playwright test --debug`
- [ ] Replace TODO comments with actual code
- [ ] Add proper assertions with `expect()`
- [ ] Run the test: `npx playwright test your-test.spec.ts`
- [ ] Debug if needed: `npx playwright test --debug`
- [ ] Add cleanup if needed (delete test data)

---

## 💡 Common Patterns

### Navigation
```typescript
await page.goto('/path/to/page');
await page.getByRole('link', { name: 'Menu Item' }).click();
```

### Form Filling
```typescript
await page.locator('#input_id').fill(TEST_DATA.value);
await page.locator('#dropdown').selectOption(TEST_DATA.option);
await page.getByRole('button', { name: 'Submit' }).click();
```

### Assertions
```typescript
await expect(page.getByText('Success')).toBeVisible();
await expect(page).toHaveURL(/.*expected-url.*/);
await expect(page.locator('#result')).toContainText(TEST_DATA.value);
```

### Waiting
```typescript
await page.waitForLoadState('networkidle');
await page.waitForURL('**/expected-page**');
await expect(page.locator('#element')).toBeVisible();
```

---

## 🎨 Example: Before & After

### Before (Generated Template)
```typescript
await test.step('Perform actions', async () => {
  // TODO: Implement actions
  // I click "Add New" button
  // I enter customer ID "700"
  // I click search
});
```

### After (Implemented)
```typescript
await test.step('Search for customer', async () => {
  await page.getByRole('button', { name: 'Add New' }).click();
  await page.locator('#customer_id').fill(TEST_DATA.customer_id);
  await page.getByRole('button', { name: 'Search' }).click();
});
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Import error | Make sure `tsconfig.json` exists |
| Selector not found | Use `npx playwright test --debug` |
| Test times out | Increase timeout: `test.setTimeout(180000)` |
| Element not visible | Add wait: `await expect(element).toBeVisible()` |
| Auth not working | Check `.env` file has credentials |

---

## 📚 Useful Commands

```bash
# Run specific test
npx playwright test my-test.spec.ts

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Generate selectors
npx playwright codegen https://stage.ashleynet.com

# Show report
npx playwright show-report

# Run all tests
npx playwright test
```

---

## 🎯 Best Practices

### ✅ DO
- Use descriptive test names
- Extract test data to constants
- Use test.step() for organization
- Add meaningful assertions
- Clean up test data after tests
- Use helper functions from `fixtures/auth.ts`

### ❌ DON'T
- Hardcode values in test code
- Use generic selectors like `.class1`
- Skip assertions
- Leave TODO comments in production
- Commit sensitive data

---

## 📖 Related Docs

- [Complete Tutorial](JIRA_GENERATOR_TUTORIAL.md)
- [Generator Comparison](TEST_GENERATORS_COMPARISON.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Jira Generator Guide](JIRA_TEST_GENERATOR.md)

---

**Print this and keep it handy! 📌**

