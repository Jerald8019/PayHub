# 📧 Payroll Download Email Automation - Test Implementation Guide

## 📋 Jira Story Summary

**As a Payroll Director**  
I want the Payroll Download Option 0239-15-11-13 to automatically email me the download files with the week ending date in the filename  
So that all downloads are captured and clearly identifiable

---

## ✅ Generated Test File

**Location:** `tests/payrolldownloademailautomation.spec.ts`

**Test Coverage:**
1. ✅ Automatically email payroll files with week ending date
2. ✅ Handle multiple files with correct naming
3. ✅ Prevent file overwrite by emailing before next week

---

## 🎯 What the Test Validates

### Functional Requirements:
- [x] Navigate to Payroll Download Option 0239-15-11-13
- [x] Process offline payroll for specific week ending date
- [x] Automatically email files to payrollgroup@ashleyfurniture.com
- [x] Include week ending date in filename (PayrollOffline_YYYY-MM-DD.csv)
- [x] Use SVPASEML email service
- [x] CSV format compatible with UKG upload
- [x] No quotes around records in CSV
- [x] Multiple files handled correctly
- [x] Files not overwritten between weeks

---

## 🔧 Implementation Steps

### Step 1: Find the Correct Selectors

Use Playwright Inspector to find selectors:
```bash
npx playwright codegen https://stage.ashleynet.com
```

**Selectors to find:**
- Payroll menu link
- Option 0239-15-11-13 link
- Week ending date input field
- Process Offline button
- Success message element
- File list/attachment display
- Email recipient display

### Step 2: Update Navigation Path

Replace this TODO:
```typescript
// TODO: Update with actual navigation path
await page.goto('/SiteHome/Forms/Home.aspx?hmt=1&hph=1');
await page.getByRole('link', { name: 'Payroll' }).click();
```

With actual path from your application.

### Step 3: Update Form Selectors

Replace:
```typescript
await page.locator('#txt_week_ending_date').fill(TEST_DATA.weekEndingDate);
```

With the actual selector for the week ending date field.

### Step 4: Verify Email Functionality

Since this is an automated email feature, you have several testing options:

#### Option A: UI Verification (Recommended for E2E)
```typescript
// Verify success message appears
await expect(page.getByText('Files emailed successfully')).toBeVisible();

// Verify email recipient is shown
await expect(page.getByText('payrollgroup@ashleyfurniture.com')).toBeVisible();
```

#### Option B: Database Verification
```typescript
// Check email queue table
const emailSent = await checkEmailQueue({
  recipient: 'payrollgroup@ashleyfurniture.com',
  service: 'SVPASEML',
  weekEnding: '2026-01-10'
});
expect(emailSent).toBe(true);
```

#### Option C: Email Service API
```typescript
// Query SVPASEML service
const emails = await querySVPASEML({
  recipient: 'payrollgroup@ashleyfurniture.com',
  dateRange: 'today'
});
expect(emails.length).toBeGreaterThan(0);
```

### Step 5: Verify File Naming

```typescript
// Get filename from UI
const filename = await page.locator('.filename').textContent();

// Verify pattern: PayrollOffline_2026-01-10.csv
expect(filename).toMatch(/PayrollOffline_\d{4}-\d{2}-\d{2}\.csv/);
expect(filename).toContain('2026-01-10');
```

### Step 6: Verify CSV Format (Optional)

If you can download the file:
```typescript
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download' }).click();
const download = await downloadPromise;

// Save and verify
const path = await download.path();
const fs = require('fs');
const content = fs.readFileSync(path, 'utf-8');

// Verify no quotes around records
const lines = content.split('\n');
lines.forEach(line => {
  // Should not have quotes around entire record
  expect(line).not.toMatch(/^".*"$/);
});

// Verify CSV is valid
expect(content).toMatch(/^[^,]+,[^,]+/); // Basic CSV structure
```

---

## 🧪 Test Scenarios

### Scenario 1: Happy Path
```typescript
test('should email files with correct naming', async ({ page }) => {
  // 1. Navigate to option 0239-15-11-13
  // 2. Enter week ending date: 2026-01-10
  // 3. Click Process Offline
  // 4. Verify email sent successfully
  // 5. Verify filename: PayrollOffline_2026-01-10.csv
});
```

### Scenario 2: Multiple Files
```typescript
test('should email all files with week ending date', async ({ page }) => {
  // 1. Process offline
  // 2. Verify multiple files listed
  // 3. Verify each has week ending date
  // 4. Verify all are CSV format
});
```

### Scenario 3: No Overwrite
```typescript
test('should keep separate files for different weeks', async ({ page }) => {
  // 1. Process week 2026-01-10
  // 2. Process week 2026-01-17
  // 3. Verify both weeks have separate files
  // 4. Verify no overwrite occurred
});
```

---

## 📊 Test Data

```typescript
const TEST_DATA = {
  payrollOption: '0239-15-11-13',
  weekEndingDate: '2026-01-10',
  emailRecipient: 'payrollgroup@ashleyfurniture.com',
  expectedFilenamePattern: /PayrollOffline_\d{4}-\d{2}-\d{2}\.csv/,
  successMessage: 'Files emailed successfully',
  emailService: 'SVPASEML'
};
```

---

## 🚀 Running the Tests

```bash
# Run all payroll tests
npx playwright test payrolldownloademailautomation.spec.ts

# Run specific test
npx playwright test payrolldownloademailautomation.spec.ts -g "should automatically email"

# Run with UI mode
npx playwright test payrolldownloademailautomation.spec.ts --ui

# Debug mode
npx playwright test payrolldownloademailautomation.spec.ts --debug

# Run and show trace
npx playwright test payrolldownloademailautomation.spec.ts --trace on
npx playwright show-trace trace.zip
```

---

## 🐛 Troubleshooting

### Issue: Email not sent
**Check:**
- SVPASEML service is running
- Email configuration is correct
- Network connectivity
- Check application logs

### Issue: Filename doesn't match pattern
**Verify:**
- Week ending date is correctly formatted
- Filename generation logic
- Date parsing in the application

### Issue: CSV has quotes
**Solution:**
- Check CSV export settings
- Verify UKG format requirements
- Update export configuration

### Issue: Files overwritten
**Check:**
- File naming includes date
- Storage location
- Email attachment logic

---

## 💡 Best Practices

### 1. Use Helper Functions
```typescript
async function processPayrollOffline(page, weekEndingDate) {
  await page.goto('/payroll/option/0239-15-11-13');
  await page.locator('#txt_week_ending_date').fill(weekEndingDate);
  await page.getByRole('button', { name: 'Process Offline' }).click();
  await expect(page.getByText('Files emailed successfully')).toBeVisible();
}
```

### 2. Verify Email in Test Environment
```typescript
// Use test email address
const TEST_EMAIL = 'payroll-test@ashleyfurniture.com';

// Or mock email service
await page.route('**/api/email/send', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true })
  });
});
```

### 3. Clean Up Test Data
```typescript
test.afterEach(async ({ page }) => {
  // Delete test emails
  // Clear test files
  // Reset state
});
```

---

## 📚 Related Documentation

- [Jira Generator Tutorial](JIRA_GENERATOR_TUTORIAL.md)
- [Test Generators Comparison](TEST_GENERATORS_COMPARISON.md)
- [Quick Reference](QUICK_REFERENCE.md)

---

## ✅ Acceptance Criteria Checklist

- [ ] Files automatically emailed when offline processes
- [ ] Email sent to payrollgroup@ashleyfurniture.com
- [ ] Week ending date added to filename
- [ ] Filename format: PayrollOffline_YYYY-MM-DD.csv
- [ ] CSV format compatible with UKG
- [ ] No quotes around records
- [ ] Uses SVPASEML email service
- [ ] Similar to Delivered Commissions format
- [ ] All download files included in email
- [ ] Files not overwritten between weeks

---

**Ready to implement! 🚀**

