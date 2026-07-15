# 📊 Earnings Section Validation - Quick Start Guide

## 🎯 Objective
Validate the earnings section in `people.stage.ashleyfurniture.com` to ensure data accuracy, proper calculations, and UI/UX quality.

---

## 📁 Files Created

1. **`EARNINGS_VALIDATION_GUIDE.md`** - Comprehensive manual validation checklist
2. **`tests/earnings-validation.spec.ts`** - Full automated test suite (template)
3. **`tests/earnings-quick-check.spec.ts`** - Quick inspection and validation script
4. **`tests/helpers/earnings-inspector.ts`** - Helper utilities for earnings data extraction

---

## 🚀 Getting Started

### **Step 1: Quick Inspection**

Run the quick check script to explore the earnings page:

```bash
npx playwright test tests/earnings-quick-check.spec.ts --headed
```

This will:
- Open the browser
- Navigate to the staged site
- Take screenshots
- Extract all amounts
- Show page structure
- Pause for manual inspection

### **Step 2: Manual Validation**

Open `EARNINGS_VALIDATION_GUIDE.md` and go through the checklist:

```bash
code EARNINGS_VALIDATION_GUIDE.md
```

Check off each item as you validate:
- ✅ Navigation works
- ✅ Data displays correctly
- ✅ Calculations are accurate
- ✅ Downloads work
- ✅ Responsive design
- ✅ Accessibility

### **Step 3: Automated Testing**

Once you understand the page structure, update the selectors in:
- `tests/earnings-validation.spec.ts`
- `tests/helpers/earnings-inspector.ts`

Then run the full test suite:

```bash
npx playwright test tests/earnings-validation.spec.ts
```

---

## 🔑 Key Validations

### **1. Data Accuracy**
- Gross pay = Regular pay + Overtime + Bonuses
- Net pay = Gross pay - Total deductions
- YTD totals accumulate correctly

### **2. UI Elements**
- Current pay period is highlighted
- All amounts use currency format ($X,XXX.XX)
- Download button works
- History is accessible

### **3. Calculations**
```
Gross Pay = (Regular Hours × Rate) + (OT Hours × OT Rate) + Bonuses
Total Deductions = Federal Tax + State Tax + FICA + Medicare + Benefits
Net Pay = Gross Pay - Total Deductions
```

### **4. Security**
- Requires authentication
- Cannot access other employees' data
- HTTPS enabled
- Session timeout works

---

## 📝 Example Test Scenarios

### Scenario 1: Regular Employee
```
Regular Hours: 80 hours @ $25/hr = $2,000
Overtime Hours: 0
Gross Pay: $2,000
Federal Tax: $300
State Tax: $100
FICA: $124
Medicare: $29
Net Pay: $1,447
```

### Scenario 2: Employee with Overtime
```
Regular Hours: 80 hours @ $25/hr = $2,000
Overtime Hours: 10 hours @ $37.50/hr = $375
Gross Pay: $2,375
Deductions: Calculate based on rates
Net Pay: Gross - Deductions
```

---

## 🛠️ Updating Selectors

Once you inspect the page, update the selectors in the code:

**Current (placeholder):**
```typescript
const grossPay = await page.locator('[data-testid="gross-pay"]');
```

**Update to actual selector:**
```typescript
const grossPay = await page.locator('.earnings-summary .gross-amount');
// or
const grossPay = await page.locator('#grossPayAmount');
// or
const grossPay = await page.locator('text=Gross Pay').locator('..').locator('.amount');
```

---

## 📸 Screenshots

The quick check script automatically saves screenshots:
- `earnings-initial-load.png` - Initial page view
- `earnings-desktop.png` - Desktop view
- `earnings-laptop.png` - Laptop view
- `earnings-tablet.png` - Tablet view
- `earnings-mobile.png` - Mobile view

---

## 🧪 Running Tests

### Run all earnings tests:
```bash
npx playwright test tests/earnings-*.spec.ts
```

### Run with UI mode (interactive):
```bash
npx playwright test tests/earnings-quick-check.spec.ts --ui
```

### Run in headed mode (see browser):
```bash
npx playwright test tests/earnings-quick-check.spec.ts --headed
```

### Debug a specific test:
```bash
npx playwright test tests/earnings-quick-check.spec.ts --debug
```

### Generate report:
```bash
npx playwright test tests/earnings-validation.spec.ts --reporter=html
npx playwright show-report
```

---

## 🔐 Authentication Setup

If the site requires login, set environment variables:

**Windows PowerShell:**
```powershell
$env:STAGE_USERNAME="your.username"
$env:STAGE_PASSWORD="your.password"
npx playwright test tests/earnings-quick-check.spec.ts
```

**Or create a `.env` file:**
```
STAGE_USERNAME=your.username
STAGE_PASSWORD=your.password
```

Then update the test to use:
```typescript
const username = process.env.STAGE_USERNAME;
const password = process.env.STAGE_PASSWORD;
```

---

## ✅ Validation Workflow

1. **Explore** → Run quick check to understand page structure
2. **Update** → Modify selectors based on actual DOM
3. **Validate** → Go through manual checklist
4. **Automate** → Run full test suite
5. **Document** → Record findings and issues
6. **Report** → Share results with team

---

## 📊 Sample Validation Report

```
Date: 2026-05-14
Tester: [Your Name]
Environment: people.stage.ashleyfurniture.com

✅ PASSED (15):
- Navigation to earnings section
- Gross pay calculation
- Net pay calculation
- YTD totals display
- Pay stub download
- Responsive design
- ... etc

❌ FAILED (2):
- Medicare deduction off by $0.01 (rounding)
- Mobile view has text truncation

⚠️  WARNINGS (1):
- Page load time 4.2s (target: <3s)

Critical Issues: None
Recommendation: Fix rounding and mobile truncation before prod
```

---

## 🆘 Need Help?

- Check the `EARNINGS_VALIDATION_GUIDE.md` for detailed checklist
- Review Playwright docs: https://playwright.dev
- Use `page.pause()` to inspect during test execution
- Check browser DevTools for element selectors

---

## 📚 Next Steps

1. Run the quick check script
2. Identify actual selectors
3. Update test files with real selectors
4. Execute full validation
5. Document any issues found
6. Share results with development team
