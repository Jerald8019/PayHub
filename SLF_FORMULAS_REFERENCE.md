# SLF Earning Codes - Formula Reference

This document contains the **verified formulas** for all SLF earning codes (SLFCAB, SLFNSB, SLFNVB) as extracted from PayHub.

---

## 1. COMM - Commission Earnings / Average Hourly Rate

### Formula:
```
Average Hourly Rate = Total Staged Earnings ÷ Total Hours
```

### Rounding:
- Unrounded rate is calculated first
- Final rate is rounded to **2 decimal places**

### Example:
```
Total Staged Earnings: $5,293.57
Total Hours Worked: 42.6166
Average Hourly Rate = $5,293.57 ÷ 42.6166 = $124.213804 → $124.21 (rounded)
```

### Components (from breakdown):
- Commission STM (CA)
- Federal Straight
- State Straight
- Regular Hourly Pay
- Rest Break

---

## 2. OVTPC - Overtime Premium (State Premium - CA)

### Formula:
```
Half Rate = Average Hourly Rate ÷ 2
Amount = Half Rate × Hours
```

### Rounding:
- Half Rate is rounded to **2 decimal places**
- Final amount is rounded to **2 decimal places**

### Example:
```
Average Hourly Rate: $124.21
Half Rate = $124.21 ÷ 2 = $62.105 → $62.11 (rounded to 2 decimals)
Hours: 1.5833
Amount = $62.11 × 1.5833 = $98.338763 → $98.34 (rounded to 2 decimals)
```

### PayHub Calculation Text:
```
Week 2026-02-22 to 2026-02-28: Half Rate (¤62.11) × Hours (1.5833) = Amount (¤98.34) 
[rounded to 2 decimals] (unrounded: hours=1.583333, rate=62.110000, amount=98.338763)
```

---

## 3. REGPC - Regular Pay

### Types:
1. **REGPC - SLFCAB - OT - State Straight - CA**
2. **REGPC - SLFCAB - Regular Hourly Pay**

### Formula:
```
Amount = Pay Rate × Hours
```

### Rounding:
- Final amount is rounded to **2 decimal places**

### Example:
```
Pay Rate: $25.00
Hours: 8.0000
Amount = $25.00 × 8.0000 = $200.00
```

### PayHub Calculation Text:
```
PayRate (¤25.00) × Hours (8.0000) = Amount (¤200.00) [rounded to 2 decimals]
```

---

## 4. RSTBP - Rest Break Pay (CA Rest Break)

### Formula (VERIFIED FROM DEV - SLFCAB):
```
Rest Break Pay per Break = Base Hourly Rate ÷ 6
Total Rest Break Pay = Rest Break Pay per Break × Number of 10-minute Breaks
```

### Rest Break Eligibility Rules:

| Hours Worked Per Shift | # of 10-Minute Rest Breaks |
|------------------------|---------------------------|
| 0 to < 3.5 hours | 0 breaks |
| >3.5 to ≤ 6 hours | 1 break |
| >6.0 to ≤ 10.0 hours | 2 breaks |
| >10.0 to ≤ 14.0 hours | 3 breaks |

### Important Notes:
- **NOT calculated as Rate × Hours directly**
- Based on **number of 10-minute breaks**, not total hours
- Base Hourly Rate ÷ 6 = Pay per 10-minute break (1/6 of an hour)
- Number of breaks determined by hours worked per shift

### Examples (from DEV Documentation):

**Example 1: 6.5 hours worked (2 breaks)**
```
Base Rate: $16.50
Rest Break Pay per Break = $16.50 ÷ 6 = $2.75
Hours Worked: 6.5 → Qualifies for 2 breaks
Total Rest Break Pay = $2.75 × 2 = $5.50
```

**Example 2: 3.0 hours worked (0 breaks)**
```
Base Rate: $16.50
Hours Worked: 3.0 → Does not qualify (< 3.5 hours)
Total Rest Break Pay = $0.00
```

**Example 3: 5.0 hours worked (1 break)**
```
Base Rate: $16.50
Rest Break Pay per Break = $16.50 ÷ 6 = $2.75
Hours Worked: 5.0 → Qualifies for 1 break
Total Rest Break Pay = $2.75 × 1 = $2.75
```

### Alternative Calculation Format (from PayHub):
```
PayRate × Hours × Rate Modifier = Amount
Example: $25.00 × 0.3333 hrs × 1.00 = $8.33
(where 0.3333 hrs = 2 breaks × 10 minutes ÷ 60 minutes)
```

---

## 5. DBLPC - Double Premium

### Formula (VERIFIED FROM DEV - SLFCAB):
```
Step 1: Average Hourly Rate = Total Staged Earnings ÷ Total Hours (for date range)
Step 2: Premium Rate = Average Rate × 1.0 [rounded to 2 decimals]
Step 3: Amount = Premium Rate × Hours [rounded to 2 decimals]
```

### Rounding:
- Average Rate is rounded to **2 decimal places**
- Premium Rate is rounded to **2 decimal places**
- Final amount is rounded to **2 decimal places**

### Example (from DEV - 02/27/2026):
```
Total Staged Earnings: $755.98
Total Hours: 32.03
Average Hourly Rate = $755.98 ÷ 32.03 = $23.599792 → $23.60 (rounded)

Premium Rate = $23.60 × 1.0 = $23.60
DBLPC Hours: 4.0167
Amount = $23.60 × 4.0167 = $94.79392 → $94.79 (rounded)
```

### Calculation Details Text:
```
02/27/2026: Week 2026-02-22 to 2026-02-28: Premium Rate * [Round(23.60*0000, 2) = (23.60)] * Hours = Premium Rate) * 4.02 (0.0167 = (494.79)
```

### NOTE:
- **DBLPC = "Double Premium" but uses multiplier of 1.0, not 2.0**
- This may vary by calculation group - verify for SLFNVB and SLFNSB

---

## 6. MEALW - Meal Waiver

### Formula:
```
Amount = Average Hourly Rate × Hours
```

### Rounding:
- Final amount is rounded to **2 decimal places**

### Example:
```
Average Hourly Rate: $124.21
Hours: 1.0000
Amount = $124.21 × 1.0000 = $124.21
```

---

## General Validation Rules

1. **All monetary amounts** are rounded to **2 decimal places**
2. **Rates** (Average Rate, Half Rate, Double Rate) are rounded to **2 decimal places** before using in calculations
3. **Hours** are typically stored with 4 decimal places but used as-is in calculations
4. **Variance tolerance** for validation: ± $0.01 (1 cent)

---

## Rate Group Categories

### For each day, there can be multiple rate groups:
1. **OVTPC** - SLFCAB - OT - State Premium - CA
2. **REGPC** - SLFCAB - OT - State Straight - CA
3. **REGPC** - SLFCAB - Regular Hourly Pay
4. **RSTBP** - SLFCAB - CA Rest Break

### Each rate group has:
- **Hours**: Total hours for that rate type
- **Amount**: Total dollar amount
- **Rate**: The rate applied
- **Calculation**: Formula showing how amount was derived

---

## Validation Priority

When validating, use values in this order:
1. **Calculation line** (most reliable) - contains exact values used by PayHub
2. **Hours/Amount/Rate labels** (fallback) - may pick up wrong values if multiple sections exist
3. **Unrounded values in parentheses** - for precise validation

---

## Example Calculation Line Formats

```
Calculation: Total Staged Earnings (2021.31) / Total Hours (42.3667) = 47.71 [rounded to 2 decimals] (unrounded: 47.709820)

Calculation: Week 2026-02-22 to 2026-02-28: Half Rate (¤23.86) × Hours (0.0667) = Amount (¤1.59) [rounded to 2 decimals] (unrounded: hours=0.066667, rate=23.860000, amount=1.591462)

Calculation: PayRate (¤25.00) × Hours (8.0000) = Amount (¤200.00) [rounded to 2 decimals]

Calculation: PayRate (¤25.00) × Hours (0.3333) × Rate Modifier (1.00) = Amount (¤8.33) [rounded to 2 decimals]
```

---

## Last Updated
Date: 2026-06-18
Source: PayHub Stage Environment - SLFCAB Pay Process Group
