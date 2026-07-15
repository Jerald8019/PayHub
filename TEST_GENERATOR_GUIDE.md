# 🤖 AI-Powered Test Generator Guide

Generate Playwright tests instantly using AI!

## 🚀 Quick Start Options

### **Option 1: ChatGPT/Claude (Easiest)**

1. Open ChatGPT or Claude
2. Use this prompt:

```
You are a Playwright test expert for the Ashley staging environment.

Project setup:
- Base URL: https://stage.ashleynet.com
- Auth fixture: import { test, expect } from '../fixtures/auth'
- Use authenticatedPage fixture for logged-in tests
- TypeScript with Playwright

Generate a test that:
[YOUR TEST DESCRIPTION HERE]

Requirements:
- Use test.describe() and test.step()
- Add expect() assertions
- Extract test data to constants
- Use descriptive names
```

3. Paste the generated code into a new `.spec.ts` file
4. Run: `npx playwright test your-test.spec.ts`

---

### **Option 2: Interactive Generator (No API Key Needed)**

Run the interactive script:

```bash
node scripts/test-generator-interactive.js
```

Answer the questions and it generates a test template for you!

**Example:**
```
1. What feature are you testing? Customer Search
2. What actions should the test perform? Navigate to search, enter customer ID, click search
3. What should be verified? Results table visible, customer name shown
4. Does this test need login? yes
5. Any specific test data? customer ID: 700
```

---

### **Option 3: AI-Powered Generator (Requires OpenAI API)**

#### Setup:

1. Get an OpenAI API key from https://platform.openai.com/api-keys

2. Set the environment variable:
   ```powershell
   # Windows PowerShell
   $env:OPENAI_API_KEY="your-api-key-here"
   
   # Linux/Mac
   export OPENAI_API_KEY="your-api-key-here"
   ```

3. Add to your `.env` file:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

#### Usage:

```bash
node scripts/generate-test.js "Test description here"
```

**Examples:**

```bash
# Generate customer search test
node scripts/generate-test.js "Test customer search with ID 700 and verify results table"

# Generate order creation test
node scripts/generate-test.js "Create new order, fill form, submit, and verify in order list"

# Generate export test
node scripts/generate-test.js "Export data to Excel and validate download"
```

---

## 📝 Example Prompts

### Login Test
```
Generate a test that logs in with valid credentials, verifies home page loads, 
and checks that the Global Adjustment Header link is visible
```

### Form Submission Test
```
Generate a test that:
1. Uses authenticatedPage fixture
2. Navigates to Global Adjustment Header
3. Clicks Add New
4. Fills in: value=TEST, tValue=2.5, dates=2026-01-01 to 2026-12-31
5. Submits form
6. Verifies success message
```

### Search and Export Test
```
Generate a test that searches for customer 700, verifies results appear,
exports to Excel, and validates the downloaded file has .xlsx extension
```

### Error Handling Test
```
Generate a test that tries to submit a form with missing required fields
and verifies appropriate error messages are displayed
```

---

## 🎯 Best Practices

### Make Your Prompts Specific

❌ **Bad:** "Test the search feature"

✅ **Good:** "Test customer search by entering ID 700, clicking Search button, 
verifying results table contains at least 1 row, and customer name 'ABC Corp' is visible"

### Include Test Data

❌ **Bad:** "Fill in the form"

✅ **Good:** "Fill in form with: Customer=700, Amount=1500, Date=2026-01-15"

### Specify Assertions

❌ **Bad:** "Check if it works"

✅ **Good:** "Verify URL contains '/success', success message is visible, 
and results table has 5 rows"

---

## 🔧 Customization

### Modify the System Prompt

Edit `scripts/generate-test.js` to customize the AI's behavior:

```javascript
const SYSTEM_PROMPT = `You are an expert Playwright test engineer.

// Add your custom instructions here:
- Always use Page Object Model
- Include accessibility checks
- Add performance assertions
- etc.
`;
```

### Change the AI Model

```javascript
const MODEL = 'gpt-4';  // Most capable
// const MODEL = 'gpt-3.5-turbo';  // Faster, cheaper
```

---

## 💡 Tips

1. **Start Simple:** Generate basic tests first, then refine
2. **Review Generated Code:** AI isn't perfect - always review and test
3. **Iterate:** If the test isn't quite right, regenerate with more details
4. **Save Good Prompts:** Keep a library of prompts that work well
5. **Combine with Codegen:** Use `npx playwright codegen` to record actions, then ask AI to improve the code

---

## 🆘 Troubleshooting

### "OPENAI_API_KEY not set"
Set the environment variable as shown in Option 3 setup

### Generated test has errors
- Review the code
- Check selectors match your application
- Adjust timeouts if needed
- Add missing imports

### Test fails when run
- The AI generates based on description, not actual page structure
- Use Playwright Inspector to verify selectors: `npx playwright test --debug`
- Update selectors to match your actual page

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

