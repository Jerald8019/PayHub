# 🤖 Test Generators Comparison

Your project has **3 different test generators**. Here's when to use each one:

---

## 📊 Quick Comparison

| Feature | Jira Generator | Interactive | AI-Powered |
|---------|---------------|-------------|------------|
| **Command** | `npm run generate:jira` | `npm run generate:interactive` | `npm run generate:test` |
| **Input** | Acceptance criteria | Answer questions | Natural language |
| **Setup Required** | None | None | OpenAI API key |
| **Best For** | Converting Jira tickets | Quick tests | Complex scenarios |
| **Speed** | ⚡ Fast | ⚡ Fast | 🐌 Slower (API call) |
| **Quality** | 📝 Template | 📝 Template | 🎯 Smart code |
| **Cost** | Free | Free | Paid (OpenAI) |

---

## 1️⃣ Jira Acceptance Criteria Generator

### When to Use:
- ✅ You have Jira acceptance criteria ready
- ✅ You want to quickly convert tickets to tests
- ✅ You prefer structured Given/When/Then format
- ✅ You want consistent test structure

### Usage:
```bash
npm run generate:jira
```

Then paste your acceptance criteria or use a file:
```bash
node scripts/jira-test-generator.js criteria.txt
```

### Example Input:
```
Given I am logged in as admin
When I navigate to customer search
And I enter customer ID "700"
Then I should see customer details
```

### Pros:
- ✅ No API key needed
- ✅ Works offline
- ✅ Supports multiple formats (Given/When/Then, bullets, numbered)
- ✅ Auto-extracts test data
- ✅ Detects auth requirements

### Cons:
- ❌ Generates template code (needs manual implementation)
- ❌ Doesn't generate actual selectors

---

## 2️⃣ Interactive Generator

### When to Use:
- ✅ You want guided test creation
- ✅ You prefer answering questions
- ✅ You're new to test automation
- ✅ You want quick scaffolding

### Usage:
```bash
npm run generate:interactive
```

Answer 5 simple questions:
1. What feature are you testing?
2. What actions should the test perform?
3. What should be verified?
4. Does this test need login?
5. Any specific test data?

### Pros:
- ✅ Very beginner-friendly
- ✅ No API key needed
- ✅ Works offline
- ✅ Quick and simple

### Cons:
- ❌ Generates template code only
- ❌ Less structured than Jira generator
- ❌ Manual Q&A can be tedious for many tests

---

## 3️⃣ AI-Powered Generator (OpenAI)

### When to Use:
- ✅ You want intelligent code generation
- ✅ You have complex scenarios
- ✅ You want actual selectors suggested
- ✅ You have an OpenAI API key

### Usage:
```bash
npm run generate:test "Test description here"
```

Example:
```bash
npm run generate:test "Create a test that searches for customer 700 and verifies the results table shows customer name"
```

### Setup:
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Set environment variable:
   ```bash
   $env:OPENAI_API_KEY="your-key-here"  # Windows
   export OPENAI_API_KEY="your-key-here"  # Linux/Mac
   ```

### Pros:
- ✅ Generates smarter code
- ✅ Suggests actual selectors
- ✅ Better test structure
- ✅ Can handle complex scenarios

### Cons:
- ❌ Requires OpenAI API key (costs money)
- ❌ Needs internet connection
- ❌ Slower (API call takes time)
- ❌ May generate incorrect selectors (still needs review)

---

## 🎯 Recommendation by Scenario

### Scenario 1: Converting Jira Tickets
**Use:** Jira Generator (`npm run generate:jira`)
- Copy acceptance criteria from Jira
- Paste into generator
- Get structured test template

### Scenario 2: Quick Test Creation
**Use:** Interactive Generator (`npm run generate:interactive`)
- Answer 5 questions
- Get basic test scaffold
- Fill in the details

### Scenario 3: Complex Test with AI Help
**Use:** AI-Powered Generator (`npm run generate:test`)
- Describe what you want in plain English
- Get intelligent code suggestions
- Review and adjust

### Scenario 4: No Internet / No API Key
**Use:** Jira or Interactive Generator
- Both work offline
- No external dependencies
- Free to use

---

## 💡 Best Practice Workflow

1. **Start with a generator** (any of the 3)
2. **Review the generated code**
3. **Implement the TODOs** with actual selectors
4. **Run the test** with `npx playwright test your-test.spec.ts`
5. **Debug with Playwright Inspector** if needed: `npx playwright test --debug`
6. **Iterate until it passes**

---

## 📚 More Information

- [Jira Generator Guide](JIRA_TEST_GENERATOR.md)
- [AI Generator Guide](TEST_GENERATOR_GUIDE.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Sample Tests](SAMPLE_TESTS_DEMO.md)

