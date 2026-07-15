# MEALW (Meal Waiver) Validation Guide

## 🎯 Overview

**MEALW** = Meal Waiver Premium - paid at the **average hourly rate** for meal waiver hours.

Unlike DBLPC (which uses 2× multiplier), MEALW uses a **1.0 multiplier** (just the average rate).

---

## ✅ Formula

### Step 1: Calculate Average Hourly Rate
```
Average Rate = Total Staged Earnings ÷ Total Hours Worked
```

### Step 2: Calculate MEALW Amount
```
Amount = MEALW Hours × Average Rate
```

**Note:** The multiplier is **1.0**, so the rate used equals the average hourly rate.

---

## 📋 Validation Tests

We have created **3 test files** for MEALW validation:

### 1. **Totals Validation** (`slfcab-mealw-1-totals.spec.ts`)
✅ Validates:
- Summary total MEALW hours and amount
- Filtered view total MEALW hours and amount
- Summary matches filtered view

**Run Command:**
```bash
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-1-totals.spec.ts --headed
```

---

### 2. **Average Rate Validation** (`slfcab-mealw-2-avgrate.spec.ts`)
✅ Validates:
- Average Hourly Rate = Total Earnings ÷ Total Hours
- MEALW uses Average Rate (multiplier = 1.0)
- Premium Rate matches Average Hourly Rate

**Run Command:**
```bash
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-2-avgrate.spec.ts --headed
```

---

### 3. **Daily Breakdown Validation** (`slfcab-mealw-3-daily.spec.ts`)
✅ Validates:
- MEALW appears in Earnings Breakdown tab
- Rate Details tab - Calculation Set Name
- Hours, Amount, Rate matching
- Average Rate × Hours = Amount
- Multiplier is 1.0 (no premium, just average rate)

**Run Command:**
```bash
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-3-daily.spec.ts --headed
```

---

## 🚀 How to Run All MEALW Tests

### Run All 3 Tests Together:
```bash
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw --headed
```

### Run in Sequence:
```bash
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-1-totals.spec.ts --headed
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-2-avgrate.spec.ts --headed
RUN_ID=your-run-id npx playwright test tests/slfcab-mealw-3-daily.spec.ts --headed
```

---

## 📊 Example Calculation

### Scenario:
- **Total Staged Earnings:** $5,293.57
- **Total Hours Worked:** 42.6166 hrs
- **MEALW Hours:** 1.0000 hrs

### Step 1: Calculate Average Rate
```
Average Rate = $5,293.57 ÷ 42.6166 hrs = $124.21/hr
```

### Step 2: Calculate MEALW Amount
```
Amount = 1.0000 hrs × $124.21 = $124.21
```

✅ Expected MEALW Amount: **$124.21**

---

## 🔍 What to Look For

### In Rate Details Tab:
1. **Calculation Set Name:** Should contain "MEALW" and "SLFCAB"
2. **Formula:** Should show `Average Rate × 1.0` (or just `Average Rate`)
3. **Hours:** MEALW hours for that day
4. **Rate:** Should match Average Hourly Rate
5. **Amount:** Should equal Rate × Hours

### Common Issues:
- ❌ **Rate doesn't match Average Rate** - Check if correct rate source is used
- ❌ **Multiplier is not 1.0** - MEALW should always use 1.0 multiplier
- ❌ **Amount calculation off** - Verify rounding (should be 2 decimals)

---

## 📝 Checklist for Manual Validation

**Sample Employee Validation**:
- [ ] Employee ID: ___________
- [ ] Total Earnings: $___________
- [ ] Total Hours: ___________
- [ ] **Calculated Average Rate**: $___________ (Earnings ÷ Hours)
- [ ] MEALW Hours for this employee: ___________
- [ ] **Expected MEALW Amount**: $___________ (Hours × Average Rate)
- [ ] **Actual MEALW Amount**: $___________
- [ ] **Variance**: $___________
- [ ] **PASS / FAIL**: ___________

---

## 🎯 Success Criteria

✅ **Test Passes If:**
1. Summary MEALW totals match filtered view totals
2. Average Rate calculation is correct (within $0.01)
3. Multiplier is 1.0
4. Daily amount = Hours × Average Rate (within $0.01)
5. All validations pass with ≥75% success rate

---

## 📚 Related Files

- **Config:** `slf-earning-codes-validation.config.ts`
- **Formula Reference:** `SLF_FORMULAS_REFERENCE.md` (Section 6)
- **DBLPC Tests:** `tests/slfcab-dblpc-*.spec.ts` (similar pattern)
- **Recording Script:** `tests/record-mealw-dev.spec.ts`

---

## 🔗 Next Steps

After MEALW validation is complete, continue with:
1. ✅ **DBLPC** - Complete ✓
2. ✅ **MEALW** - In Progress
3. ⏭️ **OVTPC** - Overtime Premium (next)
4. ⏭️ **REGPC** - Regular Pay
5. ⏭️ **RSTBP** - Rest Break Pay

---

**Last Updated:** 2026-01-07
