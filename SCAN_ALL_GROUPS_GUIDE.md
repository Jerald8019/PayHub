# 🌍 Comprehensive Earning Codes Scanner - User Guide

## 🎯 **Overview**

The **Comprehensive Scanner** automatically finds **ALL** calculation set groups in PayHub and extracts earning codes from the latest run in each group. This gives you a complete database of all earning codes across your entire system.

---

## ✨ **What It Does**

### **Fully Automated Process:**
1. ✅ Logs into PayHub
2. ✅ Finds ALL calculation set groups automatically
3. ✅ For each group, gets the latest SUCCEEDED run
4. ✅ Extracts earning codes from each run
5. ✅ Builds a comprehensive database
6. ✅ Saves to `earning-codes-data.json`

### **No Manual Configuration Required!**
- No need to add run URLs manually
- No need to know group IDs
- No need to find latest runs yourself
- Just run the script and it does everything!

---

## 🚀 **How to Use**

### **Super Simple - Just One Command!**

```powershell
npx playwright test tests/scan-all-groups.spec.ts --headed
```

That's it! Watch it automatically scan your entire PayHub system.

---

## 📊 **What You'll See**

### **Example Output:**

```
🌍 COMPREHENSIVE EARNING CODES SCANNER
════════════════════════════════════════════════════════════════════════════════
📊 Scanning ALL calculation set groups...
════════════════════════════════════════════════════════════════════════════════

🔐 Step 1: Logging into PayHub...
────────────────────────────────────────────────────────────────────────────────
   Entering credentials...
   ✓ Logged in

📋 Step 2: Finding all calculation set groups...
────────────────────────────────────────────────────────────────────────────────
   ✓ Found 15 calculation set groups:

      1. KWFHBW - Pay Process (ID: 5)
      2. AGRHBW - Pay Process (ID: 9)
      3. SWFHBW - Pay Process (ID: 12)
      4. ECMHBW - Pay Process (ID: 7)
      5. RLFHBW - Pay Process (ID: 8)
      6. DSGHRL - Pay Process (ID: 3)
      7. DSMHRL - Pay Process (ID: 4)
      8. SLFCAB - Pay Process (ID: 10)
      9. SLFNSB - Pay Process (ID: 11)
      ... and 6 more

🔍 Step 3: Scanning latest run from each group...
════════════════════════════════════════════════════════════════════════════════

[1/15] 📊 KWFHBW - Pay Process
────────────────────────────────────────────────────────────────────────────────
   Run ID: 4ba9e883-b84...
   Pay Period: 2026-PP12 - 03/08/2026 - 03/21/2026
   📋 Extracting earning codes...
   ✓ Found 8 earning codes: COMM, DRAW, DRAWR, OVTPC, PDPLV, PTO, REGPC, WRKHR
   ✅ Group scanned successfully

[2/15] 📊 AGRHBW - Pay Process
────────────────────────────────────────────────────────────────────────────────
   Run ID: d3e9f567-6g4...
   Pay Period: 2026-PP12 - 02/22/2026 - 03/07/2026
   📋 Extracting earning codes...
   ✓ Found 6 earning codes: OVTPC, 7I OT, WRKHR, HLDPY, VACAO, SICKP
   ✅ Group scanned successfully

[3/15] 📊 SWFHBW - Pay Process
────────────────────────────────────────────────────────────────────────────────
   Run ID: a2b8c456-3d2...
   Pay Period: 2026-PP11 - 02/08/2026 - 02/21/2026
   📋 Extracting earning codes...
   ✓ Found 7 earning codes: OT/7I, WRKHR, COMM, SHIFT, BONUS, VACAO, PTO
   ✅ Group scanned successfully

... continues for all groups ...

💾 Saving results...
════════════════════════════════════════════════════════════════════════════════
   ✅ Saved 25 earning codes to earning-codes-data.json

════════════════════════════════════════════════════════════════════════════════
✅ COMPREHENSIVE SCAN COMPLETE!

📊 Summary:
   Total Calculation Groups: 15
   Successfully Scanned: 13
   Skipped: 2 (no completed runs)
   Total Earning Codes: 25
   Verifiable Codes: 3
   Groups with Data: 13

💡 Next Steps:
   1. Review the data in earning-codes-data.json
   2. Restart the UI server: npm run ui
   3. Go to "📋 Earning Codes" tab to see comprehensive data
════════════════════════════════════════════════════════════════════════════════
```

---

## 🎯 **Benefits**

### **1. Complete Coverage**
- Scans **all** calculation groups automatically
- Doesn't miss any groups
- Ensures comprehensive data

### **2. Always Up-to-Date**
- Gets the **latest** run from each group
- Reflects current earning codes in use
- Re-run anytime to refresh data

### **3. Zero Manual Work**
- No need to find run URLs
- No need to configure anything
- Just run and watch it work

### **4. Real Data**
- Extracts from actual PayHub runs
- Shows which codes are actually being used
- Accurate group assignments

---

## 🔄 **When to Run**

### **Run this scanner:**
- ✅ After a new pay period completes
- ✅ When setting up the system for the first time
- ✅ Monthly to keep data fresh
- ✅ When you add new calculation groups
- ✅ To refresh the earning codes database

### **Recommended Schedule:**
- **Initial Setup**: Run once to build database
- **Monthly**: Re-run to update with latest runs
- **As Needed**: Re-run when you need fresh data

---

## 📋 **What Gets Saved**

### **File: `earning-codes-data.json`**

Contains all earning codes with:
- Code name (e.g., OVTPC, COMM)
- Description
- Type (Premium, Regular, Commission, etc.)
- Which groups use it
- Which pay periods it appears in
- Run IDs for reference
- Whether it has formula validation

**Example:**
```json
[
  {
    "code": "OVTPC",
    "description": "Overtime Premium Calculation",
    "type": "Premium",
    "groups": ["KWFHBW - Pay Process", "AGRHBW - Pay Process"],
    "hasValidation": true,
    "formulas": [
      "Total Earnings ÷ Total Hours = Average Rate",
      "Average Rate ÷ 2 = Half Rate",
      "Hours × Half Rate = Amount (Daily)"
    ],
    "payPeriods": [
      {
        "group": "KWFHBW - Pay Process",
        "period": "2026-PP12 - 03/08/2026 - 03/21/2026",
        "runId": "4ba9e883-b84e-4bd9-8ffc-fb9e3e24dd04",
        "employeeCount": 1
      },
      {
        "group": "AGRHBW - Pay Process",
        "period": "2026-PP12 - 02/22/2026 - 03/07/2026",
        "runId": "d3e9f567-6g4h-5d82-f456-78c9d0e156ef",
        "employeeCount": 1
      }
    ]
  }
]
```

---

## 🎨 **View Results in UI**

After scanning:

1. **Restart UI server**:
   ```powershell
   npm run ui
   ```

2. **Open browser**: http://localhost:3000

3. **Go to "📋 Earning Codes" tab**

4. **Click "🔍 Load All Earning Codes"**

You'll see **complete data** from all your calculation groups! 🎉

---

## 🔧 **Comparison: Two Scanners**

| Feature | scan-earning-codes.spec.ts | scan-all-groups.spec.ts |
|---------|---------------------------|-------------------------|
| **Configuration** | Manual (add URLs) | Fully automatic |
| **Coverage** | Only specified runs | All groups |
| **Best For** | Specific runs/periods | Complete system scan |
| **Setup Time** | Need to find URLs | Zero setup |
| **Flexibility** | High (choose exactly which runs) | Lower (latest run only) |

### **Recommendation:**
- Use **`scan-all-groups.spec.ts`** (this one) for initial setup and monthly refreshes
- Use **`scan-earning-codes.spec.ts`** when you need specific runs or historical data

---

## ❓ **FAQ**

**Q: How long does it take?**  
A: Approximately 30-60 seconds per group. For 15 groups, about 10-15 minutes total.

**Q: What if a group has no completed runs?**  
A: It's skipped and noted in the summary.

**Q: Can I run it headless?**  
A: Yes! Remove `--headed`: `npx playwright test tests/scan-all-groups.spec.ts`

**Q: Does it overwrite my existing data?**  
A: No! It merges with existing data, adding new codes and pay periods.

**Q: Can I limit which groups to scan?**  
A: Currently scans all. If needed, use the manual scanner for specific groups.

---

**Created**: June 17, 2026  
**Feature**: Comprehensive All-Groups Scanner  
**Status**: ✅ Fully Automated  
