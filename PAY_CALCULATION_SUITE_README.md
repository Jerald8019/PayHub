# 💰 Pay Calculation Validation Suite

## 📋 Overview

This comprehensive test suite enhances a recorded Playwright test with **automated value extraction**, **formula verification**, **multiple scenarios**, **CSV exports**, and **error screenshots**.

### ✨ Key Features

1. ✅ **Extracts all calculated values** from the PayHub UI
2. ✅ **Verifies formulas are mathematically correct**
3. ✅ **Tests 5 different pay scenarios** (overtime, holiday, bonus, etc.)
4. ✅ **Exports detailed results to CSV** for analysis
5. ✅ **Captures error screenshots** automatically on failures

---

## 🚀 Quick Start

### Run the Enhanced Test Suite
```bash
npx playwright test pay-calculation-validation.spec.ts
```

### Run with Visual UI
```bash
npx playwright test pay-calculation-validation.spec.ts --ui
```

### View Results
```bash
# Open HTML report
npx playwright show-report

# View CSV export
cat test-results/pay-calculations-*.csv
```

---

## 📁 What's Included

### Test Files
```
tests/
├── pay-calculation-validation.spec.ts     # Main test suite (RECOMMENDED)
├── pay-calculation-enhanced.spec.ts       # Alternative implementation
└── helpers/
    └── pay-calculator.ts                  # Reusable helper class
```

### Documentation
```
tests/
├── PAY_CALCULATION_TESTS.md              # Full documentation
├── QUICK_START.md                        # Quick reference guide
├── ENHANCEMENT_COMPARISON.md             # Original vs Enhanced
└── test-data/
    └── pay-scenarios.template.ts         # Customizable scenarios
```

### Output Directories
```
test-results/
└── pay-calculations-[timestamp].csv      # Exported test results

screenshots/
└── error-[scenario]-[timestamp].png      # Error captures
```

---

## 🎯 5 Test Scenarios

| # | Scenario | Code | Multiplier | What It Tests |
|---|----------|------|------------|---------------|
| 1 | Double Pay - Premium Coverage | DBLPC | 1.0x | Regular pay with premium |
| 2 | Overtime - Time and a Half | OVTM | 1.5x | Overtime calculation |
| 3 | Holiday Pay | HOLDY | 1.0x | Holiday rate |
| 4 | Bonus Payment | BONUS | 1.0x | Bonus accuracy |
| 5 | Shift Differential | SHIFT | 1.15x | Shift premium |

---

## 🔍 What Gets Validated

For each scenario, the test validates:

### 1. Formula Extraction
- ✅ Average Rate
- ✅ Multiplier
- ✅ Effective Rate = Average Rate × Multiplier

### 2. Calculation Accuracy
- ✅ Total Hours (sum of all line items)
- ✅ Total Amount (sum of all line items)
- ✅ Each line item: PayRate × Hours = Amount

### 3. Data Consistency
- ✅ Line items sum matches displayed total
- ✅ Hours sum matches displayed total hours
- ✅ All calculations within $0.01 tolerance

---

## 📊 Sample Output

### Console Report
```
==============================================================
📊 Pay Calculation Report
==============================================================

Employee: 176166
Earning Code: DBLPC
Formula: Average Rate × 1.0

Average Rate: $25.00
Multiplier: 1.0x
Effective Rate: $25.00

Total Hours: 4.43
Total Amount: $110.83

Line Items (9):
--------------------------------------------------------------
1. $25.00 × 8.00 hrs = $200.00
2. $25.00 × 3.50 hrs = $87.50
3. $25.00 × 8.00 hrs = $200.00
...

✅ Validation: PASSED
==============================================================

✅ Double Pay - Premium Coverage: PASSED
   Total: $110.83 (4.43 hours @ $25.00/hr)
```

### CSV Export
```csv
Scenario,Employee ID,Earning Code,Formula,Average Rate,Multiplier,Effective Rate,Total Hours,Total Amount,Line Items Count,Is Valid,Errors
"Double Pay - Premium Coverage",176166,DBLPC,"Average Rate × 1.0",25.00,1.00,25.00,4.43,110.83,9,PASS,""
"Overtime - Time and a Half",176166,OVTM,"Average Rate × 1.5",25.00,1.50,37.50,8.00,300.00,4,PASS,""
```

### Test Summary
```
======================================================================
📊 TEST SUMMARY
======================================================================
Total Scenarios: 5
✅ Passed: 5
❌ Failed: 0

📄 CSV Report: test-results/pay-calculations-2026-05-20T14-55-30.csv
======================================================================
```

---

## 🛠️ How It Works

### Architecture
```
Test Suite
    ↓
PayCalculator Helper Class
    ↓
1. Navigate to PayHub
2. Filter by earning code
3. Extract calculation details
4. Validate formulas
5. Generate reports
    ↓
CSV Export + Screenshots (on error)
```

### PayCalculator Helper
```typescript
class PayCalculator {
  extractFormula()       // Get formula and multiplier
  extractAverageRate()   // Get pay rates
  extractTotals()        // Get hours and amount
  extractLineItems()     // Get detailed breakdown
  extractAndValidate()   // Complete validation
  generateReport()       // Format results
}
```

---

## 🎓 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | Get started in 2 minutes |
| `PAY_CALCULATION_TESTS.md` | Full documentation |
| `ENHANCEMENT_COMPARISON.md` | See what's improved |
| `test-data/pay-scenarios.template.ts` | Customize scenarios |

---

## 🔧 Customization

### Add Your Own Scenario
Edit `pay-calculation-validation.spec.ts`:

```typescript
const PAY_SCENARIOS = [
  // ... existing scenarios
  { 
    employeeId: 'YOUR_ID',
    earningCode: 'YOUR_CODE',
    description: 'Your Description',
    expectedMultiplier: 1.25
  }
];
```

### Change Employee
```typescript
{ 
  employeeId: '123456',  // ← Your employee ID
  earningCode: 'DBLPC',
  // ...
}
```

---

## 🐛 Troubleshooting

### Issue: Test fails immediately
**Solution:** Check credentials in `pay-calculation-validation.spec.ts`

### Issue: Wrong values extracted
**Solution:** Run with `--headed --debug` to see UI

### Issue: No CSV generated
**Solution:** Ensure `test-results` folder exists: `mkdir test-results`

### Issue: Screenshots not saved
**Solution:** Ensure `screenshots` folder exists: `mkdir screenshots`

---

## 📚 Learn More

Read the documentation files for detailed information:

```bash
# Quick start guide
cat tests/QUICK_START.md

# Full documentation
cat tests/PAY_CALCULATION_TESTS.md

# See enhancements
cat tests/ENHANCEMENT_COMPARISON.md
```

---

## ✅ Verification Checklist

- [ ] Playwright installed: `npx playwright --version`
- [ ] Folders created: `test-results/` and `screenshots/`
- [ ] Test runs: `npx playwright test pay-calculation-validation.spec.ts`
- [ ] CSV generated in `test-results/`
- [ ] Console shows detailed reports

---

## 🎯 Use Cases

1. **Regression Testing** - Run after code changes
2. **Data Validation** - Verify pay calculations are correct
3. **Audit Trail** - CSV exports for compliance
4. **Debugging** - Screenshots for troubleshooting

---

## 📞 Support

Need help?
1. Check console output for errors
2. Review error screenshots in `screenshots/`
3. Check CSV export in `test-results/`
4. Run in debug mode: `--debug` flag

---

## 🔐 Security Note

⚠️ **Important:** Don't commit credentials to version control!

Use environment variables instead:
```bash
# Create .env file
ASHLEY_USERNAME=your.email@ashleyfurniture.com
ASHLEY_PASSWORD=your_password
```

---

**Ready to start?** Run the quick start command:

```bash
npx playwright test pay-calculation-validation.spec.ts --ui
```

**Happy Testing! 🎉**
