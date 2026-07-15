# 🚀 Earning Codes Scanner - Quick Start Guide

## Overview

This automated scanner collects earning codes from **all successful runs** across **all calculation groups** in PayHub and builds a comprehensive database that powers the Earning Codes Reference UI.

## 📋 Features

The scanner will:
1. Find all calculation set groups
2. For each group, find all SUCCEEDED runs  
3. For each run, extract earning codes from "UKG Pro Earning Codes (Staged)" table
4. Track which pay periods and employees use each code
5. Identify which codes have formulas that can be validated

## 🎯 Quick Start (2 Steps)

### Step 1: Save Your Login Session (One Time)

Run this **once** to save your authentication:

```powershell
npx playwright test tests/save-auth.spec.ts --headed
```

This will:
- Open a browser
- Log you into PayHub
- Save your session to `auth-state.json`
- You only need to do this once (or when your session expires)

### Step 2: Run the Comprehensive Scanner

Now run the automated scanner:

```powershell
npx playwright test tests/scan-all-groups.spec.ts --headed
```

This will:
- Use your saved login (no authentication needed!)
- Find all calculation groups
- Scan all SUCCEEDED runs
- Extract earning codes
- Save data to `earning-codes-data.json`

**Note**: This may take several minutes depending on how many groups and runs exist.

## 📊 View the Results

### Step 1: Restart the UI Server

```powershell
npm run ui
```

### Step 2: Open the Earning Codes Reference

Go to http://localhost:3000 and click the **"📋 Earning Codes"** tab.

### Step 3: Load and Filter

1. Click **"🔍 Load All Earning Codes"**
2. Use the **Group Filter** dropdown to select a calculation group (e.g., "KWFHBW - Pay Process")
3. See all earning codes for that group!

### Step 4: Explore Details

Click the **▶** arrow next to any earning code to see:
- Which pay periods it appears in
- How many employees used it
- Which run ID it came from

## 🎨 UI Features

### Filter Options:
- **Group Filter**: See codes for a specific calculation group
- **Type Filter**: Filter by verification status (verified/not verified)
- **Pay Period Filter**: Show codes with/without pay period data
- **Search**: Search by code or description

### Expandable Rows:
Click the ▶ arrow next to any code to see detailed pay period breakdown:
- Group name
- Pay period (e.g., 2026-PP12 - 04/05/2026 - 04/18/2026)
- Run ID
- Employee count

### Validation Status:
- ✅ **Green badge**: Code has formulas that can be validated
- ⚠️ **Yellow badge**: No validation available yet

## 🔧 Troubleshooting

### "Authentication state not found" error

Run the auth saver first:
```powershell
npx playwright test tests/save-auth.spec.ts --headed
```

### Scanner fails with timeout

Your session may have expired. Delete `auth-state.json` and run the auth saver again.

### No groups showing in UI

1. Check if `earning-codes-data.json` exists and has data
2. Restart the UI server: `npm run ui`
3. Refresh your browser (F5)
4. Click "🔍 Load All Earning Codes" again

### Want to scan just one run?

Edit `scan-runs.config.ts` and add your run URL, then run:
```powershell
npx playwright test tests/scan-earning-codes.spec.ts --headed
```

## 📁 Important Files

- `tests/save-auth.spec.ts` - Saves your login session
- `tests/scan-all-groups.spec.ts` - Comprehensive scanner for all groups
- `tests/scan-earning-codes.spec.ts` - Single-run scanner for specific runs
- `earning-codes-data.json` - The database file (auto-generated)
- `auth-state.json` - Your saved login session (auto-generated, gitignored)
- `scan-runs.config.ts` - Configuration for manual run URLs

## 🎯 Next Steps

After collecting earning codes data, you can:

1. **Identify codes with formulas** - Filter by "Has Validation" to see which codes support automated verification
2. **Run Calculation Verification** - Use the formulas to verify calculations (see CALCULATION_VERIFICATION_GUIDE.md)
3. **Track codes across pay periods** - See how codes are used over time
4. **Add custom formulas** - Update `scan-runs.config.ts` to add validation formulas for more codes

## 💡 Pro Tips

- Run the scanner periodically to keep data up-to-date with new runs
- The scanner **appends** new data, so running it multiple times is safe
- Use the Group Filter in the UI to focus on specific calculation groups
- The expandable rows show run-level detail - great for auditing!

---

**Happy Scanning!** 🎉
