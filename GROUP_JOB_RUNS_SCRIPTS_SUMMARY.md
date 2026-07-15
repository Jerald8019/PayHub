# Group Job Runs Fetcher - Complete Summary

## 📋 Overview

You now have **3 scripts** to fetch Group Job Runs from the Ashley Furniture Payroll Calculation Engine:

1. **`fetch-slfcab-job-runs.js`** - Simple, reliable script specifically for SLFCAB
2. **`fetch-group-job-runs-universal.js`** - Advanced script for any group with filtering
3. **`fetch-group-job-runs.spec.ts`** - Playwright test version

---

## ✅ RECOMMENDED: Simple SLFCAB Script

### Script: `scripts/fetch-slfcab-job-runs.js`

**Best for:** Quick, reliable fetching of SLFCAB group job runs

### Usage:
```bash
node scripts/fetch-slfcab-job-runs.js
```

### What it does:
1. ✅ Navigates to Calculation Engine
2. ✅ Clicks on "Calculation Set Groups"
3. ✅ Finds and clicks "SLFCAB - Pay Process"
4. ✅ Extracts all job runs from the table
5. ✅ Saves to `slfcab-group-job-runs.json`

### Output:
- **`slfcab-group-job-runs.json`** - All job runs with full details
- **`debug-slfcab-page.png`** - Screenshot for debugging
- **Console summary** - Status breakdown and sample runs

### Example Output:
```json
[
  {
    "id": "a0eebd40...",
    "shortId": "a0eebd40",
    "status": "SUCCEEDED",
    "submissionStatus": "Awaiting Approval",
    "triggeredAt": "06/29/2026 12:14:24",
    "payPeriod": "2026-PP12 - 05/18/2025 - 05/31/2025"
  }
]
```

---

## 📊 BONUS: Offline Filter

### Script: `scripts/filter-job-runs.js`

**Best for:** Quickly filtering already-fetched data without re-fetching from server

### Usage:
```bash
# Filter existing data file
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED

# Multiple filters
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --submission="Awaiting Approval"

# Custom output
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --output=approved.json
```

### Example Results:
```
Loaded 9 job runs
Filtering by status: SUCCEEDED
  9 → 7 runs

✓ Saved 7 filtered runs to: slfcab-group-job-runs-filtered.json
```

---

## 🚀 ADVANCED: Universal Script with Filters

### Script: `scripts/fetch-group-job-runs-universal.js`

**Best for:** Fetching from any group with custom filtering options

### Basic Usage:
```bash
# List all available groups
node scripts/fetch-group-job-runs-universal.js --list

# Fetch all runs from a specific group
node scripts/fetch-group-job-runs-universal.js "SLFCAB"
node scripts/fetch-group-job-runs-universal.js "Pay Process"
```

### Advanced Filtering:
```bash
# Get only SUCCEEDED runs
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED

# Get only FAILED runs
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=FAILED

# Get runs awaiting approval
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --submission="Awaiting Approval"

# Combine filters: Successful runs awaiting approval
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --submission="Awaiting Approval"

# Custom output filename
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --output=approved-runs.json
```

### Output Files:
- **`<groupname>-all-runs.json`** - All runs (always created)
- **`<groupname>-job-runs.json`** - Filtered runs (created when filters are used)
- **`debug-<id>-page.png`** - Screenshot

### Filter Options:
| Option | Description | Example |
|--------|-------------|---------|
| `--status` | Filter by SUCCEEDED or FAILED | `--status=SUCCEEDED` |
| `--submission` | Filter by submission status | `--submission="Awaiting Approval"` |
| `--output` | Custom output filename | `--output=my-runs.json` |
| `--list` | List all available groups | `--list` |

---

## 🧪 TEST VERSION: Playwright Test

### Script: `tests/fetch-group-job-runs.spec.ts`

**Best for:** Running as part of test suite

### Usage:
```bash
npx playwright test tests/fetch-group-job-runs.spec.ts --headed
```

---

## 📊 Current Data

### Latest Successful Fetch (SLFCAB - Pay Process):
- **Total Runs:** 9
- **SUCCEEDED:** 7 (all awaiting approval)
- **FAILED:** 2 (not submitted)

### File: `slfcab-group-job-runs.json`
Contains all 9 runs with complete details:
- Job Run IDs
- Status (SUCCEEDED/FAILED)
- Submission Status  
- Triggered timestamps
- Pay Period information

---

## 🎯 Quick Start Guide

### For SLFCAB (Recommended):
```bash
node scripts/fetch-slfcab-job-runs.js
```

### For Other Groups:
```bash
# Step 1: List available groups
node scripts/fetch-group-job-runs-universal.js --list

# Step 2: Fetch runs from desired group
node scripts/fetch-group-job-runs-universal.js "<GroupName>"
```

### With Filters:
```bash
# Get only successful runs awaiting approval
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --submission="Awaiting Approval"
```

---

## 📁 File Structure

```
playwright-new/
├── scripts/
│   ├── fetch-slfcab-job-runs.js          # ⭐ Simple SLFCAB fetcher
│   ├── fetch-group-job-runs-universal.js # 🚀 Universal fetcher with filters
│   ├── fetch-group-runs.js                # Alternative version
│   └── ...
├── tests/
│   ├── fetch-group-job-runs.spec.ts      # Test version
│   └── ...
├── slfcab-group-job-runs.json            # ✅ Latest SLFCAB data (9 runs)
├── FETCH_JOB_RUNS_GUIDE.md               # 📖 Detailed guide
└── GROUP_JOB_RUNS_SCRIPTS_SUMMARY.md     # 📋 This file
```

---

## ✨ Features

### All Scripts Include:
- ✅ Automatic navigation through the UI
- ✅ Authentication handling (uses `auth-state-dev.json`)
- ✅ Table data extraction
- ✅ JSON output with clean formatting
- ✅ Console summaries with statistics
- ✅ Debug screenshots
- ✅ Error handling

### Universal Script Adds:
- ✅ Support for any calculation set group
- ✅ Status filtering (SUCCEEDED/FAILED)
- ✅ Submission status filtering
- ✅ Custom output filenames
- ✅ List all available groups
- ✅ Partial name matching

---

## 🔍 Troubleshooting

### Issue: "No job runs found"
- Check the screenshot file to see what's on the page
- The group might not have any runs yet

### Issue: "Group not found"
- Run with `--list` to see available groups
- Try using a partial name (e.g., "SLFCAB" instead of full name)

### Issue: Authentication errors
- Ensure `auth-state-dev.json` exists in the root directory
- Re-authenticate if needed

---

## 📚 Related Documentation

- **`FETCH_JOB_RUNS_GUIDE.md`** - Comprehensive usage guide for the universal script
- **`auth-state-dev.json`** - Authentication state file (required)
- **`slfcab-group-job-runs.json`** - Latest fetched data

---

## 🎉 Success!

You can now fetch Group Job Runs from any calculation set group with powerful filtering options!

**Quick Test:**
```bash
node scripts/fetch-slfcab-job-runs.js
```

This will fetch the latest SLFCAB job runs and save them to `slfcab-group-job-runs.json`.
