# 🎯 Global Adjustment Header Popup Test - Complete Guide

## ✅ Test Successfully Created!

**File:** `tests/gah.spec.ts`

---

## 🔍 Key Discoveries from Your Recording

### Important Finding: **Popup Opens in NEW WINDOW** 🪟
The Global Adjustment Header form doesn't open as a modal dialog - it opens in a **separate browser window**!

This is why we need to use:
```typescript
const popupPromise = page.waitForEvent('popup');
await page.getByRole('button', { name: 'Add New' }).click();
const popup = await popupPromise;
```

---

## 📋 Actual Selectors Found

| Field | Selector | Type | Example Value |
|-------|----------|------|---------------|
| Credit Code | `#txtcreditcode` | Text Input | `'MSC'` |
| Calculation Level | `#calculationlevel` | Dropdown | `'1'` |
| Rounding | `#drpRoduning` | Dropdown | `'Full'` |
| Submit Button | `'Submit and Close'` | Button | - |

---

## 🎯 Test Flow

### Step 1: Navigate to Page
```typescript
await navigateToGlobalAdjustment(page);
await expect(page.getByRole('button', { name: 'Add New' })).toBeVisible();
```

### Step 2: Open Popup Window
```typescript
const popupPromise = page.waitForEvent('popup');
await page.getByRole('button', { name: 'Add New' }).click();
const popup = await popupPromise;
```

### Step 3: Fill Credit Code (Text Input)
```typescript
await popup.locator('#txtcreditcode').fill('MSC');
```

### Step 4: Select Calculation Level (Dropdown)
```typescript
await popup.locator('#calculationlevel').selectOption('1');
```

### Step 5: Select Rounding (Dropdown)
```typescript
await popup.locator('#drpRoduning').selectOption('Full');
```

### Step 6: Submit
```typescript
await popup.getByRole('button', { name: 'Submit and Close' }).click();
```

---

## 🚀 Running the Test

```bash
# Run the test
npx playwright test gah.spec.ts

# Run with UI mode (recommended)
npx playwright test gah.spec.ts --ui

# Debug mode
npx playwright test gah.spec.ts --debug

# Run specific test
npx playwright test gah.spec.ts -g "should open popup"
```

---

## 📊 Test Data

You can customize the test data in the `TEST_DATA` object:

```typescript
const TEST_DATA = {
  creditCode: 'MSC',           // Change to test different credit codes
  calculationLevel: '1',       // Change to test different levels
  rounding: 'Full'             // Change to 'Half', 'None', etc.
};
```

---

## 💡 Key Learnings

### 1. **Popup vs Modal**
- ❌ NOT a modal dialog (stays on same page)
- ✅ IS a popup window (opens new browser window)
- Must use `page.waitForEvent('popup')`

### 2. **Credit Code is Text Input**
- ❌ NOT a dropdown
- ✅ IS a text input field
- Use `.fill()` instead of `.selectOption()`

### 3. **Submit Button Text**
- ❌ NOT "Submit And Close" (capital A)
- ✅ IS "Submit and Close" (lowercase a)

### 4. **Dropdown Values**
- Calculation Level uses numeric values: `'1'`, `'2'`, etc.
- Rounding uses text values: `'Full'`, `'Half'`, etc.

---

## 🧪 What the Test Does

1. ✅ Logs in automatically (using `authenticatedPage` fixture)
2. ✅ Navigates to Global Adjustment Header page
3. ✅ Clicks "Add New" button
4. ✅ Waits for popup window to open
5. ✅ Fills in Credit Code text field
6. ✅ Selects Calculation Level from dropdown
7. ✅ Selects Rounding from dropdown
8. ✅ Verifies all fields are filled correctly
9. ✅ Clicks "Submit and Close" button
10. ✅ Verifies popup closes successfully

---

## 🔧 Customization Options

### Test Different Values
```typescript
const TEST_DATA = {
  creditCode: 'TSC',           // Try different codes
  calculationLevel: '2',       // Try different levels
  rounding: 'Half'             // Try different rounding
};
```

### Add More Fields
If there are other fields in the popup, add them like this:
```typescript
await popup.locator('#field_id').fill('value');
await popup.locator('#dropdown_id').selectOption('option');
```

---

## 📝 Next Steps

1. ✅ **Test is ready to run!**
2. Run it: `npx playwright test gah.spec.ts --ui`
3. Watch it execute in the browser
4. Verify it works as expected
5. Customize test data as needed

---

## 🎉 Success!

You now have a fully functional test that:
- Opens the popup window correctly
- Fills in text fields
- Selects dropdown values
- Submits the form
- Verifies success

**Ready to run!** 🚀

