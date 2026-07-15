# 📋 Earning Codes Reference - User Guide

## 🎯 **Overview**

The **Earning Codes Reference** tab provides a comprehensive view of all earning codes used across all calculation groups, showing which codes have automated formula validation available.

---

## ✨ **What This Shows**

### **For Each Earning Code:**
- **Code**: The earning code identifier (e.g., OVTPC, COMM, WRKHR)
- **Description**: What the code means
- **Type**: Premium, Regular, Commission, Bonus
- **Groups**: Which calculation groups use this code
- **Formula Validation**: Whether automated verification is available
- **Formulas Checked**: Which formulas are validated for this code

---

## 🚀 **How to Use**

### **Step 1: Open the Tab**
1. Go to http://localhost:3000
2. Click **"📋 Earning Codes"** tab

### **Step 2: Load Earning Codes**
1. Click **"🔍 Load All Earning Codes"**
2. Wait a few seconds while data loads

### **Step 3: Review the Table**
You'll see a comprehensive table showing:
- All earning codes across all calculation groups
- Color-coded badges for each type
- Verification status (✅ Yes or ⚠️ No)
- List of formulas checked for verifiable codes

### **Step 4: Filter the Data**
Use the filters to narrow down:
- **Filter by Group**: Show codes for a specific group (e.g., KWFHBW)
- **Filter by Type**: Show only verifiable or not verifiable codes
- **Search**: Type to search by code or description

---

## 📊 **Understanding the Data**

### **Earning Code Types:**

| Type | Description | Examples |
|------|-------------|----------|
| **Premium** 🟠 | Overtime, shift differential, holiday pay | OVTPC, OT/7I, HLDPY |
| **Regular** 🔵 | Standard hourly wages, vacation, sick pay | WRKHR, VACAO, SICKP |
| **Commission** 🟣 | Sales commissions | COMM |
| **Bonus** 🟢 | Performance bonuses | BONUS |

### **Validation Status:**

| Badge | Meaning |
|-------|---------|
| **✅ Yes** (Green) | Automated formula validation available |
| **⚠️ No** (Yellow) | No automated validation (yet) |

---

## 🔍 **Verifiable Codes (Currently Automated)**

### **OVTPC - Overtime Premium Calculation**
- **Used in**: KWFHBW, AGRHBW, SWFHBW, RLFHBW
- **Formulas Checked**:
  1. Total Earnings ÷ Total Hours = Average Rate
  2. Average Rate ÷ 2 = Half Rate
  3. Hours × Half Rate = Amount (Daily)

### **OT/7I - 7th Day / In-Week Overtime**
- **Used in**: KWFHBW, SWFHBW, ECMHBW
- **Formulas Checked**:
  1. Total Earnings ÷ Total Hours = Average Rate
  2. Average Rate ÷ 2 = Half Rate
  3. Hours × Half Rate = Amount (Daily)

### **7I OT - 7th Day In-Week Overtime**
- **Used in**: KWFHBW, AGRHBW
- **Formulas Checked**:
  1. Total Earnings ÷ Total Hours = Average Rate
  2. Average Rate ÷ 2 = Half Rate

---

## 📈 **Summary Statistics**

At the bottom of the page, you'll see:

- **Verifiable Codes**: How many codes have automated validation
- **Not Verifiable**: How many codes don't have validation yet
- **Calculation Groups**: Total number of groups covered
- **Total Earning Codes**: Total codes in the system

---

## 💡 **Use Cases**

### **Use Case 1: Planning Verification**
"Which earning codes can I verify automatically?"

**Solution:**
1. Go to Earning Codes tab
2. Filter by Type: "✅ Verifiable"
3. See all codes with formula validation
4. Plan your verification runs accordingly

### **Use Case 2: Group-Specific Research**
"What earning codes does KWFHBW use?"

**Solution:**
1. Load earning codes
2. Filter by Group: "KWFHBW"
3. See all codes used by that group
4. Identify which can be verified

### **Use Case 3: Finding Similar Codes**
"Are there other overtime codes like OVTPC?"

**Solution:**
1. Search for "overtime"
2. See all related codes
3. Check which ones are verifiable
4. Plan to add validation for others

---

## 🔄 **Refreshing Data**

After loading earning codes once, you can:
- Click **"🔄 Refresh"** to reload the latest data
- Filters remain applied after refresh

---

## 🎨 **Visual Guide**

### **Color Coding:**

**Type Badges:**
- 🟠 **Orange** = Premium (overtime, holiday, shift)
- 🔵 **Blue** = Regular (hourly, vacation, sick)
- 🟣 **Purple** = Commission
- 🟢 **Green** = Bonus

**Group Badges:**
- Gray chips showing which groups use each code

**Validation Badges:**
- 🟢 **Green "✅ Yes"** = Has automated validation
- 🟡 **Yellow "⚠️ No"** = Not yet automated

---

## 🚀 **Future Enhancements**

Planned features:
- ⏳ Add more earning codes to automated validation
- ⏳ Show sample calculations for each code
- ⏳ Export to Excel/CSV
- ⏳ Historical changes tracking
- ⏳ Add validation rules documentation

---

## 📝 **Example: Reading the Table**

```
Code: OVTPC
Description: Overtime Premium Calculation
Type: Premium (orange badge)
Groups: KWFHBW, AGRHBW, SWFHBW, RLFHBW (gray chips)
Formula Validation: ✅ Yes (green badge)
Formulas Checked:
  • Total Earnings ÷ Total Hours = Average Rate
  • Average Rate ÷ 2 = Half Rate
  • Hours × Half Rate = Amount (Daily)
```

This tells you:
- OVTPC is an overtime premium code
- It's used in 4 calculation groups
- It HAS automated verification
- 3 formulas are checked when you verify

---

## ❓ **FAQ**

**Q: Why are some codes not verifiable?**  
A: Not all earning codes have complex formulas that need validation. Regular hourly pay (WRKHR) is straightforward multiplication, while overtime premiums (OVTPC) have multi-step calculations that benefit from automated checking.

**Q: Can I request validation for a specific code?**  
A: Yes! If you need a code to be verifiable, note which code and what formulas should be checked.

**Q: How often is this data updated?**  
A: Currently using mock data for demonstration. In production, this would query live PayHub data.

**Q: Can I verify codes that show "⚠️ No"?**  
A: Not automatically. Those would need manual verification or we can add automated validation for them.

---

**Created**: June 11, 2026  
**Feature**: Earning Codes Reference  
**Status**: ✅ Functional with sample data  
