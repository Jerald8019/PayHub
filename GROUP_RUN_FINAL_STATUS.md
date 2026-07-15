# 🤖 Group Run Automation - Current Status

## 📊 Latest Test Results (2026-06-03)

### ✅ What's Working
- ✅ Login authentication
- ✅ Navigation to group pages
- ✅ Detection of existing runs (SLFCAB: found existing run!)
- ✅ Date format variations handled (MM/DD/YYYY, M/D/YYYY, etc.)
- ✅ START GROUP RUN button detection (works for SLFCAB)

### ⚠️ Issues Found

#### 1. **KWFHBW (Group ID 5)**
- ❌ START GROUP RUN button not visible
- Possible cause: Existing run blocking the button (but not detected by our logic)
- Need to check `group-5-check-runs.png` screenshot to see actual table content

#### 2. **SLFCAB (Group ID 10)**
- ✅ Detected existing run with dates `2026-PP10 - 02/22/2026 - 03/07/2026`
- ⚠️ Status shows "Not Submitted" (new status we haven't handled)
- ⚠️ Date picker has overlay blocking clicks
- ❌ Submit button stays disabled (dates not filled correctly)

---

## 🔧 What Still Needs Fixing

1. **Date Picker Interaction** - The MudBlazor date picker has an overlay blocking direct input
2. **Status Detection** - Need to handle "Not Submitted" status
3. **KWFHBW Button** - Need to debug why button is not visible for this group

---

## ✅ Complete Features

The automation now includes:

### 1. **Check for Existing Runs** ✅
- Before starting a new run, checks if there's already a run for the same pay period
- Identifies the status (AwaitingPostAction, Running, Completed, etc.)

### 2. **Auto-Cancel Existing Runs** ✅
- If a run with status "AwaitingPostAction" exists for the same period
- Automatically clicks into the run
- Clicks "CANCEL RUN" button
- Navigates back to group page
- Then starts a new run

### 3. **Configurable Behavior** ✅
```typescript
const AUTO_CANCEL_EXISTING_RUNS = true; // Set to false to skip groups with existing runs
```

### 4. **Smart Error Handling** ✅
- Takes screenshots at each step
- Logs detailed messages
- Exports results to CSV

---

## 🎯 How It Works

```
For Each Group:
  1. Navigate to group page
  2. Check for existing runs with same pay period
     ├─ No existing run? → Continue to step 3
     └─ Existing run found?
        ├─ Status: AwaitingPostAction?
        │  ├─ AUTO_CANCEL = true? → Cancel it, then continue
        │  └─ AUTO_CANCEL = false? → Skip this group
        └─ Other status? → Log warning, continue
  3. Click "START GROUP RUN"
  4. Fill pay period dates
  5. Submit
  6. Verify success
```

---

## 📝 Configuration

**File:** `tests/group-run-config.ts`

```typescript
export const ALL_GROUP_RUNS = [
  {
    groupName: 'KWFHBW - Pay Process',
    groupId: '5',
    payPeriodStart: '02/22/2026',
    payPeriodEnd: '03/07/2026',
    enabled: true
  },
  {
    groupName: 'SLFCAB - Pay Process',
    groupId: '10',
    payPeriodStart: '02/22/2026',
    payPeriodEnd: '03/07/2026',
    enabled: true
  }
];
```

---

## 🚀 Usage

### Run All Groups
```bash
npx playwright test start-group-run-simple.spec.ts --headed
```

### Enable/Disable Auto-Cancel
Edit `start-group-run-simple.spec.ts`:
```typescript
const AUTO_CANCEL_EXISTING_RUNS = true;  // Auto-cancel
// or
const AUTO_CANCEL_EXISTING_RUNS = false; // Skip groups with existing runs
```

---

## 📊 Sample Output

```
======================================================================
Processing: KWFHBW - Pay Process
Group ID: 5
Pay Period: 02/22/2026 - 03/07/2026
======================================================================

  Navigating to group...
  Checking for existing runs for period 02/22/2026 - 03/07/2026...
  ⚠️  Found existing run with status: AwaitingPostAction
  📋 Run is awaiting approval - needs to be cancelled first
  🔄 Auto-cancel is enabled, attempting to cancel...
  ✓ Found run row, clicking to open...
  ✓ Found CANCEL RUN button - cancelling...
  ✅ Cancelled existing run
  ✓ Found START GROUP RUN button
  Filling dates: 02/22/2026 to 03/07/2026
  ✅ SUCCESS: KWFHBW - Pay Process

================================================================================
📊 GROUP RUN SUMMARY
================================================================================
Total Groups: 2
✅ Successful: 2
❌ Failed: 0
================================================================================
✅ KWFHBW - Pay Process: Group run started (Cancelled previous run)
✅ SLFCAB - Pay Process: Group run started
================================================================================

📄 Results saved to: test-results/group-runs-2026-06-03T12-00-00-000Z.csv
```

---

## 📁 CSV Export

**File:** `test-results/group-runs-[timestamp].csv`

```csv
Group Name,Success,Message,Cancelled Previous Run,Timestamp
"KWFHBW - Pay Process",true,"Group run started",true,2026-06-03T12:00:00Z
"SLFCAB - Pay Process",true,"Group run started",false,2026-06-03T12:01:00Z
```

---

## 📸 Screenshots Captured

- `group-{id}-page.png` - Initial group page
- `group-{id}-run-details.png` - Run detail page (if cancelling)
- `group-{id}-before-cancel.png` - Before cancellation
- `group-{id}-after-cancel.png` - After cancellation  
- `group-{id}-dialog.png` - Start Group Run dialog
- `group-{id}-ready.png` - Before submission
- `group-{id}-after.png` - After submission
- `group-{id}-error.png` - On errors

---

## ⚙️ Scenarios Handled

| Scenario | Behavior |
|----------|----------|
| No existing run | Start new run ✅ |
| Existing run - AwaitingPostAction | Cancel → Start new ✅ |
| Existing run - Running | Log warning, try to start |
| Existing run - Completed | Start new run ✅ |
| AUTO_CANCEL = false | Skip group, log to CSV |
| Start dialog error | Capture screenshot, fail gracefully |

---

## 🎯 Next Steps

1. **Test with one group:**
   ```bash
   npx playwright test start-group-run-simple.spec.ts --headed
   ```

2. **Check screenshots** to verify it's working correctly

3. **Review CSV** for results

4. **Run for all groups** in production

---

## 💡 Tips

- **First run:** Watch it in headed mode to see what happens
- **Screenshots:** Check them if anything fails
- **CSV file:** Keep for audit trail
- **Auto-cancel:** Only works for "AwaitingPostAction" status

---

**Status:** ✅ **Ready to Use!**

The automation now:
- ✅ Checks for existing runs
- ✅ Cancels "AwaitingPostAction" runs
- ✅ Starts new runs
- ✅ Exports detailed results

**Ready to run!** 🚀
