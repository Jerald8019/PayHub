# 📧 Gmail Playwright Tests - Quick Reference

## 🚀 Quick Commands

### Run Tests
```bash
# Basic login test
npx playwright test tests/gmail-login.spec.ts --headed

# Advanced login with POM
npx playwright test tests/gmail-advanced.spec.ts --headed

# Email operations (compose, send, search)
npx playwright test tests/gmail-email-operations.spec.ts --headed

# Run specific test
npx playwright test tests/gmail-login.spec.ts -g "should login to Gmail successfully"

# Debug mode
npx playwright test tests/gmail-login.spec.ts --debug
```

### Set Credentials
```powershell
# PowerShell
$env:GMAIL_EMAIL = "your-email@gmail.com"
$env:GMAIL_PASSWORD = "your-app-password"

# Then run tests
npx playwright test tests/gmail-advanced.spec.ts --headed
```

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `tests/gmail-login.spec.ts` | Basic login tests (happy path + errors) |
| `tests/gmail-advanced.spec.ts` | Advanced login with POM, 2FA detection |
| `tests/gmail-email-operations.spec.ts` | Compose, send, search, archive emails |
| `fixtures/gmail-auth.ts` | Page Object Model + authentication fixture |
| `GMAIL_TEST_GUIDE.md` | Complete documentation |

## 🎯 Test Features

### Login Tests
✅ Valid login flow  
✅ Invalid email format  
✅ Wrong password  
✅ "Remember me" checkbox  
✅ Navigate back from password to email  
✅ 2FA detection  
✅ Save/load authentication state  

### Email Operations Tests
✅ Compose and send email  
✅ Save email as draft  
✅ Search emails  
✅ Open and read email  
✅ Archive email  
✅ Delete email (skipped by default)  

## 🔧 Page Object Model Methods

```typescript
const gmailPage = new GmailLoginPage(page);

// Login
await gmailPage.goto();
await gmailPage.login(email, password);
await gmailPage.verifyLoginSuccess();
await gmailPage.saveAuthState();

// Email Operations
await gmailPage.clickCompose();
await gmailPage.fillEmailRecipient('to@example.com');
await gmailPage.fillEmailSubject('Test Subject');
await gmailPage.fillEmailBody('Test Body');
await gmailPage.clickSend();

// Or all in one:
await gmailPage.composeAndSendEmail('to@example.com', 'Subject', 'Body');

// Search & Navigate
await gmailPage.searchEmails('subject:test');
await gmailPage.openFirstEmail();
await gmailPage.archiveCurrentEmail();
await gmailPage.deleteCurrentEmail();
```

## ⚠️ Important Notes

### Security
- **Use App-Specific Passwords**, not your main Gmail password
- **Never commit credentials** to git
- **Add to .gitignore**: `.env`, `gmail-auth.json`

### Gmail App Password Setup
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App passwords
4. Generate a new app password
5. Use that password in your tests

### 2FA Handling
If you have 2FA enabled:
1. Run test in headed mode once
2. Complete 2FA manually
3. Let the test save auth state
4. Future tests will use saved auth

### Common Issues

**Problem:** Email input not found  
**Fix:** Check if Gmail redirected to a different page

**Problem:** Tests fail in headless mode  
**Fix:** Add waits: `await page.waitForLoadState('networkidle')`

**Problem:** "This browser is not secure" warning  
**Fix:** Use saved authentication state after first manual login

## 🎓 Example Workflow

### First Time Setup
```bash
# 1. Set credentials
$env:GMAIL_EMAIL = "your-email@gmail.com"
$env:GMAIL_PASSWORD = "your-app-password"

# 2. Run in headed mode to handle any 2FA/CAPTCHA
npx playwright test tests/gmail-advanced.spec.ts --headed -g "should login"

# 3. After successful login, auth is saved to gmail-auth.json
```

### Subsequent Tests
```bash
# Future tests use saved authentication automatically
npx playwright test tests/gmail-email-operations.spec.ts --headed
```

## 📝 Customization Examples

### Send email to yourself
```typescript
await gmailPage.composeAndSendEmail(
  GMAIL_CREDENTIALS.email, // Send to yourself
  'Test Email',
  'This is a test from Playwright'
);
```

### Search for specific emails
```typescript
// Search by subject
await gmailPage.searchEmails('subject:"invoice"');

// Search by sender
await gmailPage.searchEmails('from:noreply@example.com');

// Search by date
await gmailPage.searchEmails('after:2024/01/01');

// Combine criteria
await gmailPage.searchEmails('from:boss subject:urgent');
```

### Add attachments
```typescript
// Extend GmailLoginPage class:
async addAttachment(filePath: string) {
  const fileInput = this.page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
}

// Use in test:
await gmailPage.clickCompose();
await gmailPage.addAttachment('./test-file.pdf');
```

## 🎬 Recording Your Own Gmail Tests

```bash
# Record new Gmail interactions
npx playwright codegen mail.google.com

# Login manually, then record your actions
# Copy the generated code and clean it up using the patterns above
```

## 📚 Documentation Links

- **Main Guide:** `GMAIL_TEST_GUIDE.md`
- **Test Files:** `tests/gmail-*.spec.ts`
- **Page Object Model:** `fixtures/gmail-auth.ts`
- **Playwright Docs:** https://playwright.dev/docs/intro

---

**Need Help?** Check the full guide in `GMAIL_TEST_GUIDE.md`

