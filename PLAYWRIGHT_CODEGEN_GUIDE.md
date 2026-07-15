# Playwright Code Generator (Codegen) Guide

## 🎬 What is Codegen?

Playwright's Codegen is a powerful tool that records your browser interactions and automatically generates test code. It's perfect for quickly creating test scripts without writing code from scratch.

## 🚀 How to Use Codegen

### Method 1: Basic Recording (Start from any URL)

```bash
npx playwright codegen https://your-website.com
```

This will:
1. Open a browser window
2. Open the Playwright Inspector (code generator window)
3. Start recording your actions
4. Generate code in real-time as you interact with the page

### Method 2: Record with Specific Browser

```bash
# Record in Chromium (default)
npx playwright codegen --browser=chromium https://your-website.com

# Record in Firefox
npx playwright codegen --browser=firefox https://your-website.com

# Record in WebKit (Safari)
npx playwright codegen --browser=webkit https://your-website.com
```

### Method 3: Record with Device Emulation

```bash
# Emulate iPhone 13
npx playwright codegen --device="iPhone 13" https://your-website.com

# Emulate iPad
npx playwright codegen --device="iPad Pro" https://your-website.com

# Emulate Pixel 5
npx playwright codegen --device="Pixel 5" https://your-website.com
```

### Method 4: Record with Custom Viewport

```bash
npx playwright codegen --viewport-size=1280,720 https://your-website.com
```

### Method 5: Record with Authentication

```bash
# Save authentication state
npx playwright codegen --save-storage=auth.json https://your-website.com

# Reuse authentication state
npx playwright codegen --load-storage=auth.json https://your-website.com
```

### Method 6: Record in Specific Output Language

```bash
# Generate TypeScript (default)
npx playwright codegen --target=typescript https://your-website.com

# Generate JavaScript
npx playwright codegen --target=javascript https://your-website.com

# Generate Python
npx playwright codegen --target=python https://your-website.com

# Generate C#
npx playwright codegen --target=csharp https://your-website.com

# Generate Java
npx playwright codegen --target=java https://your-website.com
```

## 📝 Recording Actions

When the Codegen window opens, you can:

1. **Click elements** - Automatically recorded
2. **Fill text fields** - Records input
3. **Select dropdowns** - Records selections
4. **Check/uncheck boxes** - Records state changes
5. **Navigate pages** - Records navigation
6. **Hover elements** - Records hover actions
7. **Press keys** - Records keyboard actions

## 🎯 Playwright Inspector Features

### Recording Controls:
- **Record** - Start/stop recording
- **Pause** - Pause recording
- **Resume** - Resume recording
- **Clear** - Clear recorded actions

### Assertion Recording:
Click the **"Assert"** button to add assertions:
- Assert visibility
- Assert text content
- Assert value
- Assert enabled/disabled state

### Selector Tools:
- **Pick Locator** - Click elements to see their selectors
- **Edit Locator** - Manually edit and test selectors
- **Explore** - Highlight elements on the page

## 💡 Best Practices

1. **Start Simple**: Record basic flows first, then enhance
2. **Use Assertions**: Click "Assert" to add verification points
3. **Clean Up Code**: Generated code may need refinement
4. **Test Selectors**: Use "Pick Locator" to find better selectors
5. **Save Often**: Copy generated code frequently

## 🔧 Advanced Usage

### Record from Existing Test

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  // Your existing setup code
  await page.goto('https://example.com');
  
  // Then use codegen to continue recording
  await page.pause(); // Opens inspector for manual interaction
});
```

Run with:
```bash
npx playwright test --debug
```

### Record with Headed Mode

```bash
npx playwright codegen --headed https://your-website.com
```

### Record with Slow Motion

```bash
npx playwright codegen --slowmo=1000 https://your-website.com
```

## 📋 Example Output

When you record actions, Codegen generates code like:

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## 🎨 Using Codegen for Your Project

For your current project at `c:\Users\JJesudoss\playwright-new`, use:

```bash
# Navigate to your project
cd c:\Users\JJesudoss\playwright-new

# Start recording
npx playwright codegen http://localhost:3000
# or your actual application URL
```

## 📖 Additional Resources

- Official Docs: https://playwright.dev/docs/codegen
- Video Tutorial: https://playwright.dev/docs/videos
- API Reference: https://playwright.dev/docs/api/class-playwright

