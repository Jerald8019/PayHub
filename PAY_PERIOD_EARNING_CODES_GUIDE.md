# 📅 Pay Period & Earning Codes Reference - User Guide

## 🎯 **Overview**

The enhanced **Earning Codes Reference** tab now shows which earning codes appear in which pay periods and calculation groups, with detailed information about employee counts and run IDs.

---

## ✨ **What's New**

### **Enhanced Features:**
1. **Pay Period Tracking** - See which pay periods contain each earning code
2. **Employee Counts** - Know how many employees used each code in each period
3. **Run IDs** - Link earning codes to specific calculation runs
4. **Expandable Details** - Click to see detailed pay period information
5. **New Filters** - Filter by pay period status (has periods vs no periods)

---

## 🚀 **How to Use**

### **Step 1: Load Earning Codes**
1. Go to http://localhost:3000
2. Click **"📋 Earning Codes"** tab
3. Click **"🔍 Load All Earning Codes"**

### **Step 2: View Pay Period Information**

#### **In the Main Table:**
The **"Pay Periods"** column shows:
- A button with a count (e.g., **"▼ 3"**) if the code appears in pay periods
- **"None"** if the code hasn't been used in any recent periods

#### **Expand for Details:**
1. Click the **▶** arrow in the first column OR
2. Click the **"▼ 3"** button in the Pay Periods column
3. See a detailed table showing:
   - Which calculation group
   - Specific pay period dates
   - Run ID
   - Number of employees with this code

### **Step 3: Filter by Pay Period Status**
Use the new **"Pay Period Status"** filter:
- **All Codes** - Show everything
- **📅 Has Pay Periods** - Only show codes that appear in recent runs
- **⚪ No Pay Periods** - Only show codes not yet used

---

## 📊 **Understanding the Pay Period Data**

### **Example: OVTPC Code**

When you expand OVTPC, you might see:

| Group | Pay Period | Run ID | Employees |
|-------|------------|--------|-----------|
| KWFHBW | 2026-PP12 - 02/22/2026 - 03/07/2026 | 84E5B2E3-... | 12 |
| KWFHBW | 2026-PP12 - 03/08/2026 - 03/21/2026 | 4BA9E883-... | 8 |
| AGRHBW | 2026-PP12 - 02/22/2026 - 03/07/2026 | D3E9F567-... | 15 |

**This tells you:**
- OVTPC appeared in **3 different runs**
- **2 runs** were for KWFHBW group
- **1 run** was for AGRHBW group
- Total of **35 employees** (12 + 8 + 15) had OVTPC earnings across these runs

---

## 💡 **Use Cases**

### **Use Case 1: Find Earning Codes in a Specific Pay Period**
**Question:** "What earning codes were used in KWFHBW for period 02/22/2026 - 03/07/2026?"

**Solution:**
1. Load earning codes
2. Filter by Group: "KWFHBW"
3. Filter by Pay Period Status: "📅 Has Pay Periods"
4. Expand each code to see if it appears in that period
5. View employee counts for planning verification

### **Use Case 2: Identify Active vs Inactive Codes**
**Question:** "Which earning codes are actively being used vs defined but not used?"

**Solution:**
1. Load earning codes
2. Filter by Pay Period Status: "📅 Has Pay Periods" → See active codes
3. Change to "⚪ No Pay Periods" → See inactive/unused codes
4. Helps identify codes that might be legacy or seasonal

### **Use Case 3: Plan Verification Workload**
**Question:** "How many employees have OVTPC that I need to verify?"

**Solution:**
1. Search for "OVTPC"
2. Expand to see pay periods
3. Add up employee counts across all periods
4. Plan verification schedule based on volume

### **Use Case 4: Track Code Usage Across Groups**
**Question:** "Is COMM code used in all calculation groups or just some?"

**Solution:**
1. Search for "COMM"
2. Look at "Groups" column → See which groups have it configured
3. Expand to see "Pay Periods" → See which groups actually used it recently
4. Identify discrepancies between configured and actual usage

---

## 🔍 **Detailed Column Descriptions**

### **Main Table Columns:**

| Column | Description | Example |
|--------|-------------|---------|
| **Expand Arrow** | Click to show/hide pay period details | ▶ / ▼ |
| **Code** | Earning code identifier | OVTPC, COMM |
| **Description** | What the code represents | "Overtime Premium Calculation" |
| **Type** | Category of earning | Premium, Regular, Commission, Bonus |
| **Groups** | All groups where code is configured | KWFHBW, AGRHBW, SWFHBW |
| **Pay Periods** | Count of periods with this code | "▼ 3" or "None" |
| **Formula Validation** | Can be auto-verified | ✅ Yes / ⚠️ No |
| **Formulas Checked** | Which calculations are verified | Average Rate, Half Rate, Daily |

### **Expanded Pay Period Columns:**

| Column | Description | Example |
|--------|-------------|---------|
| **Group** | Which calculation group | KWFHBW |
| **Pay Period** | Specific pay period dates | 2026-PP12 - 02/22/2026 - 03/07/2026 |
| **Run ID** | Unique identifier for the run | 84E5B2E3-26a6... |
| **Employees** | Count of employees with this code | 12 |

---

## 🎨 **Visual Indicators**

### **Pay Period Button Colors:**
- **🔵 Blue "▼ 3"** - Code appears in 3 pay periods (clickable)
- **⚪ Gray "None"** - Code not in any recent periods

### **Expand Arrow:**
- **▶ Right Arrow** - Details hidden (click to expand)
- **▼ Down Arrow** - Details shown (click to collapse)

---

## 📈 **Practical Examples**

### **Example 1: Verifying OVTPC for a Specific Run**

1. **Load earning codes** → Click "🔍 Load All Earning Codes"
2. **Search for OVTPC** → Type "OVTPC" in search box
3. **Expand details** → Click ▶ arrow
4. **Find your run**:
   ```
   KWFHBW | 2026-PP12 - 02/22/2026 - 03/07/2026 | 84E5B2E3-... | 12 employees
   ```
5. **Go to Verify Calculations tab** → Select this run
6. **Click "Verify All"** → Verify all 12 employees

### **Example 2: Auditing Code Usage**

1. **Filter by Group** → Select "KWFHBW"
2. **Filter by Status** → "📅 Has Pay Periods"
3. **Review the list** → See which codes were actually used
4. **Compare to policy** → Ensure expected codes are present
5. **Investigate anomalies** → Codes that should/shouldn't appear

---

## 🔄 **Filtering Combinations**

### **Most Active Codes:**
```
Filter by: Pay Period Status = "📅 Has Pay Periods"
```
Shows only codes that appear in recent runs

### **Verifiable Active Codes:**
```
Filter by: Type = "✅ Verifiable" AND Pay Period Status = "📅 Has Pay Periods"
```
Shows codes you can verify that are actively being used

### **Group-Specific Usage:**
```
Filter by: Group = "KWFHBW" AND Pay Period Status = "📅 Has Pay Periods"
```
Shows which codes are actively used in a specific group

### **Unused Configured Codes:**
```
Filter by: Pay Period Status = "⚪ No Pay Periods"
```
Shows codes that are configured but haven't appeared in recent runs

---

## ❓ **FAQ**

**Q: Why do some codes show "None" for pay periods?**  
A: Either the code hasn't been used in recent runs, or it's a newly configured code that will appear in future runs.

**Q: How far back does the pay period data go?**  
A: Currently showing recent runs. In production, this can be configured to show last N periods or date range.

**Q: Can I see historical trends?**  
A: In this version, you see snapshot of recent runs. Future enhancement could add time-series charts.

**Q: What if employee count seems wrong?**  
A: The count shows unique employees with this earning code in that specific run. One employee might have the code multiple times (different dates) but counts as 1.

**Q: Can I export this data?**  
A: Future enhancement. Currently, you can copy from the table or take screenshots.

---

**Created**: June 2026  
**Feature**: Pay Period & Earning Codes Tracking  
**Status**: ✅ Enhanced with pay period details  
