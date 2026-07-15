# 🔧 Group Run Automation - Current Status & Next Steps

## 📊 Latest Test Results (2026-06-03 07:03)

### ✅ What's Working
- ✅ Login & Authentication
- ✅ Navigation to group pages
- ✅ START GROUP RUN button found (for SLFCAB)
- ✅ Date format variations being checked

### ❌ What's NOT Working

#### 1. KWFHBW (Group ID 5)
**Problem:** START GROUP RUN button not visible
**Root Cause:** Likely blocked by existing runs, but our detection isn't finding them
- Found 11 rows on page
- But says "No existing run found for this period"
- From your screenshot, there SHOULD be runs with dates `02/22/2026 - 03/07/2026`

#### 2. SLFCAB (Group ID 10)  
**Problem 1:** Status detection failing
- ✅ Found existing run!
- ❌ Status detected as "Unknown" instead of "NotSubmitted"
- The row clearly shows "Not Submitted" but we're not parsing it correctly

**Problem 2:** Date picker interaction failing
- The MudBlazor date picker has `<div class="mud-overlay"></div>` blocking clicks
- Submit button stays disabled because dates aren't filled
- Input has `readonly` attribute

---

## 🔍 Root Cause Analysis

### Issue 1: Row Text Parsing
The row text includes ALL columns:
```
ID | Status | Submission Status | Triggered At | Pay Period
```

When we call `.textContent()` on the row, we get something like:
```
"B272AF47...SUCCEEDEDAwaiting Approval06/01/2026 19:52:212026-PP12 - 02/22/2026 - 03/07/2026"
```

**Problem:** Our status detection looks for "NOT SUBMITTED" but it's probably concatenated without spaces!

### Issue 2: Date Format Variations
Pay period shows as: `2026-PP12 - 02/22/2026 - 03/07/2026`

We're checking for `02/22/2026` but maybe there are spacing issues or the date format is slightly different.

### Issue 3: MudBlazor Date Picker
The date inputs are `readonly` and there's an overlay blocking direct interaction.

**Solution:** We need to:
1. Click on the calendar icon (if present)
2. Or use keyboard navigation
3. Or interact with the date picker popup

---

## 🛠️ Fixes Needed

### Fix 1: Improve Status Detection
```typescript
// Current problem: Looking for "NOT SUBMITTED" in uppercase
if (upperRowText.includes('NOT SUBMITTED'))

// Solution: Look for variations without spaces
if (upperRowText.includes('NOTSUBMITTED') || 
    upperRowText.includes('NOT SUBMITTED') ||
    upper Row Text.match(/NOT\s*SUBMITTED/))
```

### Fix 2: Debug Row Content
Add logging to see EXACTLY what the row text contains:
```typescript
console.log(`  DEBUG: Full row text = "${rowText}"`);
console.log(`  DEBUG: Checking for dates: ${payPeriodStart} and ${payPeriodEnd}`);
```

### Fix 3: Handle MudBlazor Date Picker
Instead of trying to fill readonly inputs, we need to:
1. Find the calendar icon button next to the input
2. Click it to open the date picker
3. Navigate the date picker calendar
4. Select the correct dates

---

## 📋 Action Items

### Priority 1: Debug Why Rows Aren't Being Detected
- [ ] Add console.log to print full row text
- [ ] Check if dates are in format `2/22/2026` vs `02/22/2026`
- [ ] Check if there are extra spaces or characters

### Priority 2: Fix Status Detection  
- [ ] Handle concatenated text (no spaces between columns)
- [ ] Test against actual row content from screenshots

### Priority 3: Fix Date Picker Interaction
- [ ] Use Playwright codegen to record the correct date picker interaction
- [ ] Or find the calendar icon buttons and click them
- [ ] Or try using `force: true` option to bypass readonly

---

## 🎯 Recommended Next Step

**Use Playwright Codegen to record the exact steps:**

```bash
npx playwright codegen https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/5
```

Then manually:
1. Click START GROUP RUN
2. Fill in the dates using the date picker
3. Click Submit
4. Copy the generated code

This will show us the EXACT selectors and interactions needed!

---

## 📸 Key Screenshots to Check

1. `group-5-check-runs.png` - See what rows are actually on KWFHBW page
2. `group-10-dialog.png` - See the date picker structure
3. `group-10-error.png` - See what error/state we're in

---

## 💡 Alternative Approach

Instead of trying to detect and cancel existing runs programmatically, we could:

1. **Manual Pre-Cleanup:** Have a separate script/process to cancel all "Awaiting Approval" and "Not Submitted" runs FIRST
2. **Then Run Automation:** Run the group start automation assuming no blocking runs exist

This would be simpler and more reliable!

---

## 🚀 Quick Win Option

For NOW, to test if the rest works:

1. Manually go to the UI
2. Cancel all existing runs for the test groups
3. Then run the automation
4. This will tell us if the date picker issue is the only remaining problem

---

**Status:** Need to debug row content and fix date picker interaction.
