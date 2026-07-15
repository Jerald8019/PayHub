# 🎬 Quick Start: Recording Playwright Tests

## ⚡ Fastest Way to Start Recording

### Step 1: Open Terminal in Your Project
```bash
cd c:\Users\JJesudoss\playwright-new
```

### Step 2: Start Recording
```bash
# Replace with your actual application URL
npx playwright codegen http://localhost:3000
```

Or for an external website:
```bash
npx playwright codegen https://www.google.com
```

## 🎯 What Happens When You Run This?

1. **Two windows will open:**
   - 🌐 **Browser Window**: Where you perform your actions
   - 📝 **Playwright Inspector**: Shows the generated code in real-time

2. **Everything you do is recorded:**
   - ✅ Clicks
   - ✅ Typing
   - ✅ Selecting dropdowns
   - ✅ Checking checkboxes
   - ✅ Navigation

3. **Code is generated automatically** in the Inspector window

## 📋 Step-by-Step Recording Process

### 1. Start Codegen
```bash
npx playwright codegen https://your-app-url.com
```

### 2. Perform Your Actions in the Browser
- Navigate to pages
- Click buttons
- Fill forms
- Select options

### 3. Add Assertions (Verifications)
- In the Inspector, click **"Assert"** button
- Click on elements you want to verify
- Choose assertion type:
  - ✅ Assert visibility
  - ✅ Assert text
  - ✅ Assert value

### 4. Copy Generated Code
- Click **"Copy"** button in the Inspector
- Paste into your test file

### 5. Save to File (Optional)
```bash
# Save directly to a file
npx playwright codegen -o tests/my-new-test.spec.ts https://your-app-url.com
```

## 🎨 Common Recording Scenarios

### Recording Login Flow
```bash
npx playwright codegen http://your-app.com/login
```

Then in browser:
1. Fill username
2. Fill password
3. Click login button
4. Click "Assert" → verify you're logged in

### Recording Form Submission
```bash
npx playwright codegen http://your-app.com/form
```

Then in browser:
1. Fill all form fields
2. Select dropdowns
3. Upload files
4. Click submit
5. Click "Assert" → verify success message

### Recording with Existing Authentication
```bash
# First, login and save state
npx playwright codegen --save-storage=auth.json http://your-app.com

# Later, reuse the login state
npx playwright codegen --load-storage=auth.json http://your-app.com/dashboard
```

## 🔍 Using Inspector with Existing Tests

If you want to debug or continue recording from an existing test:

### Method 1: Add `page.pause()` to your test
```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Inspector will open here - you can interact with the page
  await page.pause();
  
  // Continue with your test...
});
```

Run with:
```bash
npx playwright test my-test.spec.ts
```

### Method 2: Run in Debug Mode
```bash
# Debug a specific test
npx playwright test tests/gah.spec.ts --debug

# Debug all tests
npx playwright test --debug
```

## 💡 Pro Tips

### 1. **Pick Better Selectors**
In the Inspector:
- Click **"Pick Locator"** button
- Hover over elements to see their selectors
- Use the best selector (role, text, test-id)

### 2. **Record in Different Browsers**
```bash
# Chrome
npx playwright codegen --browser=chromium https://example.com

# Firefox  
npx playwright codegen --browser=firefox https://example.com

# Safari
npx playwright codegen --browser=webkit https://example.com
```

### 3. **Record Mobile Tests**
```bash
# iPhone
npx playwright codegen --device="iPhone 13" https://example.com

# Android
npx playwright codegen --device="Pixel 5" https://example.com
```

### 4. **Slow Down Recording**
```bash
npx playwright codegen --slowmo=500 https://example.com
```

### 5. **Generate Different Languages**
```bash
# TypeScript (default)
npx playwright codegen --target=playwright-test https://example.com

# JavaScript
npx playwright codegen --target=javascript https://example.com

# Python
npx playwright codegen --target=python https://example.com
```

## 🚀 Try It Now!

Run this command right now to see it in action:
```bash
npx playwright codegen https://www.google.com
```

Then:
1. Type something in the search box
2. Click the search button
3. Look at the Inspector - you'll see the code!
4. Click "Copy" and paste it into a new test file

## 📝 Example Generated Code

After recording, you might get:
```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).fill('playwright');
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');
  await expect(page.getByText('Playwright')).toBeVisible();
});
```

You can then refine this code and add it to your test suite!

## 🆘 Troubleshooting

**Inspector doesn't open?**
- Make sure you have Playwright installed: `npm install -D @playwright/test`
- Update Playwright: `npm install -D @playwright/test@latest`

**Recording not working?**
- Check if the browser opened
- Look for the Inspector window (might be behind other windows)
- Try running with `--headed` flag

**Need help?**
- Check official docs: https://playwright.dev/docs/codegen
- Ask in your terminal: `npx playwright codegen --help`

