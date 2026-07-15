# Recording Guide - DEV Environment Validation

This guide helps you record the validation formulas for SLFCAB, SLFNVB, and SLFNSB in the **DEV environment**.

---

## Prerequisites

1. ✅ Save DEV authentication first:
   ```powershell
   npx playwright test tests/save-auth-dev.spec.ts --headed
   ```
   - Browser opens to DEV PayHub
   - Manually log in
   - Wait for script to save `auth-state-dev.json`

---

## Recording Scripts for Each Earning Code

Run these scripts **one by one** and record the formulas shown:

### 1. DBLPC - Double Premium
```powershell
npx playwright test tests/record-dblpc-dev.spec.ts --headed
```
**What to record:**
- Hours, Amount, Rate
- Full "Calculation:" text
- Average Hourly Rate
- Screenshot

**Expected Formula:**
- Double Rate = Average Hourly Rate × 2
- Amount = Double Rate × Hours

---

### 2. MEALW - Meal Waiver
```powershell
npx playwright test tests/record-mealw-dev.spec.ts --headed
```
**What to record:**
- Hours, Amount, Rate
- Full "Calculation:" text
- Average Hourly Rate
- Screenshot

**Expected Formula:**
- Amount = Average Hourly Rate × Hours

---

### 3. OVTPC - Overtime Premium
```powershell
npx playwright test tests/record-ovtpc-dev.spec.ts --headed
```
**What to record:**
- Hours, Amount, Rate
- Full "Calculation:" text with Half Rate
- Average Hourly Rate Details section
- Screenshot

**Expected Formula:**
- Half Rate = Average Hourly Rate ÷ 2
- Amount = Half Rate × Hours

**Example:**
- Avg Rate: $124.21 → Half Rate: $62.11
- $62.11 × 1.5833 hrs = $98.34

---

### 4. REGPC - Regular Pay (TWO TYPES!)
```powershell
npx playwright test tests/record-regpc-dev.spec.ts --headed
```
**What to record for BOTH types:**

**Type A: REGPC - OT - State Straight - CA**
- Hours, Amount, Rate
- Full "Calculation:" text
- Screenshot

**Type B: REGPC - Regular Hourly Pay**
- Hours, Amount, Rate
- Job Description
- Base Hourly Rate
- Full "Calculation:" text
- Screenshot

**Expected Formula:**
- Amount = Pay Rate × Hours

**Example:**
- Pay Rate: $25.00 × 8.0000 hrs = $200.00

---

### 5. RSTBP - Rest Break Pay
```powershell
npx playwright test tests/record-rstbp-dev.spec.ts --headed
```
**What to record:**
- Hours, Amount, Rate
- Full "Calculation:" text
- ANY "Formula:" text shown (CRITICAL!)
- Rate Modifier (if shown)
- Screenshot

**Known Formula:**
- Rest Break Pay per Break = Base Hourly Rate ÷ 6
- Rest Break Pay for Week = Rest Break Pay per Break × Number of Breaks

**Calculation Format (record which one is shown):**
- Option 1: `PayRate × Hours = Amount`
- Option 2: `PayRate × Hours × Rate Modifier = Amount`

---

## Recording Template

For each earning code, copy this template and fill it out:

```
═══════════════════════════════════════════════════════════
EARNING CODE: [CODE NAME]
CALCULATION GROUP: SLFCAB / SLFNVB / SLFNSB
═══════════════════════════════════════════════════════════

EMPLOYEE ID: ____________
DAY: ____________
RUN ID: ____________

EXTRACTED VALUES:
- Hours: ____________
- Amount: $____________
- Rate: $____________

CALCULATION TEXT (copy exactly):
____________________________________________________________
____________________________________________________________

FORMULA TEXT (if shown):
____________________________________________________________
____________________________________________________________

AVERAGE HOURLY RATE (if applicable): $____________

SCREENSHOT FILENAME: ____________

NOTES:
____________________________________________________________
____________________________________________________________

═══════════════════════════════════════════════════════════
```

---

## After Recording

Once you've recorded all 5 earning codes, share:

1. **Screenshots** showing the calculation details
2. **Filled templates** for each earning code
3. Any differences you noticed from the STAGE environment

Then I'll create the automated validation scripts based on your recordings!

---

## Quick Command Reference

```powershell
# Save DEV auth
npx playwright test tests/save-auth-dev.spec.ts --headed

# Record each code
npx playwright test tests/record-dblpc-dev.spec.ts --headed
npx playwright test tests/record-mealw-dev.spec.ts --headed
npx playwright test tests/record-ovtpc-dev.spec.ts --headed
npx playwright test tests/record-regpc-dev.spec.ts --headed
npx playwright test tests/record-rstbp-dev.spec.ts --headed
```

---

## Tips

1. ✅ Look for employees with hours > 0.00 for the specific earning code
2. ✅ Always expand the rate group dropdown to see the calculation
3. ✅ Take clear screenshots showing Hours, Amount, Rate, and Calculation text
4. ✅ Copy the exact "Calculation:" text - don't paraphrase
5. ✅ If you see a "Formula:" section, capture that too
6. ✅ Note the Average Hourly Rate for the employee (needed for OVTPC, DBLPC, MEALW)

---

## Next Steps

After recording **SLFCAB**, we'll repeat for:
- **SLFNVB - Pay Process**
- **SLFNSB - Pay Process**

Using the same scripts, just navigate to different calculation groups!
