# 🤖 AI Test Generator - Complete Setup

## ✅ What's Been Created

I've set up **3 different ways** to generate Playwright tests instantly using AI:

### **1. ChatGPT/Claude Prompts** (Easiest - No Setup)
- File: `test-generator-prompt.md`
- Just copy the prompt template and use with any AI assistant
- **Best for:** Quick one-off test generation

### **2. Interactive Generator** (No API Key Needed)
- File: `scripts/test-generator-interactive.js`
- Asks questions and generates test templates
- **Best for:** Beginners or when you don't have API access

### **3. AI-Powered Generator** (Most Advanced)
- File: `scripts/generate-test.js`
- Uses OpenAI API to generate complete tests
- **Best for:** Bulk test generation, production use

### **4. VS Code Snippets** (Instant Templates)
- File: `.vscode/playwright-snippets.code-snippets`
- Type shortcuts to insert test templates
- **Best for:** Fast coding while writing tests

---

## 🚀 Quick Start

### Method 1: ChatGPT/Claude (Recommended to Start)

1. Open ChatGPT or Claude
2. Copy this prompt:

```
You are a Playwright test expert for Ashley staging environment.

Setup:
- Base URL: https://stage.ashleynet.com
- Import: import { test, expect } from '../fixtures/auth'
- Use authenticatedPage fixture for logged-in tests

Generate a test that:
[DESCRIBE YOUR TEST HERE]

Use test.describe(), test.step(), expect() assertions, and extract test data to constants.
```

3. Replace `[DESCRIBE YOUR TEST HERE]` with your test scenario
4. Paste generated code into a new `.spec.ts` file
5. Run: `npx playwright test your-test.spec.ts`

**Example:**
```
Generate a test that:
1. Uses authenticatedPage fixture
2. Navigates to Customer Search
3. Searches for customer ID 700
4. Verifies results table is visible
5. Verifies customer name appears
```

---

### Method 2: Interactive Generator

```bash
npm run generate:interactive
```

Answer the questions and it creates a test template!

---

### Method 3: AI-Powered (Requires OpenAI API Key)

#### One-Time Setup:

1. Get API key from: https://platform.openai.com/api-keys

2. Add to your `.env` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

#### Usage:

```bash
npm run generate:test "Your test description here"
```

**Examples:**

```bash
# Customer search test
npm run generate:test "Test customer search with ID 700"

# Form submission test
npm run generate:test "Create global adjustment with value ZJAB and verify it appears in list"

# Export test
npm run generate:test "Export data to Excel and validate download"
```

---

### Method 4: VS Code Snippets

In any `.spec.ts` file, type:

- `pwtest-auth` → Full test with authentication
- `pwtest` → Basic test without auth
- `step` → Add a test step
- `assert-visible` → Assert element visible
- `download` → Handle file download
- `fill` → Fill form field
- `click` → Click button

Then press `Tab` to fill in the placeholders!

---

## 📝 Example Workflows

### Generate a Complete E2E Test

**Using ChatGPT:**
```
Generate a Playwright test that:
1. Logs in using authenticatedPage fixture
2. Navigates to Global Adjustment Header
3. Clicks "Add New" button
4. Fills form: value=TEST123, tValue=2.5, orderDate=2026-01-01, toDate=2026-12-31
5. Clicks "Submit And Close"
6. Verifies success (Add New button visible again)
7. Exports to Excel
8. Validates download has .xlsx extension
9. Searches for customer 700 in Customer Override
10. Verifies search results appear
```

**Using AI Generator:**
```bash
npm run generate:test "Complete workflow: create adjustment TEST123, export to Excel, search customer 700"
```

---

## 💡 Pro Tips

### 1. Be Specific in Descriptions
❌ "Test the search"
✅ "Search for customer ID 700, verify results table has at least 1 row, verify customer name 'ABC Corp' is visible"

### 2. Include Test Data
❌ "Fill the form"
✅ "Fill form with: value=ZJAB, tValue=1.5, dates from 2025-12-31 to 2026-04-30"

### 3. Specify Assertions
❌ "Check if it works"
✅ "Verify URL contains '/success', success message visible, table has 5 rows"

### 4. Iterate and Refine
- Generate a basic test first
- Run it to see what needs adjustment
- Regenerate with more specific details

### 5. Combine Methods
- Use AI to generate the skeleton
- Use snippets to add details
- Use Playwright Codegen to get exact selectors: `npx playwright codegen https://stage.ashleynet.com`

---

## 🎯 Common Test Patterns

### Pattern 1: Form Submission
```
Generate a test that fills a form with [FIELDS], submits it, and verifies [SUCCESS CRITERIA]
```

### Pattern 2: Search and Verify
```
Generate a test that searches for [ITEM], verifies results contain [DATA], and checks [ASSERTIONS]
```

### Pattern 3: CRUD Operations
```
Generate a test that creates [ITEM], edits it to [NEW VALUES], verifies changes, then deletes it
```

### Pattern 4: Export/Download
```
Generate a test that exports data to [FORMAT], validates download, and optionally checks file content
```

---

## 🔧 Customization

### Modify AI Behavior

Edit `scripts/generate-test.js` line 18-35 to customize the system prompt:

```javascript
const SYSTEM_PROMPT = `You are an expert Playwright test engineer.

// Add your preferences:
- Always use Page Object Model
- Include accessibility checks with axe
- Add performance assertions
- Use data-testid selectors
- etc.
`;
```

### Change AI Model

In `scripts/generate-test.js` line 16:
```javascript
const MODEL = 'gpt-4';  // Best quality
// const MODEL = 'gpt-3.5-turbo';  // Faster, cheaper
```

---

## 📚 Next Steps

1. **Try Method 1** (ChatGPT) to generate your first test
2. **Review** the `TEST_GENERATOR_GUIDE.md` for detailed examples
3. **Experiment** with different prompts
4. **Set up OpenAI API** for automated generation (optional)
5. **Create a prompt library** of your best-working prompts

---

## 🆘 Need Help?

- **Generated test has errors?** Review and adjust selectors using `npx playwright test --debug`
- **AI not understanding?** Be more specific in your description
- **Want better results?** Include exact button names, field IDs, expected text
- **Test fails?** Use Playwright Inspector to verify selectors match your app

---

## 🎉 You're All Set!

You now have 4 powerful ways to generate Playwright tests instantly. Start with the ChatGPT method and work your way up to the automated generator as you get comfortable!

Happy testing! 🚀

