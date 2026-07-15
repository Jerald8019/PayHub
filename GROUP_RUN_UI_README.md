# 🚀 PayHub - Group Run & Validation UI

Enhanced web interface for PayHub Group Run automation and earning code validation.

## ⚠️ IMPORTANT: Run ID Configuration

**The current DBLPC validation suite is LOCKED to Run ID: `958b24ea`**

- The Run ID field in the UI is **read-only** and pre-filled with `958b24ea`
- **DO NOT modify** the Run ID value
- If you attempt to change it, validation will be blocked with an error message
- All 3 DBLPC validation scripts are configured for this specific run
- To validate a different run, the scripts need to be updated accordingly

## 📋 Features

### Tab 1: Start Group Run
- Configure and start group runs for any calculation set group
- Support for Development and Stage environments
- Options for correction runs, auto-cancel, and check-only mode
- Real-time execution feedback

### Tab 2: SLFCAB Validations
- **Checkbox selection** for earning codes (DBLPC, MEALW, OVTPC, REGPC, RSTBP)
- **Multi-script execution** - When DBLPC is checked, runs all 3 validation scripts:
  - Script 1: Summary Totals Validation
  - Script 2: Average & Premium Rate Validation
  - Script 3: Daily Breakdown Validation
- **Real-time progress tracking** with progress bar
- **Export results** to JSON file
- Status indicators for each script (✅ PASSED, ❌ FAILED, ⏳ RUNNING)

## 🛠️ Setup

### Prerequisites
```bash
npm install express cors
```

### Start the Backend Server
```bash
node server-validation.js
```

You should see:
```
============================================================
🚀 PayHub Validation Server Running
============================================================

📍 Server URL: http://localhost:3000
📋 Open UI: http://localhost:3000/group-run-ui-enhanced.html

============================================================
```

## 🎯 Usage

### Method 1: Via Browser
1. Start the server: `node server-validation.js`
2. Open: http://localhost:3000/group-run-ui-enhanced.html
3. Navigate to the **"SLFCAB Validations"** tab
4. Enter the Run ID (e.g., `958b24ea`)
5. Check the earning codes you want to validate (e.g., ☑ DBLPC)
6. Click **"✅ Validate Selected Codes"**
7. Watch the progress bar and see real-time results
8. Click **"📥 Export Results"** to download JSON report

### Method 2: Manual Execution (Without UI)
Run individual scripts directly:
```bash
# DBLPC - All 3 scripts
npx playwright test tests/slfcab-dblpc-1-totals.spec.ts --headed
npx playwright test tests/slfcab-dblpc-2-avgrate.spec.ts --headed
npx playwright test tests/slfcab-dblpc-3-daily.spec.ts --headed

# Or all at once
npx playwright test tests/slfcab-dblpc-*.spec.ts --headed
```

## 📊 Validation Scripts

### DBLPC (Double Premium) - ✅ READY
- **Script 1**: `slfcab-dblpc-1-totals.spec.ts`
  - Validates: Summary DBLPC = Filtered DBLPC totals
  
- **Script 2**: `slfcab-dblpc-2-avgrate.spec.ts`
  - Validates: Week 1 & Week 2 Average Hourly Rate
  - Validates: Premium Rate = Avg Rate × 1.0
  - Flags: ",2" bug in formulas
  
- **Script 3**: `slfcab-dblpc-3-daily.spec.ts`
  - Validates: DBLPC in Earnings Breakdown tab
  - Validates: Rate Details (Calculation Set Name, Hours, Amount, Rate)
  - Validates: Premium Rate × Hours = Amount
  - Flags: ",2" bug in calculations

### Other Codes - 🔜 COMING SOON
- **MEALW** - Meal Waiver
- **OVTPC** - Overtime Premium
- **REGPC** - Regular Pay
- **RSTBP** - Rest Break Pay

## 📥 Export Format

Exported JSON includes:
```json
{
  "exportDate": "2026-06-25T10:30:00.000Z",
  "runId": "958b24ea",
  "results": [
    {
      "script": "DBLPC - Script 1: Summary Totals",
      "status": "PASSED",
      "timestamp": "2026-06-25T10:30:05.000Z",
      "command": "npx playwright test tests/slfcab-dblpc-1-totals.spec.ts --headed",
      "output": "..."
    }
  ],
  "summary": {
    "total": 3,
    "passed": 3,
    "failed": 0
  }
}
```

## 🎨 UI Features

- **Modern gradient design** with purple/blue theme
- **Responsive layout** adapts to different screen sizes
- **Real-time progress bar** shows validation progress
- **Color-coded results**:
  - 🟢 Green: Passed
  - 🟡 Yellow: Running
  - 🔴 Red: Failed
- **Smooth animations** and transitions
- **Export functionality** for results archival

## 🔧 Troubleshooting

### Backend not running
If you see: "Backend not running. Run: node server-validation.js"
- Make sure the server is started: `node server-validation.js`
- Check that port 3000 is not in use

### Scripts failing
- Ensure `auth-state-dev.json` exists and is valid
- Verify Run ID is correct
- Check that the run has the earning code data available

## 🚀 Next Steps

1. **Test DBLPC validation** - All 3 scripts are ready
2. **Record & create scripts** for remaining codes (MEALW, OVTPC, REGPC, RSTBP)
3. **Add more features**:
   - Run history
   - Scheduled validations
   - Email notifications
   - Integration with CI/CD

---

**Need help?** Check the validation script output or console logs for detailed error messages.
