# PayHub Validation UI Guide

## 🎯 Overview

The PayHub Validation UI is a web-based interface for managing and validating calculation group runs. It provides a streamlined workflow for testing earning code calculations across DEV and STAGE environments.

## 🚀 Quick Start

### 1. Start the Server
```bash
node server-validation.js
```

### 2. Open the UI
Navigate to: `http://localhost:3002/group-run-ui-enhanced.html`

### 3. Set Up Authentication (First Time Only)

**For DEV:**
```bash
npx playwright test tests/save-auth-dev-manual.spec.ts --headed
```
Log in manually when the browser opens, wait 60 seconds for auth to save.

**For STAGE:**
```bash
npx playwright test tests/save-auth-stage-manual.spec.ts --headed
```
Log in manually when the browser opens, wait 60 seconds for auth to save.

## 📊 Using the Validation Tab

### Step 1: Select Environment
- Choose **DEV** or **STAGE** from the environment dropdown
- DEV: Development environment (Group ID: 3)
- STAGE: Staging environment (Group ID: 10)

### Step 2: Load Runs
1. Click **"🔄 Load SLFCAB Runs"**
2. Wait 1-2 minutes while Playwright fetches runs from PayHub
3. The dropdown will populate with ALL runs:
   - ✅ **SUCCEEDED** runs (normal text, green checkmark)
   - ❌ **FAILED** runs (red italic text, red X)

**Example dropdown entries:**
```
336418a0 - ✅ SUCCEEDED - 07/08/2026 02:41:29
f0449ad0 - ✅ SUCCEEDED - 05/19/2026 16:23:02
a3f12b8e - ❌ FAILED - 05/15/2026 14:12:33
```

### Step 3: Select a Run
- Click the dropdown and choose a run ID
- SUCCEEDED runs appear first (auto-selected)
- The full UUID is automatically copied to the input field below

### Step 4: Select Earning Codes to Validate

Check one or more earning codes:

#### Available Codes:
- **DBLPC** - Double Premium (3 validation scripts)
  - Totals validation
  - Average rate validation
  - Daily breakdown validation

- **MEALW** - Meal Waiver (3 validation scripts)
  - Totals validation
  - Average rate validation
  - Daily breakdown validation

- **WFM HOURS** - WFM Paycode Hours Sum Validation
  - Validates total hours match between WFM and UKG

- **UKG EARNINGS** - All UKG Pro Earning Codes (CSV vs UI)
  - Compares all earning codes between CSV export and UI

- **OVTPC** - Overtime Premium, Half-Rate (3 validation scripts)
  - **Important**: Uses `Average Rate / 2` (0.5x)
  - Totals, average rate, and daily validations

- **REGPC** - Regular Pay, Average Rate (3 validation scripts)
  - **Important**: Always filters `IsCalculationOnly = TRUE`
  - Totals, average rate, and daily validations

- **RSTBP** - Rest Break Pay, Average Rate (3 validation scripts)
  - Totals, average rate, and daily validations

#### Quick Selection Buttons:
- **Select All Available** - Checks all earning codes
- **Clear All** - Unchecks all earning codes

### Step 5: Choose Browser Mode
- **Headless** (Faster, No Browser Window) - Default
- **Headed** (Visible Browser Window) - For debugging

### Step 6: Run Validation
1. Click **"✅ Validate Selected Codes"**
2. Watch the progress bar (dark text, visible on both backgrounds)
3. Monitor real-time validation output:
   ```
   🔄 Running: slfcab-rstbp-1-totals.spec.ts...
   ✅ slfcab-rstbp-1-totals.spec.ts: PASSED
   🔄 Running: slfcab-rstbp-2-avgrate.spec.ts...
   ✅ slfcab-rstbp-2-avgrate.spec.ts: PASSED
   ```

### Step 7: Review Results
- ✅ **PASSED** = Validation successful
- ❌ **FAILED** = Validation failed, check logs

### Step 8: Export Results
- **📥 Export as JSON** - Machine-readable format
- **📊 Export as Excel** - Spreadsheet format
- **📝 Export as Text** - Plain text report

## 🔧 Start Group Run Tab

### Purpose
Trigger new calculation group runs in PayHub.

### Usage
1. Select environment (DEV/STAGE)
2. Configure run parameters
3. Click "Start Run"
4. Monitor run status

## 🎯 Best Practices

### 1. Always Use Fresh Runs
- Click "🔄 Load Runs" before each validation session
- Ensures you're testing against the latest data

### 2. Validate Multiple Codes Together
- Select all relevant codes (e.g., DBLPC, MEALW, OVTPC)
- Saves time by running validations in sequence

### 3. Use Headless Mode for Speed
- Only use Headed mode when debugging failures
- Headless is 2-3x faster

### 4. Check Both Environments
- Validate in DEV first
- Then validate in STAGE before production

### 5. Monitor Progress
- Watch for failures in real-time
- Address issues immediately

## ⚠️ Troubleshooting

### "Group not found" Error
- **Cause**: Auth session expired
- **Fix**: Re-generate auth file (see Step 3 above)

### "Please select at least one earning code"
- **Cause**: No checkboxes selected
- **Fix**: Check at least one earning code before clicking validate

### Dropdown shows "No runs loaded yet"
- **Cause**: Haven't clicked "Load Runs" yet
- **Fix**: Click "🔄 Load SLFCAB Runs"

### Validation hangs or times out
- **Cause**: Network issues or slow PayHub response
- **Fix**: 
  1. Check network connection
  2. Try again
  3. Use Headed mode to see what's happening

### Auth files missing
- **Cause**: First-time setup not complete
- **Fix**: Run auth generation scripts (see Step 3)

## 📝 Technical Details

### File Locations
- **UI**: `group-run-ui-enhanced.html`
- **Server**: `server-validation.js` (Port 3002)
- **Validation Scripts**: `tests/slfcab-*.spec.ts`
- **Fetch Script**: `scripts/fetch-slfcab-job-runs.js`

### How It Works
1. **Load Runs**: Playwright navigates to PayHub, extracts run data, saves to JSON
2. **Validation**: Each test script runs Playwright to verify calculations
3. **Results**: Server aggregates results and sends to UI

### Environment Variables
Scripts automatically detect environment via:
- `ENVIRONMENT=dev` or `ENVIRONMENT=stage`
- Auth file selection based on environment

## 🔑 Important Notes

### REGPC Validation
Always filters `IsCalculationOnly = TRUE` when summing CSV rows. This is critical for accurate regular pay validation.

### OVTPC Validation
Always uses `Average Rate / 2` for the premium calculation (0.5x multiplier). This is the half-rate overtime premium.

### Run Selection
The UI auto-selects the first SUCCEEDED run. If no succeeded runs exist, it selects the first available run.

## 📊 Status Messages

### During Load Runs
- `⏳ Fetching fresh SLFCAB runs from PayHub STAGE... (this may take 1-2 minutes)`
- `✅ Fetched 10 runs from STAGE (3 succeeded, 7 failed)`

### During Validation
- `Starting validation...`
- `🔄 Running: slfcab-dblpc-1-totals.spec.ts...`
- `✅ slfcab-dblpc-1-totals.spec.ts: PASSED`
- `✅ Validation complete!`

## 🎨 UI Features

### Visual Indicators
- **Progress Bar**: Shows validation progress (0-100%)
- **Color Coding**: Green for success, red for failure
- **Icons**: ✅ (success), ❌ (failure), 🔄 (running), ⏳ (waiting)

### Auto-Scroll
Results area auto-scrolls to show latest validation output.

### Responsive Design
Works on desktop and laptop screens (1280px+).

---

**Need Help?**
Check the main [README.md](README.md) or refer to the [Technical Reference](TECHNICAL_REFERENCE.md).
