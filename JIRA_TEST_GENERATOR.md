# 🎯 Jira Acceptance Criteria to Playwright Test Generator

Automatically convert Jira acceptance criteria into Playwright test files!

## 🚀 Quick Start

### Option 1: Interactive Mode (Paste Criteria)
```bash
npm run generate:jira
```
Then paste your acceptance criteria and press Enter twice.

### Option 2: From File
```bash
node scripts/jira-test-generator.js acceptance-criteria.txt
```

---

## 📝 Supported Formats

### Format 1: Given/When/Then (BDD Style)
```
Given I am logged in as an admin user
When I navigate to Global Adjustment Header page
And I click on "Add New" button
And I enter credit code "MSC"
And I select calculation level "Item class-None"
Then I should see success message
And the new adjustment header should appear in the list
```

### Format 2: Bullet Points
```
- User can search for customer by ID
- Search results display customer name and details
- User can click on customer to view full profile
- System shows customer details page
```

### Format 3: Numbered List
```
1. Navigate to customer search page
2. Enter customer ID "700"
3. Click search button
4. Verify customer appears in results
5. Verify customer name is displayed
```

---

## ✨ Features

### 🔍 Smart Parsing
- **Auto-detects format**: Given/When/Then, bullets, or numbered lists
- **Extracts test data**: Automatically finds quoted values and IDs
- **Identifies auth needs**: Detects if login is required
- **Generates test steps**: Creates organized test.step() blocks

### 🎨 Generated Code Quality
- ✅ Uses proper Playwright patterns
- ✅ Imports from `../fixtures/auth` when auth needed
- ✅ Extracts test data to constants
- ✅ Organizes into test.step() blocks
- ✅ Includes TODO comments for implementation
- ✅ Sets appropriate timeouts

---

## 📋 Example

### Input (Acceptance Criteria):
```
Given I am logged in as an admin
When I navigate to Global Adjustment Header
And I click "Add New"
And I enter credit code "MSC"
And I click "Save"
Then I should see success message
And the adjustment should appear in the list
```

### Output (Generated Test):
```typescript
import { test, expect } from '../fixtures/auth';

/**
 * navigate to Global Adjustment Header Tests
 * Generated from Jira acceptance criteria
 */

const TEST_DATA = {
  add_new: 'Add New',
  msc: 'MSC',
  save: 'Save'
};

test.describe('navigate to Global Adjustment Header', () => {
  test('should navigate to Global Adjustment Header', async ({ authenticatedPage: page }) => {
    test.setTimeout(120000);

    await test.step('Perform actions', async () => {
      // TODO: Implement actions
      // navigate to Global Adjustment Header
      // click "Add New"
      // enter credit code "MSC"
      // click "Save"
    });

    await test.step('Verify results', async () => {
      // TODO: Add assertions
      // should see success message
      // the adjustment should appear in the list
      
      // Placeholder assertion - replace with actual checks
      await expect(page).toHaveURL(/.*ashleynet.com.*/);
    });
  });
});
```

---

## 🎯 Workflow

1. **Copy acceptance criteria from Jira**
2. **Run the generator**:
   ```bash
   npm run generate:jira
   ```
3. **Paste the criteria** and press Enter twice
4. **Enter a test name** (or press Enter to auto-generate)
5. **Review the generated test** in `tests/` folder
6. **Implement the TODOs** with actual selectors and actions
7. **Run the test**:
   ```bash
   npx playwright test your-test.spec.ts
   ```

---

## 💡 Tips

### Writing Better Acceptance Criteria
For best results, write criteria that:
- ✅ Use action verbs (navigate, click, enter, select)
- ✅ Include specific values in quotes ("MSC", "700")
- ✅ Separate actions and assertions clearly
- ✅ Mention login/auth requirements explicitly

### Good Examples:
```
✅ When I click "Add New" button
✅ And I enter customer ID "700"
✅ Then I should see "Success" message
```

### Avoid:
```
❌ When I do stuff
❌ Then it works
❌ User performs actions
```

---

## 🔧 Customization

Edit `scripts/jira-test-generator.js` to customize:
- Test timeout values
- Base URL patterns
- Test data extraction rules
- Code formatting preferences

---

## 📚 Related Tools

- **`npm run generate:interactive`** - Interactive test generator (question-based)
- **`npm run generate:test`** - AI-powered test generator (requires OpenAI API key)

---

## 🐛 Troubleshooting

### "No acceptance criteria provided"
Make sure to paste content and press Enter **twice** to finish input.

### Generated test has wrong structure
Check that your acceptance criteria follows one of the supported formats.

### Test data not extracted
Wrap values in quotes: `"MSC"` instead of `MSC`

---

## 📖 More Information

See also:
- [Quick Reference](QUICK_REFERENCE.md)
- [Test Generator Guide](TEST_GENERATOR_GUIDE.md)
- [Sample Tests Demo](SAMPLE_TESTS_DEMO.md)

