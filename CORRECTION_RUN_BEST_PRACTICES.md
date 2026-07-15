# ✅ Correction Run - Best Practices

## 🎯 Quick Answer: How to Run a Correction Run

**✅ RECOMMENDED: Check BOTH checkboxes**

```
☑️ Automatically cancel existing runs
☑️ Run as correction (if submission already exists)
```

**Why?** This handles ALL scenarios:
- ✅ If run can be cancelled → Cancels and starts fresh
- ✅ If run CANNOT be cancelled → Falls back to correction run
- ✅ Works for ANY run status
- ✅ No errors!

---

## 📊 Configuration Comparison

| Configuration | Works for AwaitingApproval | Works for AwaitingPostAction | Reliability |
|---------------|---------------------------|------------------------------|-------------|
| **Both checked** ✅ | ✅ Yes (cancels) | ✅ Yes (correction) | **100%** ⭐ |
| Auto-cancel only | ✅ Yes (cancels) | ❌ Error | 50% |
| Correction only | ⚠️ May work | ⚠️ May not work | 60% |
| Neither checked | ❌ Error | ❌ Error | 0% |

---

## 🔍 Understanding Run Statuses

### **Cancellable Statuses** (Auto-cancel works):
- ✅ **AwaitingApproval** - Run created but not submitted
- ✅ **NotSubmitted** - Draft run
- ✅ **Queued** - Waiting to process

### **Non-Cancellable Statuses** (Need correction run):
- ❌ **AwaitingPostAction** - Final processing stage
- ❌ **Completed** - Run finished  
- ❌ **Cancelled** - Already cancelled
- ❌ **Processing** - Currently running

---

## 🎬 Step-by-Step: Running a Correction Run

### Step 1: Open Web UI
```powershell
npm run ui
```

Open browser to http://localhost:3000

### Step 2: Fill Form
- **Group**: Select your group (e.g., KWFHBW)
- **Start Date**: Select pay period start (e.g., Feb 22, 2026)
- **End Date**: Auto-populated (2 weeks later)

### Step 3: Check BOTH Checkboxes ✅
- ☑️ **Automatically cancel existing runs**
- ☑️ **Run as correction (if submission already exists)**

### Step 4: Review Action Preview
You should see:
```
✅ Recommended Configuration
Action Preview:
• If existing run is cancellable → Will cancel and start fresh run
• If existing run is NOT cancellable → Will try correction run instead
This handles all scenarios including runs in "AwaitingPostAction" status!
```

### Step 5: Click "🚀 Start Group Run"

### Step 6: Monitor Logs
Watch real-time logs for:
```
⚠️ EXISTING RUN FOUND
Status: AwaitingPostAction

Auto-cancel is enabled, attempting to cancel existing run...
⚠️ Cannot cancel this run (status: AwaitingPostAction)

⚠️ Auto-cancel failed, but correction run mode is enabled
   Will attempt to start as correction run instead

Starting new group run...
⚠️ ERROR FROM PAYHUB:
Cannot Start Group Run A regular run is in progress...

⚠️ Correction run mode is enabled - checking for "CONTINUE AS CORRECTION RUN" button...
  Found "CONTINUE AS CORRECTION RUN" button - proceeding with correction run...
  Clicked "CONTINUE AS CORRECTION RUN"
  Looking for "Original Run to Correct" dropdown...
  Found "Original Run to Correct" dropdown
  Selecting first option: "2026-PP08 — Completed..."
  ✓ Selected original run to correct
  Found enabled "START GROUP RUN" button
  Clicked "START GROUP RUN"
✅ Correction run submitted successfully
```

---

## ❌ What NOT to Do

### ❌ Don't: Check only "Correction Run"
```
☐ Automatically cancel existing runs
☑️ Run as correction (if submission already exists)
```

**Problem**: May fail for certain run statuses
**Error**: `Cannot Start Group Run A regular run is in progress`

### ❌ Don't: Check only "Auto-cancel"
```
☑️ Automatically cancel existing runs
☐ Run as correction (if submission already exists)
```

**Problem**: Fails when run can't be cancelled
**Error**: `Cannot cancel this run (status: AwaitingPostAction)`

---

## 🎯 Summary

| Scenario | What to Do | Result |
|----------|-----------|--------|
| **Run in AwaitingApproval** | Check both ✅ | Cancels → Fresh run |
| **Run in AwaitingPostAction** | Check both ✅ | Correction run |
| **Submission exists** | Check both ✅ | Correction run |
| **No existing run** | Check both ✅ | Fresh run |

**Bottom Line**: Always check BOTH checkboxes for maximum reliability! ✅✅

---

## 🤔 FAQ

**Q: Why doesn't checking only "Correction Run" work?**  
A: The correction run button only appears AFTER attempting to start. If there's a blocking error before the dialog opens, it never gets a chance to show the correction button.

**Q: What if I only want to cancel, not correct?**  
A: Still check both! If cancel succeeds, it won't attempt correction. The correction is just a fallback.

**Q: Can I uncheck both for a fresh run?**  
A: Only if you're SURE there's no existing run. Otherwise, you'll get an error.

**Q: What happens if I select the wrong original run?**  
A: You can cancel in PayHub UI before approving. The automation just selects the first option by default.

---

**Last Updated**: June 11, 2026  
**Version**: 1.1
