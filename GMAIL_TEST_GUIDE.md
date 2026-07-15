# 📧 Gmail Login Test Suite Guide

## 📁 Files Created

1. **`tests/gmail-login.spec.ts`** - Basic Gmail login tests
2. **`tests/gmail-advanced.spec.ts`** - Advanced tests using Page Object Model
3. **`fixtures/gmail-auth.ts`** - Gmail authentication fixture and Page Object Model

## 🚀 Quick Start

### Step 1: Set Up Credentials

**Option A: Using Environment Variables (Recommended)**
```bash
# Windows PowerShell
$env:GMAIL_EMAIL = "your-email@gmail.com"
$env:GMAIL_PASSWORD = "your-password"

# Windows CMD
set GMAIL_EMAIL=your-email@gmail.com
set GMAIL_PASSWORD=your-password
```

**Option B: Using .env File**
Create a `.env` file in your project root:
```
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-password
```

**Option C: Edit Test Files Directly** (Not recommended for security)
Update the credentials in the test files directly.

### Step 2: Run the Tests

```bash
# Run basic Gmail tests
npx playwright test tests/gmail-login.spec.ts --headed

# Run advanced tests with Page Object Model
npx playwright test tests/gmail-advanced.spec.ts --headed

# Run in debug mode
npx playwright test tests/gmail-login.spec.ts --debug

# Run specific test
npx playwright test tests/gmail-login.spec.ts -g "should login to Gmail successfully"
```

## ⚠️ Important Notes

### Security Considerations

1. **Never commit credentials** to version control
2. **Add to .gitignore**:
   ```
   .env
   gmail-auth.json
   *-auth.json
   ```

3. **Use App-Specific Passwords** for Gmail:
   - Go to Google Account → Security → 2-Step Verification
   - Generate an App Password
   - Use that password instead of your regular password

### Gmail Security Features

#### 2-Factor Authentication (2FA)
If your account has 2FA enabled:
- Tests will pause at 2FA prompt
- You'll need to manually enter the code
- Or use the saved authentication approach

#### CAPTCHA
Gmail might show CAPTCHA for:
- New/suspicious login attempts
- Automated browser detection
- Multiple failed login attempts

**Solutions:**
1. Use saved authentication state (run once manually, then reuse)
2. Use Google OAuth instead of direct login
3. Test in headed mode first to bypass CAPTCHA manually

### Saved Authentication

The advanced test suite can save your login session:

```typescript
// After successful login, save the state
await gmailPage.saveAuthState();
```

This creates `gmail-auth.json` that can be reused:
```bash
# Future tests will use saved authentication automatically
npx playwright test tests/gmail-advanced.spec.ts
```

## 📝 Test Coverage

### Basic Tests (`gmail-login.spec.ts`)

✅ **Happy Path:**
- Enter email → Click Next → Enter password → Click Next → Verify inbox

✅ **Error Scenarios:**
- Invalid email format
- Wrong password

### Advanced Tests (`gmail-advanced.spec.ts`)

✅ **Enhanced Features:**
- Page Object Model for maintainability
- "Remember me" checkbox handling
- Email format validation
- Navigation back from password to email
- 2FA detection
- Authentication state persistence

## 🎯 Page Object Model

The `GmailLoginPage` class provides reusable methods:

```typescript
const gmailPage = new GmailLoginPage(page);

// Individual steps
await gmailPage.goto();
await gmailPage.enterEmail('user@gmail.com');
await gmailPage.clickNextAfterEmail();
await gmailPage.enterPassword('password');
await gmailPage.clickNextAfterPassword();
await gmailPage.verifyLoginSuccess();

// Or all in one
await gmailPage.login('user@gmail.com', 'password');
```

## 🛠️ Customization

### Add More Gmail Actions

Extend the `GmailLoginPage` class in `fixtures/gmail-auth.ts`:

```typescript
async composeEmail(to: string, subject: string, body: string) {
  await this.page.locator('[gh="cm"]').click(); // Compose button
  await this.page.locator('input[aria-label="To"]').fill(to);
  await this.page.locator('input[name="subjectbox"]').fill(subject);
  await this.page.locator('[aria-label="Message Body"]').fill(body);
}

async sendEmail() {
  await this.page.locator('div[aria-label*="Send"]').click();
}
```

### Handle Different Gmail Views

Gmail has different UI for:
- Desktop (full view)
- Basic HTML view
- Mobile view

Adjust selectors accordingly or use Playwright's mobile device emulation.

## 🐛 Troubleshooting

### Problem: Email input not found
**Solution:** Gmail might redirect to a different page. Check the URL:
```typescript
console.log('Current URL:', page.url());
await page.screenshot({ path: 'debug.png' });
```

### Problem: 2FA blocks automation
**Solutions:**
1. Use saved authentication state
2. Disable 2FA on test account (not recommended for production)
3. Use Google OAuth flow instead

### Problem: "This browser is not secure" warning
**Solution:** Gmail might block Playwright. Try:
```typescript
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
});
```

### Problem: Tests work in headed mode but fail in headless
**Solution:** Add delays or better waits:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
```

## 📚 Additional Resources

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail Automation Best Practices](https://playwright.dev/docs/best-practices)

## 🎓 Next Steps

1. ✅ Set up credentials securely
2. ✅ Run basic test to verify login works
3. ✅ Save authentication state
4. ✅ Extend tests to compose/send emails
5. ✅ Add tests for inbox, search, labels, etc.
6. ✅ Integrate with your CI/CD pipeline


