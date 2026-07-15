# Playwright Test Generator Prompt

Use this prompt with ChatGPT, Claude, or GitHub Copilot to generate Playwright tests instantly.

---

## Prompt Template

```
You are a Playwright test automation expert. Generate a complete Playwright test based on the following requirements:

**Project Context:**
- Base URL: https://stage.ashleynet.com
- Authentication: Uses fixtures/auth.ts with `authenticatedPage` fixture
- Framework: Playwright with TypeScript
- Test structure: Use test.describe() for grouping, test.step() for clarity

**Test Requirements:**
[DESCRIBE YOUR TEST SCENARIO HERE]

**Example:**
- Navigate to [PAGE/FEATURE]
- Perform [ACTION]
- Verify [EXPECTED RESULT]

**Code Style:**
- Use descriptive test names
- Add assertions with expect()
- Extract test data to constants
- Add comments for complex logic
- Use Page Object Model if multiple tests share selectors

**Output Format:**
Provide complete TypeScript code ready to paste into a .spec.ts file.
```

---

## Example Usage

### Example 1: Generate Login Test
```
Generate a Playwright test that:
1. Logs in with valid credentials
2. Verifies the user is redirected to the home page
3. Checks that "Welcome" message is visible
4. Logs out successfully
```

### Example 2: Generate Form Test
```
Generate a Playwright test for a customer search form that:
1. Uses authenticatedPage fixture
2. Navigates to Customer Search page
3. Fills in customer number "12345"
4. Clicks Search button
5. Verifies results table contains at least 1 row
6. Verifies customer name is displayed
7. Exports results to Excel and validates download
```

### Example 3: Generate E2E Workflow Test
```
Generate a Playwright test for creating a new order:
1. Login and navigate to Orders page
2. Click "Create New Order"
3. Fill in order details (customer, product, quantity, date)
4. Submit the order
5. Verify success message
6. Verify order appears in orders list
7. Click on the order to view details
8. Verify all details match what was entered
```

---

## Tips for Better Test Generation

1. **Be Specific:** Provide exact button names, field labels, URLs
2. **Include Test Data:** Specify what values to use
3. **Mention Assertions:** State what should be verified
4. **Reference Existing Code:** Point to similar tests or page objects
5. **Specify Edge Cases:** Include error scenarios, validations

---

## Advanced: Custom Instructions for GitHub Copilot

Add this to your `.github/copilot-instructions.md`:

```markdown
When generating Playwright tests:
- Always import from '../fixtures/auth' for authentication
- Use authenticatedPage fixture for tests requiring login
- Follow this structure:
  * test.describe() for grouping
  * test.step() for multi-step tests
  * Extract test data to constants at top
  * Add meaningful assertions
  * Include error handling
- Use these naming conventions:
  * Test files: feature-name.spec.ts
  * Test names: "should [action] when [condition]"
- Always add TypeScript types
- Prefer getByRole() over locator() when possible
```

