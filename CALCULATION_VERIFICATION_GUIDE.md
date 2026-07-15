# 🔢 Overtime Calculation Verification Guide

## Ensuring PayHub Math is Correct

---

## 📋 What This Verifies

The verification script checks that PayHub's overtime premium calculations are mathematically correct:

1. ✅ **Average Hourly Rate** = Total Earnings ÷ Total Hours
2. ✅ **Half Rate** = Average Rate ÷ 2
3. ✅ **Daily Premium Amount** = Hours × Half Rate
4. ✅ **Rounding** is done correctly (to 2 decimal places)

---

## 🧮 Formula Breakdown

### Formula 1: Average Hourly Rate

**Formula**:
```
Average Rate = Total Staged Earnings ÷ Total Hours Worked
```

**Example from PayHub**:
```
Total Earnings: $5,808.36
Total Hours: 41.5167
Average Rate: $5,808.36 ÷ 41.5167 = $139.904294
Rounded to 2 decimals: $139.90 ✅
```

**What to Check**:
- Division is correct
- Rounding follows standard rules (0.005 rounds up)
- Result shown matches calculation

---

### Formula 2: Half-Rate Calculation

**Formula**:
```
Half Rate = Average Rate ÷ 2
```

**Example from PayHub**:
```
Average Rate: $139.90
Half Rate: $139.90 ÷ 2 = $69.95 ✅
```

**What to Check**:
- Division by 2 is exact
- Rounding is correct
- No truncation errors

---

### Formula 3: Daily Breakdown

**Formula**:
```
Daily Amount = Overtime Hours × Half Rate
```

**Example from PayHub**:
```
Date: 02/28/2026
Hours: 1.5167
Half Rate: $69.95
Amount: 1.5167 × $69.95 = $106.093165
Rounded to 2 decimals: $106.09 ✅
```

**What to Check**:
- Multiplication is correct
- Hours value is precise (4 decimals)
- Result is rounded properly

---

## 🚀 How to Run Verification

### Step 1: Find a Run in "Awaiting Approval" Status

⚠️ **IMPORTANT**: You can only view "Review Staged Earnings" for runs with status:
- ✅ **Awaiting Approval** (most common)
- ✅ **AwaitingPostAction**

**How to find a suitable run**:
1. Login to PayHub Stage
2. Go to "Calculation Set Groups"
3. Click on a group (e.g., "KWFHBW - Pay Process")
4. Look for runs with status "Awaiting Approval"
5. If no runs exist, you may need to create one first

---

### Step 2: Get the Employee URL

1. **Click** on a run with "Awaiting Approval" status
2. **Click** "Review Staged Earnings" button
3. **Click** on an employee who has overtime premium calculations
4. **Copy the URL** from browser address bar

**Example URL**:
```
https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/5/runs/84e5b2e3-abc1-2345-6789-0123456789ab/employees/071298
```

---

### Step 3: Update the Script

Open `tests/verify-calculations-current-page.spec.ts` and update the URL (around line 36):

```typescript
const EMPLOYEE_URL = 'YOUR_URL_HERE';
```

Paste your copied URL.

---

### Step 4: Run the Verification

```powershell
npx playwright test tests/verify-calculations-current-page.spec.ts --headed
```

**What happens**:
1. Opens browser
2. Logs into PayHub
3. Navigates to the employee calculation page
4. Extracts all calculation data
5. Verifies each formula
6. Shows results

---

## ✅ Expected Output

### Success (All Correct):
```
================================================================================
🔍 OVERTIME PREMIUM CALCULATION VERIFICATION
================================================================================

Configuration:
  Environment: stage
  Group: KWFHBW - Pay Process
  Run ID: 84e5b2e3...
  Employee: 071298

Step 1: Logging in...
  Filling email...
  Filling password...
✅ Logged in successfully

Step 2: Navigating to Calculation Set Groups...
✅ Navigated to groups

Step 3: Opening group "KWFHBW - Pay Process"...
✅ Group opened

Step 4: Opening run "84e5b2e3..."...
✅ Run opened

Step 5: Opening staged earnings...
✅ Staged earnings opened

Step 6: Opening employee "071298"...
✅ Employee calculation page opened

Step 7: Expanding calculation details...
✅ Expanded calculation details

Step 8: Waiting for calculation data to load...
✅ Calculation data loaded

📊 Step 1: Average Hourly Rate Calculation
--------------------------------------------------------------------------------
   Total Earnings: $5808.36
   Total Hours: 41.5167 hours
   Average Rate (shown): $139.90
   Average Rate (calculated): $139.90
   ✅ PASS: $5808.36 ÷ 41.5167 = $139.90

📊 Step 2: Half-Rate Calculation
--------------------------------------------------------------------------------
   Formula: $139.90 / 2 = $69.95
   Calculated: $69.95
   ✅ PASS: Half-rate calculation is correct

📊 Step 3: Daily Breakdown Verification
--------------------------------------------------------------------------------

   Row 1: 02/28/2026
   1.5167 hours × $69.95 = $106.09
   Displayed amount: $106.09
   ✅ PASS

   📋 Total Row:
   Total Hours: 1.5167 (displayed) vs 1.5167 (sum)
   Total Amount: $106.09 (displayed) vs $106.09 (sum)
   ✅ PASS: Totals match the sum of daily rows

================================================================================
📊 VERIFICATION COMPLETE
================================================================================
   Verified 1 daily calculation row(s)
   ✅ ALL CALCULATIONS VERIFIED SUCCESSFULLY!
================================================================================
```

---

### Failure (Error Found):
```
❌ FAIL - Average rate is incorrect
  Expected: $139.90
  Actual: $139.91
  Difference: $0.01
  
❌ CALCULATION ERROR DETECTED!
```

---

## 🔍 Manual Verification Steps

If you prefer to verify manually:

### Step 1: Check Average Rate

1. **Find** Total Staged Earnings
2. **Find** Total Hours Worked
3. **Calculate**: Earnings ÷ Hours
4. **Round** to 2 decimals
5. **Compare** with "Calculated Rate" shown

**Example**:
```
$5,808.36 ÷ 41.5167 = 139.904294
Rounded: $139.90
Match PayHub? YES ✅
```

---

### Step 2: Check Half Rate

1. **Find** Average Rate (from above)
2. **Calculate**: Average Rate ÷ 2
3. **Compare** with half rate shown

**Example**:
```
$139.90 ÷ 2 = $69.95
Match PayHub? YES ✅
```

---

### Step 3: Check Daily Amounts

For each day in the breakdown:

1. **Find** Hours worked (overtime)
2. **Find** Half Rate
3. **Calculate**: Hours × Half Rate
4. **Round** to 2 decimals
5. **Compare** with Amount shown

**Example**:
```
1.5167 × $69.95 = $106.093165
Rounded: $106.09
Match PayHub? YES ✅
```

---

## 🧪 Common Issues & Solutions

### Issue 1: Rounding Errors

**Problem**: Amount shows $106.10 but calculation gives $106.09

**Check**:
- Verify PayHub is using standard rounding (not always rounding up)
- Standard rule: 0.005 rounds up, 0.004 rounds down

**Solution**:
- If consistent rounding difference, update expected behavior
- If random, report as bug

---

### Issue 2: Precision Issues

**Problem**: Hours show as 1.52 but actual value is 1.5167

**Check**:
- PayHub may display rounded value but use precise value in calculation
- Check "Calculation Details" section for actual values used

**Solution**:
- Use precise values from calculation details
- Don't rely on displayed rounded values

---

### Issue 3: Multiple Earnings

**Problem**: Total earnings comes from multiple sources

**What to Check**:
- Verify all earnings are included in total
- Check "Staged Earnings Used" table
- Sum all amounts to verify total

**Example**:
```
COMM: $5,808.36
WRKHR: $0.00
Total: $5,808.36 ✅
```

---

## 📊 Verification Checklist

Use this checklist when manually verifying:

### Average Rate Calculation
- [ ] Found Total Earnings
- [ ] Found Total Hours
- [ ] Calculated: Earnings ÷ Hours
- [ ] Rounded to 2 decimals
- [ ] Compared with PayHub value
- [ ] Result: ✅ PASS / ❌ FAIL

### Half-Rate Calculation
- [ ] Found Average Rate
- [ ] Calculated: Average ÷ 2
- [ ] Compared with PayHub value
- [ ] Result: ✅ PASS / ❌ FAIL

### Daily Breakdown (for each day)
- [ ] Found Hours worked
- [ ] Found Half Rate
- [ ] Calculated: Hours × Half Rate
- [ ] Rounded to 2 decimals
- [ ] Compared with PayHub value
- [ ] Result: ✅ PASS / ❌ FAIL

---

## 🔢 Rounding Rules

PayHub uses **standard rounding** (round half up):

### Examples:
```
139.904294 → $139.90 (0.004 rounds down)
139.905000 → $139.91 (0.005 rounds up)
106.093165 → $106.09 (0.003 rounds down)
106.095000 → $106.10 (0.005 rounds up)
```

### Rule:
- If digit after rounding position is **< 5** → Round down
- If digit after rounding position is **≥ 5** → Round up

---

## 📝 Reporting Issues

If you find calculation errors:

### Information to Include:
1. **Employee ID**: (e.g., 062543)
2. **Run ID**: (from URL)
3. **Date**: Week and specific day
4. **Expected Value**: What calculation shows
5. **Actual Value**: What PayHub shows
6. **Difference**: How much off
7. **Screenshot**: Of calculation breakdown

### Example Report:
```
Issue: Incorrect daily amount calculation

Employee: 062543
Run: b272af47-b78d-4929-a451-7065a3b516a0
Date: 02/28/2026

Expected: $106.09
Actual: $106.10
Difference: $0.01

Calculation:
1.5167 hours × $69.95 = $106.093165
Should round to: $106.09

Screenshot: [attached]
```

---

## 🎓 Understanding the Calculations

### Why Half-Rate?

**Overtime Premium** is calculated as:
- Regular pay: Already paid through regular hours
- Premium: Additional 50% for overtime hours

**Example**:
```
Average Rate: $139.90
Overtime worked: 1.5167 hours

Regular pay (already paid): 1.5167 × $139.90 = $212.19
Premium (additional 50%): 1.5167 × $69.95 = $106.09

Total overtime pay: $212.19 + $106.09 = $318.28
(Or: 1.5167 × $139.90 × 1.5 = $318.28)
```

The **Half-Rate** represents the **premium portion** only!

---

## 🚀 Automated vs Manual

### Automated Verification (Recommended)
- ✅ Faster (2-3 minutes)
- ✅ No human error
- ✅ Verifies all formulas at once
- ✅ Detailed logs
- ✅ Repeatable

### Manual Verification
- ⏱️ Slower (10-15 minutes)
- ⚠️ Prone to mistakes
- ✅ Good for spot checks
- ✅ Helps understand calculations
- ✅ No setup required

**Best Practice**: Use automated for regular verification, manual for learning/spot-checking.

---

## 📞 Support

Need help with verification?

- 📖 **See**: tests/verify-calculations-current-page.spec.ts
- 📚 **Read**: TECHNICAL_REFERENCE.md
- 💬 **Contact**: IT Support team

---

**Last Updated**: June 11, 2026  
**Version**: 1.0
