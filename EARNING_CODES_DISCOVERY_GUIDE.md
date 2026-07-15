# 🔍 UKG Earning Codes Discovery - User Guide

## 📋 Overview

The **Earning Codes Discovery** feature automatically scans all 15 calculation set groups in PayHub and identifies which UKG earning codes are available in each group. This is essential for expanding validation coverage beyond SLFCAB to all groups.

---

## 🎯 Purpose

**Problem:** We currently have validation scripts for SLFCAB earning codes (DBLPC, MEALW, OVTPC, RSTBP, REGPC), but we don't know which codes exist in other groups like SLFNVB, SLFNSB, KWFHBW, etc.

**Solution:** The discovery script:
1. Navigates to all 15 calculation set groups
2. Opens the most recent SUCCEEDED run in each group
3. Extracts all earning codes from the "UKG Pro Earning Codes (Staged)" table
4. Generates a comprehensive report showing:
   - Which codes exist in which groups
   - Which codes are common across multiple groups
   - Sample data (hours and amounts) for each code

---

## 🚀 How to Use

### **Method 1: Via UI (Recommended)**

1. **Start the server** (if not already running):
   ```powershell
   node server-validation.js
   ```

2. **Open the UI**:
   ```
   http://localhost:3002/group-run-ui-enhanced.html
   ```

3. **Navigate to the "🔍 Earning Codes Discovery" tab**

4. **Select Environment**:
   - Choose **DEV** or **STAGE** from the dropdown

5. **Click "🔍 Discover Earning Codes (All 15 Groups)"**

6. **Wait for completion** (5-10 minutes):
   - Progress will be shown in real-time
   - Each group will be scanned sequentially

7. **Review Results**:
   - **Summary Stats**: Total groups scanned, successful scans, unique codes found
   - **All Unique Codes Table**: Shows each code and which groups it appears in
   - **Codes by Group**: Detailed breakdown of codes for each group with sample data

8. **Export Results**:
   - Click "💾 Export Results (JSON)" to save the full report

---

### **Method 2: Via Command Line**

**For DEV:**
```powershell
$env:ENVIRONMENT="dev"
node scripts/discover-earning-codes-all-groups.js
```

**For STAGE:**
```powershell
$env:ENVIRONMENT="stage"
node scripts/discover-earning-codes-all-groups.js
```

**Output Files:**
- `earning-codes-discovery-dev.json` - Full JSON results
- `earning-codes-discovery-dev.md` - Markdown report

---

## 📊 Understanding the Results

### **Summary Section**

Shows three key metrics:
- **Groups Scanned**: Total number of groups (should be 15)
- **Successful Scans**: Groups where earning codes were found
- **Unique Earning Codes**: Total distinct earning codes across all groups

### **All Unique Codes Table**

| # | Code | Found in Groups | Groups |
|---|------|-----------------|--------|
| 1 | COMM | 3 | SLFCAB, SLFNVB, SLFNSB |
| 2 | DBLPC | 5 | SLFCAB, SLFNVB, KWFHBW, RLFHBW, SWFHBW |
| ... | ... | ... | ... |

**Columns:**
- **#**: Sequential number
- **Code**: The earning code (e.g., DBLPC, MEALW, OVTPC)
- **Found in Groups**: Number of groups where this code appears
- **Groups**: Names of the groups (abbreviated)

### **Codes by Group Section**

Shows each group with:
- **Group Name**: e.g., "SLFCAB - Pay Process"
- **Group ID**: The numeric ID (e.g., 3 for SLFCAB in DEV)
- **Codes Found**: Number of earning codes
- **Table**: Code, Hours, and Amount for each earning code

**Status Indicators:**
- ✅ **Success**: Green border - earning codes found
- ⚠️ **Warning**: Orange border - no runs found or error

---

## 🔤 Common Earning Codes

Based on SLFCAB, common earning codes you might find include:

| Code | Description | Likely Groups |
|------|-------------|---------------|
| **COMM** | Commission Earnings | SLF groups |
| **DBLPC** | Double Premium Calculation | HBW groups (hourly) |
| **MEALW** | Meal Waiver | CA groups (California) |
| **OVTPC** | Overtime Premium Calculation | Most groups |
| **PDSCK** | Paid Sick Leave | Most groups |
| **REGPC** | Regular Pay Calculation | Most groups |
| **RSTBP** | Rest Break Pay | CA groups (California) |

**Note:** The actual codes vary by:
- **State regulations** (e.g., MEALW, RSTBP are California-specific)
- **Worker type** (HBW = Hourly, SBW = Salaried)
- **Facility type** (SLF, KWF, RLF, etc.)

---

## 📂 All 15 Calculation Set Groups

### **DEV Environment**

| # | Group Name | ID | Type |
|---|------------|-----|------|
| 1 | AGRHBW - Pay Process | 10 | Hourly |
| 2 | AHSHBW - Pay Process | 2 | Hourly |
| 3 | DSGHRL - Pay Process | 18 | Hourly |
| 4 | DSGSAL - Pay Process | 19 | Salary |
| 5 | DSMHRL - Pay Process | 20 | Hourly |
| 6 | ECMHBW - Pay Process | 8 | Hourly |
| 7 | KWFHBW - Pay Process | 6 | Hourly |
| 8 | KWFSBW - Pay Process | 13 | Salary |
| 9 | RLFHBW - Pay Process | 9 | Hourly |
| 10 | RLFSBW - Pay Process | 12 | Salary |
| 11 | SLFCAB - Pay Process | 3 | California (Hourly) |
| 12 | SLFNSB - Pay Process | 16 | Non-CA Salary |
| 13 | SLFNVB - Pay Process | 11 | Non-CA Hourly |
| 14 | SWFHBW - Pay Process | 7 | Hourly |
| 15 | SWFSBW - Pay Process | 14 | Salary |

**Group ID differs in STAGE** (see STAGE mapping in script)

---

## 💡 Use Cases

### **Use Case 1: Identify Validation Opportunities**
**Goal:** Find which groups have the same earning codes as SLFCAB

**Steps:**
1. Run discovery for DEV
2. Look for codes like DBLPC, MEALW, OVTPC in other groups
3. Identify groups where existing validation scripts can be reused

**Expected Outcome:** 
- MEALW and RSTBP likely only in California groups (SLFCAB, SLFNVB)
- OVTPC, REGPC likely in most/all groups
- DBLPC likely in hourly (HBW) groups

---

### **Use Case 2: Discover New Earning Codes**
**Goal:** Find earning codes we haven't validated yet

**Steps:**
1. Run discovery
2. Review "All Unique Codes" table
3. Identify codes not in our current validation suite
4. Research what these codes represent
5. Decide if validation scripts are needed

**Example New Codes:**
- 7IOT, OT/7I - 7th day overtime codes
- BONUS - Bonus pay
- HLDPY - Holiday pay

---

### **Use Case 3: Plan Multi-Group Validation**
**Goal:** Extend validation suite to support all 15 groups

**Steps:**
1. Run discovery for both DEV and STAGE
2. Identify which codes are common across most groups
3. Create generic validation scripts that work for any group
4. Update `environment-config.ts` to support all 15 groups
5. Add group selector to UI

---

## 🛠️ Technical Details

### **Script Location**
```
scripts/discover-earning-codes-all-groups.js
```

### **How It Works**
1. Loads authentication from `auth-state-dev.json` or `auth-state-stage.json`
2. Loops through all 15 groups
3. For each group:
   - Navigates to group URL
   - Finds first SUCCEEDED run
   - Clicks "Review Staged Earnings"
   - Extracts earning codes from table using regex pattern: `/^[A-Z0-9/]{3,10}$/`
4. Aggregates results and generates reports

### **Output Files**
- `earning-codes-discovery-dev.json` or `earning-codes-discovery-stage.json`
- `earning-codes-discovery-dev.md` or `earning-codes-discovery-stage.md`

### **Execution Time**
- **Per Group:** ~30-45 seconds
- **All 15 Groups:** ~8-12 minutes
- **Depends on:** Network speed, page load times, run availability

---

## 🚧 Limitations

1. **Requires SUCCEEDED runs**: If a group has no SUCCEEDED runs, it will be skipped
2. **Only scans most recent run**: Doesn't analyze historical trends
3. **Sample data only**: Shows hours/amounts from one run (not comprehensive)
4. **Manual interpretation**: Doesn't explain what each code means

---

## 🎯 Next Steps After Discovery

Once you have the discovery results:

1. **Analyze common codes** - Which codes appear in 10+ groups?
2. **Research new codes** - What do unfamiliar codes represent?
3. **Plan validation expansion** - Which groups should be validated next?
4. **Create generic scripts** - Modify SLFCAB scripts to work for any group
5. **Update documentation** - Add new codes to earning codes reference guide

---

**Status:** ✅ **Feature Complete and Ready to Use**

**Last Updated:** July 9, 2026
