# 🔐 Simple Login Form - Playwright Tests

## 📋 What Was Created

Tests for a basic login form with:
- ✅ Email field
- ✅ Password field
- ✅ Submit button
- ✅ Forgot Password button

## 📁 Files Created

| File | Description |
|------|-------------|
| `tests/simple-login.spec.ts` | Comprehensive login tests (all scenarios) |
| `tests/login-essential.spec.ts` | Minimal essential tests (quick start) |
| `tests/login-with-pom.spec.ts` | Tests using Page Object Model |
| `pages/LoginPage.ts` | Page Object Model for login page |

## 🚀 Quick Start

### Step 1: Update the Login URL

Edit the test file and update the URL:

**In `tests/login-essential.spec.ts`:**
```typescript
const CONFIG = {
  loginUrl: 'https://your-actual-url.com/login', // ← Change this
  validEmail: 'your-test-email@example.com',
  validPassword: 'YourTestPassword123',
};
```

### Step 2: Run the Tests

```bash
# Run essential tests (recommended to start)
npx playwright test tests/login-essential.spec.ts --headed

# Run comprehensive tests
npx playwright test tests/simple-login.spec.ts --headed

# Run tests with Page Object Model
npx playwright test tests/login-with-pom.spec.ts --headed

# Run in debug mode
npx playwright test tests/login-essential.spec.ts --debug
```

## 📝 Test Coverage

### Essential Tests (`login-essential.spec.ts`)

✅ **Test 1: Valid Login**
- Enter valid email
- Enter valid password
- Click submit
- Verify login succeeds

✅ **Test 2: Empty Email**
- Leave email empty
- Enter password
- Click submit
- Verify validation error

✅ **Test 3: Empty Password**
- Enter email
- Leave password empty
- Click submit
- Verify validation error

✅ **Test 4: Invalid Email Format**
- Enter invalid email (e.g., "invalid-email")
- Enter password
- Click submit
- Verify email validation error

✅ **Test 5: Forgot Password**
- Click "Forgot Password" link
- Verify navigation to forgot password page

### Comprehensive Tests (`simple-login.spec.ts`)

Includes all essential tests PLUS:
- ✅ Verify all elements visible
- ✅ Wrong credentials error
- ✅ Field clearing behavior
- ✅ Submit button enable/disable states

## 🎯 Page Object Model Usage

### Basic Usage:

```typescript
import { LoginPage } from '../pages/LoginPage';

// Create page object
const loginPage = new LoginPage(page);

// Navigate to login page
await loginPage.goto('https://your-url.com/login');

// Verify elements
await loginPage.verifyAllElementsVisible();

// Enter credentials
await loginPage.enterEmail('user@example.com');
await loginPage.enterPassword('password123');
await loginPage.clickSubmit();

// Or use the helper method
await loginPage.login('user@example.com', 'password123');

// Click forgot password
await loginPage.clickForgotPassword();
```

### Available Methods:

**Navigation:**
- `goto(url)` - Navigate to login page

**Actions:**
- `enterEmail(email)` - Fill email field
- `enterPassword(password)` - Fill password field
- `clickSubmit()` - Click submit button
- `clickForgotPassword()` - Click forgot password link
- `login(email, password)` - Complete login flow
- `clearEmail()` - Clear email field
- `clearPassword()` - Clear password field

**Getters:**
- `getEmailValue()` - Get current email value
- `getPasswordValue()` - Get current password value
- `getEmailValidationMessage()` - Get email validation error
- `getPasswordValidationMessage()` - Get password validation error
- `isSubmitButtonEnabled()` - Check if submit is enabled

**Assertions:**
- `verifyEmailFieldVisible()`
- `verifyPasswordFieldVisible()`
- `verifySubmitButtonVisible()`
- `verifyForgotPasswordVisible()`
- `verifyAllElementsVisible()`

## 🔧 Customization

### Adjust Selectors for Your App

If your login form uses different selectors, update `pages/LoginPage.ts`:

```typescript
// Example: If your email field has id="username"
get emailInput() {
  return this.page.locator('#username');
}

// Example: If your submit button has specific text
get submitButton() {
  return this.page.locator('button:has-text("Sign In")');
}

// Example: If forgot password is a button, not a link
get forgotPasswordLink() {
  return this.page.locator('button#forgot-password');
}
```

### Add Success Verification

After login, verify success based on your app:

```typescript
test('should login successfully', async ({ page }) => {
  await loginPage.login(CONFIG.validEmail, CONFIG.validPassword);
  
  // Option 1: Check URL change
  await expect(page).toHaveURL(/dashboard|home/);
  
  // Option 2: Check for element on dashboard
  await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  
  // Option 3: Check for user menu
  await expect(page.locator('.user-menu')).toBeVisible();
});
```

### Test Error Messages

```typescript
test('should show specific error for wrong password', async ({ page }) => {
  await loginPage.login('valid@email.com', 'wrongpassword');
  
  // Check for specific error message
  const errorMessage = page.locator('.error-message, [role="alert"]');
  await expect(errorMessage).toContainText(/invalid|incorrect|wrong/i);
});
```

## 🎬 Record Your Own Login Flow

If the default selectors don't work, record your actual login flow:

```bash
# Record your login page
npx playwright codegen https://your-login-url.com

# Perform the actions:
# 1. Fill email
# 2. Fill password
# 3. Click submit
# 4. Click forgot password

# Copy the generated selectors and update LoginPage.ts
```

## 📊 Example Test Run Output

```
✓ should have all login elements visible
✓ should login successfully with valid credentials
✓ should show error for empty email
✓ should show error for empty password
✓ should show error for invalid email format
✓ should navigate to forgot password page

6 passed (12s)
```

## 🐛 Troubleshooting

### Problem: Selectors not found
**Solution:** Run codegen to get actual selectors:
```bash
npx playwright codegen your-login-url.com
```

### Problem: Tests fail in headless mode
**Solution:** Add waits:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
```

### Problem: Submit button doesn't work
**Solution:** Try different click methods:
```typescript
await submitButton.click({ force: true });
// or
await submitButton.press('Enter');
// or
await page.keyboard.press('Enter');
```

## 🎓 Which File Should I Use?

| Use Case | Recommended File |
|----------|------------------|
| Quick start, simple tests | `login-essential.spec.ts` |
| Comprehensive coverage | `simple-login.spec.ts` |
| Maintainable, scalable tests | `login-with-pom.spec.ts` |
| Multiple tests reusing login | `pages/LoginPage.ts` |

## 📚 Next Steps

1. ✅ Update login URL in test files
2. ✅ Update credentials for your test account
3. ✅ Run tests in headed mode first
4. ✅ Adjust selectors if needed (use codegen)
5. ✅ Add verification for successful login
6. ✅ Extend tests for your specific requirements

---

**Ready to test?** Start here:
```bash
# Update the URL in tests/login-essential.spec.ts, then:
npx playwright test tests/login-essential.spec.ts --headed
```

