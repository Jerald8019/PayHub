# Group Job Runs Fetcher - Quick Reference Guide

## Overview
The `fetch-group-job-runs-universal.js` script allows you to fetch job runs from any Calculation Set Group with powerful filtering options.

---

## Basic Usage

### 1. List All Available Groups
```bash
node scripts/fetch-group-job-runs-universal.js --list
```
This will show all available Calculation Set Groups with their IDs.

### 2. Fetch All Runs from a Specific Group
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB"
```
or
```bash
node scripts/fetch-group-job-runs-universal.js "Pay Process"
```

---

## Filtering Options

### Filter by Status (SUCCEEDED or FAILED)
```bash
# Get only successful runs
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED

# Get only failed runs
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=FAILED
```

### Filter by Submission Status
```bash
# Get runs awaiting approval
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --submission="Awaiting Approval"

# Get runs not submitted
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --submission="Not Submitted"
```

### Combine Multiple Filters
```bash
# Get successful runs that are awaiting approval
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --submission="Awaiting Approval"
```

### Custom Output File
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --output=my-custom-output.json
```

---

## Output Files

The script creates the following files:

1. **`<groupname>-all-runs.json`** - Contains ALL job runs (unfiltered)
2. **`<groupname>-job-runs.json`** - Contains filtered runs (if filters applied)
3. **`debug-<groupid>-page.png`** - Screenshot of the page for debugging

---

## Examples

### Example 1: Get all SLFCAB runs
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB"
```
**Output:**
- `slfcab-pay-process-all-runs.json` - All runs

### Example 2: Get only successful SLFCAB runs
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED
```
**Output:**
- `slfcab-pay-process-all-runs.json` - All runs
- `slfcab-pay-process-job-runs.json` - Only successful runs

### Example 3: Get runs awaiting approval
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --submission="Awaiting Approval"
```
**Output:**
- `slfcab-pay-process-all-runs.json` - All runs
- `slfcab-pay-process-job-runs.json` - Only runs awaiting approval

### Example 4: Get successful runs awaiting approval with custom output
```bash
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED --submission="Awaiting Approval" --output=ready-for-approval.json
```
**Output:**
- `slfcab-pay-process-all-runs.json` - All runs
- `ready-for-approval.json` - Filtered runs

---

## JSON Output Format

Each job run in the output file has the following structure:

```json
{
  "id": "a0eebd40...",
  "shortId": "a0eebd40",
  "status": "SUCCEEDED",
  "submissionStatus": "Awaiting Approval",
  "triggeredAt": "06/29/2026 12:14:24",
  "payPeriod": "2026-PP12 - 05/18/2025 - 05/31/2025"
}
```

### Fields:
- **id**: Full job run ID (truncated with "..." in display)
- **shortId**: First 8 characters of the ID
- **status**: Run status (SUCCEEDED or FAILED)
- **submissionStatus**: Submission status (Awaiting Approval, Not Submitted, etc.)
- **triggeredAt**: Date and time when the run was triggered
- **payPeriod**: Pay period for the run

---

## Console Output Summary

The script displays:

1. **Total Runs**: Total number of job runs found
2. **By Status**: Breakdown by SUCCEEDED/FAILED
3. **By Submission Status**: Breakdown by submission status
4. **Filtered Results**: Number of runs after applying filters
5. **Sample Runs**: First 5 runs with details

Example output:
```
======================================================================
SUMMARY
======================================================================

Group: SLFCAB - Pay Process
Total Runs: 9

By Status:
  SUCCEEDED: 7
  FAILED: 2

By Submission Status:
  Awaiting Approval: 7
  Not Submitted: 2

Filtered Results: 7 runs

--- SAMPLE RUNS ---

1. a0eebd40...
   Status: SUCCEEDED
   Submission: Awaiting Approval
   Triggered: 06/29/2026 12:14:24
   Pay Period: 2026-PP12 - 05/18/2025 - 05/31/2025
```

---

## Troubleshooting

### Issue: "Group not found"
- Run `--list` to see all available groups
- Make sure you're using the correct group name (partial match is OK)

### Issue: "No job runs found"
- The group might not have any runs yet
- Check the screenshot file (`debug-<id>-page.png`) to see what's on the page

### Issue: Authentication errors
- Make sure `auth-state-dev.json` exists in the root directory
- Re-run the authentication script if needed

---

## Tips

1. **Use partial names**: You don't need the full group name. "SLFCAB" will match "SLFCAB - Pay Process"
2. **Check filters**: Use `--list` first to see available groups
3. **Save screenshots**: Screenshots are automatically saved for debugging
4. **Combine filters**: You can use multiple filters together for precise results

---

## Quick Command Reference

```bash
# List groups
node scripts/fetch-group-job-runs-universal.js --list

# Fetch all runs
node scripts/fetch-group-job-runs-universal.js "<GroupName>"

# Filter by status
node scripts/fetch-group-job-runs-universal.js "<GroupName>" --status=SUCCEEDED
node scripts/fetch-group-job-runs-universal.js "<GroupName>" --status=FAILED

# Filter by submission
node scripts/fetch-group-job-runs-universal.js "<GroupName>" --submission="Awaiting Approval"

# Combine filters
node scripts/fetch-group-job-runs-universal.js "<GroupName>" --status=SUCCEEDED --submission="Awaiting Approval"

# Custom output
node scripts/fetch-group-job-runs-universal.js "<GroupName>" --output=custom.json
```
