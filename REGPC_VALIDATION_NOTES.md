# REGPC Validation - Special Handling

## 🔍 Overview

**REGPC (Regular Pay Calculation)** requires special filtering when validating against the RAW CSV export.

---

## 📌 Key Difference

Unlike other earning codes (DBLPC, MEALW, OVTPC, RSTBP), REGPC has rows in the RAW CSV with the **`IsCalculationOnly`** column set to `TRUE`.

### What is `IsCalculationOnly`?

- **`IsCalculationOnly = TRUE`**: These rows represent intermediate calculation values that are **NOT** displayed in the UI's "UKG Pro Earning Codes (Staged)" table
- **`IsCalculationOnly = FALSE`**: These rows represent actual earning code values that **ARE** displayed in the UI

---

## ✅ Validation Logic

When validating REGPC:

1. **Export RAW CSV** (contains all rows for all earning codes)
2. **Filter REGPC rows**: 
   - ❌ **Skip** rows where `IsCalculationOnly = TRUE`
   - ✅ **Include** rows where `IsCalculationOnly = FALSE`
3. **Sum the filtered rows** to get the total hours and amount for REGPC
4. **Compare** with the UI's "UKG Pro Earning Codes (Staged)" table

---

## 📊 Example from Excel

Here's what the RAW CSV looks like for REGPC:

| Employee | EarningCode | Amount | Hours | IsCalculationOnly |
|----------|-------------|---------|-------|-------------------|
| 21468    | REGPC       | 1285.27 | 40    | **FALSE** ✅      |
| 21468    | REGPC       | 351.87  | 13.5333 | **FALSE** ✅    |
| 21468    | REGPC       | 952.47  | 36.6334 | **FALSE** ✅    |
| 21468    | REGPC       | 3.03    | 0.1166 | **FALSE** ✅     |
| 31244    | REGPC       | 926.9   | 40    | **FALSE** ✅      |
| 31244    | REGPC       | 1.53    | 0.0667 | **FALSE** ✅     |

**Total to sum**: All rows where `IsCalculationOnly = FALSE`

If there were rows with `IsCalculationOnly = TRUE`, they would be **excluded** from the sum.

---

## 🧮 Formula

REGPC uses the **Average Rate (1.0x multiplier)**:

```
1. Average Rate = Total Staged Earnings ÷ Total Hours Worked
   Example: $25,000 ÷ 1,000 hrs = $25.00/hr

2. REGPC Amount = REGPC Hours × Average Rate
   Example: 51,715.98 hrs × $25.00 = $1,292,899.50
```

**Same as MEALW and RSTBP - uses Average Rate without any premium multiplier.**

---

## 🛠️ Implementation

The filtering logic is implemented in **`tests/slfcab-ukg-earnings-validation.spec.ts`**:

```typescript
// SPECIAL HANDLING FOR REGPC: Filter out IsCalculationOnly = TRUE rows
// For REGPC, we only want to sum rows where IsCalculationOnly = FALSE
if (code === 'REGPC' && isCalculationOnly === 'TRUE') {
  regpcCalculationOnlyRowsSkipped++;
  continue; // Skip this row
}
```

---

## 📋 Validation Process Output

When running the UKG EARNINGS validation, you'll see:

```
📍 Step 4: Parsing CSV and grouping by earning code...
   Total rows in CSV: 1234
   📍 Column indices: EarningCode=1, Amount=3, Hours=4, IsCalculationOnly=7
   ✓ Found 8 earning codes in CSV
   📌 REGPC: Filtered out 45 rows where IsCalculationOnly = TRUE
   CSV Earning Codes:
     - DBLPC: 11.6300 hrs, $581.50 (1 rows)
     - MEALW: 751.0000 hrs, $18,775.00 (5 rows)
     - REGPC: 51,715.9800 hrs, $1,292,899.50 (234 rows)
     - OVTPC: 2,860.8000 hrs, $34,886.75 (15 rows)
     - RSTBP: 913.5000 hrs, $22,837.50 (8 rows)
```

---

## ⚠️ Important Notes

1. **Other earning codes** (DBLPC, MEALW, OVTPC, RSTBP, etc.) do **NOT** have `IsCalculationOnly = TRUE` rows
2. **Only REGPC** requires this special filtering
3. **The UI** only displays rows where `IsCalculationOnly = FALSE`
4. **CSV validation** must match what the UI displays, hence the filtering

---

## 🎯 Summary

| Earning Code | IsCalculationOnly Filtering Required? |
|--------------|--------------------------------------|
| DBLPC        | ❌ No                                |
| MEALW        | ❌ No                                |
| OVTPC        | ❌ No                                |
| RSTBP        | ❌ No                                |
| **REGPC**    | **✅ Yes** - Filter out `TRUE` rows |
| PDSCK        | ❌ No                                |
| COMM         | ❌ No                                |

---

## 📅 Last Updated

- **Date**: 2026-07-08
- **Updated by**: Agent
- **Change**: Added IsCalculationOnly filtering for REGPC in UKG EARNINGS validation
