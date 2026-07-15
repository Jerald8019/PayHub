# 📊 Calculation Verification UI - Quick Guide

## 🎯 **Overview**

The PayHub Automation Suite now includes a **Calculation Verification** feature that automatically verifies overtime premium calculations for accuracy and detects rounding issues!

---

## ✅ **What It Does**

The verification tool automatically:

1. ✅ **Logs into PayHub** using your credentials
2. ✅ **Navigates to the employee page** for the specified pay period
3. ✅ **Finds OVTPC rows** (Overtime Premium Calculation earnings)
4. ✅ **Expands calculation sections** automatically
5. ✅ **Extracts all formulas:**
   - Total Earnings / Total Hours = Average Rate
   - Average Rate ÷ 2 = Half Rate
   - Hours × Half Rate = Amount (for each day)
6. ✅ **Verifies mathematical accuracy** of all calculations
7. ✅ **Checks for rounding issues** (precision to 2 decimals)
8. ✅ **Generates detailed report** with pass/fail results

---

## 🚀 **How to Use the UI**

### **Step 1: Start the Server**

```powershell
npm run ui
```

### **Step 2: Open Your Browser**

Navigate to: **http://localhost:3000**

### **Step 3: Switch to Verification Tab**

Click on the **📊 Verify Calculations** tab

### **Step 4: Fill in the Form**

| Field | Description | Example |
|-------|-------------|---------|
| **Environment** | Dev or Stage | Stage |
| **Group Name** | Select from dropdown | KWFHBW - Pay Process |
| **Pay Period Start Date** | Start date of pay period | 02/22/2026 |
| **Employee ID** | Employee to verify | 071298 |

### **Step 5: Click "Verify Calculations"**

The automation will run in a browser window and show you:
- Login progress
- Navigation steps
- OVTPC row detection
- Formula extraction
- Verification results

---

## 📊 **Understanding the Results**

### **✅ Success Output Example:**

```
✅ Average Hourly Rate Calculation
   Total Earnings: $5808.36
   Total Hours: 43.28
   Average Rate: $134.19
   Calculated: $134.20
   ✅ PASS

✅ Half-Rate Calculation
   Base Rate: $134.19
   Half Rate (shown): $67.10
   Half Rate (calculated): $67.09
   ✅ PASS

✅ Daily Breakdown Verification
   Row 1: 03/07/2026
   67.10 hours × $3.28 = $220.31
   Displayed amount: $220.31
   ✅ PASS

════════════════════════════════════════
📊 VERIFICATION COMPLETE
════════════════════════════════════════
Verified 1 daily calculation row(s)
✅ ALL CALCULATIONS VERIFIED SUCCESSFULLY!
```

### **⚠️ Rounding Issues:**

If the verification detects rounding differences:

```
❌ FAIL: Expected $134.20, got $134.19
🔍 Rounding difference: $0.01
```

**This is usually normal** - it indicates a 1-cent difference due to rounding at different stages of calculation.

---

## 📋 **Prerequisites**

### **Required for Verification:**

1. ✅ **Run Status**: Must be **"Awaiting Approval"** or **"AwaitingPostAction"**
2. ✅ **Employee Earnings**: Employee must have **OVTPC** (Overtime Premium Calculation) earnings
3. ✅ **Credentials**: Valid PayHub login credentials in `.env` file

---

## 🎯 **What Gets Verified**

### **1. Average Hourly Rate**

Formula: `Total Earnings ÷ Total Hours = Average Rate`

Example:
```
$5,808.36 ÷ 43.28 hours = $134.19/hour
```

### **2. Half-Rate Calculation**

Formula: `Average Rate ÷ 2 = Half Rate`

Example:
```
$134.19 ÷ 2 = $67.10 (Half Rate)
```

### **3. Daily Breakdown**

Formula (for each day): `Hours × Half Rate = Amount`

Example:
```
Day 1: 3.28 hours × $67.10 = $220.09
Day 2: 1.52 hours × $67.10 = $102.00
... (for all overtime days)
```

---

## ⏱️ **Time Savings**

### **Manual Verification:**
- Open employee page: 1-2 min
- Expand sections manually: 30 sec
- Calculate formulas with calculator: 5-10 min
- Check each day individually: 10-15 min
- **Total: 15-30 minutes per employee**

### **Automated Verification:**
- **Total: 1-2 minutes per employee**
- **Savings: 85-93%**

---

## 🔧 **Troubleshooting**

### **Problem: "No OVTPC rows found"**

**Solution:**
- Employee doesn't have overtime premium earnings
- Try a different employee who worked overtime

### **Problem: "Overtime Premium Calculation Breakdown not visible"**

**Solution:**
- Run status might not be "Awaiting Approval"
- Check run status in PayHub first

### **Problem: "Login failed"**

**Solution:**
- Check `.env` file has correct credentials
- Verify credentials work in PayHub manually

---

## 📚 **Related Documentation**

- **README.md** - Project overview
- **CALCULATION_VERIFICATION_GUIDE.md** - Detailed manual verification steps
- **TECHNICAL_REFERENCE.md** - Code structure and technical details

---

**Created**: June 11, 2026  
**Last Updated**: June 11, 2026  
**Version**: 1.0  
