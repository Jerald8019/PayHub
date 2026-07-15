# 🤖 Automated Earning Codes Scanner - User Guide

## 🎯 **Overview**

The **Automated Earning Codes Scanner** extracts real earning codes data from actual PayHub runs by navigating to each run, finding the "UKG Pro Earning Codes (Staged)" table, and automatically building a comprehensive database of which codes appear in which pay periods.

---

## ✨ **What It Does**

### **Automated Process:**
1. Reads run URLs from configuration file
2. Logs into PayHub automatically
3. Navigates to each run's employees page
4. Extracts all earning codes from the summary table
5. Tracks which codes belong to which groups and pay periods
6. Saves to `earning-codes-data.json`
7. UI automatically loads this real data

### **Data Collected:**
- Earning code names (OVTPC, COMM, WRKHR, etc.)
- Which calculation groups use each code
- Which pay periods contain each code
- Run IDs for reference

---

## 🚀 **How to Use**

### **Step 1: Configure Runs to Scan**

Edit `scan-runs.config.ts`:

```typescript
export const RUNS_TO_SCAN: RunToScan[] = [
  {
    url: 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/5/runs/4ba9e883-b84e-4bd9-8ffc-fb9e3e24dd04',
    payPeriod: '2026-PP12 - 03/08/2026 - 03/21/2026',
    groupName: 'KWFHBW - Pay Process'
  },
  // Add more runs here!
];
```

**How to get run URLs:**
1. Go to PayHub
2. Navigate to a completed run
3. Copy the URL from browser address bar
4. Paste into the config file

### **Step 2: Run the Scanner**

```powershell
npx playwright test tests/scan-earning-codes.spec.ts --headed
```

**What you'll see:**
- Browser opens automatically
- Logs into PayHub
- Visits each run
- Extracts earning codes
- Saves to `earning-codes-data.json`
- Shows summary of results

**Example output:**
```
🤖 AUTOMATED EARNING CODES SCANNER
════════════════════════════════════════════════════════════════════════════════
📊 Runs to scan: 3
════════════════════════════════════════════════════════════════════════════════

[1/3] 📊 Scanning run...
────────────────────────────────────────────────────────────────────────────────
   Group ID: 5
   Run ID: 4ba9e883-b84...
   Loading employees page...
   Group: KWFHBW - Pay Process
   Pay Period: 2026-PP12 - 03/08/2026 - 03/21/2026

   🔍 Looking for earning codes summary...
   Found 8 potential earning codes on summary

   💾 Processing 8 unique earning codes...
      • COMM
      • DRAW
      • DRAWR
      • OVTPC
      • PDPLV
      • PTO
      • REGPC
      • WRKHR
   ✅ Run scanned successfully

[2/3] 📊 Scanning run...
...

💾 Saving data...
   ✅ Saved 15 earning codes to earning-codes-data.json

════════════════════════════════════════════════════════════════════════════════
✅ SCAN COMPLETE!

📊 Summary:
   Total Earning Codes: 15
   Verifiable Codes: 3
   Groups Covered: 4
   Runs Scanned: 3

💡 Next Steps:
   1. Review the data in earning-codes-data.json
   2. Restart the UI server: npm run ui
   3. Go to "📋 Earning Codes" tab to see your data
════════════════════════════════════════════════════════════════════════════════
```

### **Step 3: View the Data in UI**

1. **Restart the UI server**:
   ```powershell
   npm run ui
   ```

2. **Open browser**: http://localhost:3000

3. **Go to "📋 Earning Codes" tab**

4. **Click "🔍 Load All Earning Codes"**

5. **You'll see REAL data** from your scanned runs! 🎉

---

## 📋 **Configuration File Reference**

### **`scan-runs.config.ts`**

```typescript
export const RUNS_TO_SCAN: RunToScan[] = [
  {
    // Required: Full URL to the run
    url: 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/5/runs/[RUN-ID]',
    
    // Optional but recommended: Pay period for reference
    payPeriod: '2026-PP12 - 03/08/2026 - 03/21/2026',
    
    // Optional but recommended: Group name
    groupName: 'KWFHBW - Pay Process'
  }
];

// Your PayHub credentials
export const CREDENTIALS = {
  email: 'your.email@ashleyfurniture.com',
  password: 'YourPassword'
};

// Output file (loads automatically in UI)
export const OUTPUT_FILE = 'earning-codes-data.json';
```

---

## 🎯 **Example: Scanning Multiple Runs**

To get comprehensive data, scan multiple runs from different:
- Pay periods
- Calculation groups
- Time frames

**Example config:**

```typescript
export const RUNS_TO_SCAN: RunToScan[] = [
  // KWFHBW - Recent period
  {
    url: 'https://people.stage.ashleyfurniture.com/payhub/.../5/runs/4ba9e883-...',
    payPeriod: '2026-PP12 - 03/08/2026 - 03/21/2026',
    groupName: 'KWFHBW - Pay Process'
  },
  // KWFHBW - Previous period
  {
    url: 'https://people.stage.ashleyfurniture.com/payhub/.../5/runs/84e5b2e3-...',
    payPeriod: '2026-PP12 - 02/22/2026 - 03/07/2026',
    groupName: 'KWFHBW - Pay Process'
  },
  // AGRHBW - Recent period
  {
    url: 'https://people.stage.ashleyfurniture.com/payhub/.../9/runs/d3e9f567-...',
    payPeriod: '2026-PP12 - 02/22/2026 - 03/07/2026',
    groupName: 'AGRHBW - Pay Process'
  }
];
```

This will give you a complete picture of which codes appear across different groups and periods!

---

## 📊 **Output File Structure**

**`earning-codes-data.json`:**

```json
[
  {
    "code": "OVTPC",
    "description": "Overtime Premium Calculation",
    "type": "Premium",
    "groups": ["KWFHBW", "AGRHBW"],
    "hasValidation": true,
    "formulas": [
      "Total Earnings ÷ Total Hours = Average Rate",
      "Average Rate ÷ 2 = Half Rate",
      "Hours × Half Rate = Amount (Daily)"
    ],
    "payPeriods": [
      {
        "group": "KWFHBW",
        "period": "2026-PP12 - 03/08/2026 - 03/21/2026",
        "runId": "4ba9e883-b84e-4bd9-8ffc-fb9e3e24dd04",
        "employeeCount": 1
      }
    ]
  },
  ...
]
```

---

## 🔧 **Customization**

### **Add New Code Descriptions**

Edit `scan-runs.config.ts`:

```typescript
export const CODE_DESCRIPTIONS: { [key: string]: string } = {
  'OVTPC': 'Overtime Premium Calculation',
  'MYCODE': 'My Custom Code Description',
  // Add more here
};
```

### **Mark Codes as Verifiable**

Edit the `isCodeVerifiable` function in `scan-runs.config.ts`:

```typescript
export function isCodeVerifiable(code: string): boolean {
  const verifiableCodes = ['OVTPC', 'OT/7I', '7I OT', 'MYNEWCODE'];
  return verifiableCodes.includes(code);
}
```

---

## ❓ **FAQ**

**Q: How often should I run the scanner?**
A: Run it whenever you want to update the data with new pay periods or runs.

**Q: Does it overwrite existing data?**
A: No! It merges new data with existing data, adding new pay periods to existing codes.

**Q: Can I run it headless?**
A: Yes! Remove `--headed` flag: `npx playwright test tests/scan-earning-codes.spec.ts`

**Q: What if a run fails to scan?**
A: The scanner continues with other runs and shows which ones failed.

**Q: Can I edit the JSON file manually?**
A: Yes! You can manually edit `earning-codes-data.json` to add/remove/update codes.

---

**Created**: June 17, 2026  
**Feature**: Automated Earning Codes Scanner  
**Status**: ✅ Fully Automated  
