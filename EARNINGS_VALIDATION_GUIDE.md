# 📊 Earnings Section Validation Guide
## people.stage.ashleyfurniture.com

This guide provides a comprehensive checklist for validating the earnings section in the staged environment.

---

## 🎯 Validation Objectives

1. Verify data accuracy
2. Ensure UI/UX consistency
3. Validate calculations
4. Test security and access controls
5. Confirm responsive design
6. Check accessibility compliance

---

## ✅ Manual Validation Checklist

### **1. Navigation & Access**
- [ ] Can navigate to earnings section from dashboard
- [ ] Earnings link/button is visible and clickable
- [ ] Page loads within acceptable time (< 3 seconds)
- [ ] URL is correct (https://people.stage.ashleyfurniture.com/earnings)
- [ ] Requires authentication (cannot access without login)

### **2. Current Pay Period**
- [ ] Current pay period dates are displayed
- [ ] Pay period is highlighted/indicated as current
- [ ] Pay date is visible and correct
- [ ] Check number (if applicable) is displayed
- [ ] Payment method is shown (Direct Deposit/Check)

### **3. Earnings Display**
- [ ] **Gross Pay** is displayed
- [ ] **Regular Hours** and rate shown
- [ ] **Overtime Hours** and rate shown (if applicable)
- [ ] **Holiday Pay** shown (if applicable)
- [ ] **PTO/Vacation Pay** shown (if applicable)
- [ ] **Bonuses** displayed (if applicable)
- [ ] **Commissions** displayed (if applicable)
- [ ] Currency format is correct ($X,XXX.XX)

### **4. Deductions**
- [ ] **Federal Tax** amount displayed
- [ ] **State Tax** amount displayed
- [ ] **FICA/Social Security** amount displayed
- [ ] **Medicare** amount displayed
- [ ] **401(k) Contribution** shown (if applicable)
- [ ] **Health Insurance** premium shown (if applicable)
- [ ] **Dental Insurance** premium shown (if applicable)
- [ ] **Vision Insurance** premium shown (if applicable)
- [ ] **Other Deductions** itemized
- [ ] **Total Deductions** calculated correctly

### **5. Net Pay**
- [ ] Net pay amount is displayed prominently
- [ ] Calculation is correct: Gross Pay - Total Deductions = Net Pay
- [ ] Format matches company standard
- [ ] Amount matches expectation

### **6. Year-to-Date (YTD) Totals**
- [ ] YTD Gross Earnings displayed
- [ ] YTD Federal Tax displayed
- [ ] YTD State Tax displayed
- [ ] YTD FICA displayed
- [ ] YTD Medicare displayed
- [ ] YTD Net Pay displayed
- [ ] YTD calculations are cumulative and accurate

### **7. Earnings History**
- [ ] Previous pay periods are listed
- [ ] Can view past pay stubs
- [ ] Can filter by date range
- [ ] Can sort by date
- [ ] Pagination works (if applicable)
- [ ] All historical data is accurate

### **8. Pay Stub Download**
- [ ] Download button/link is visible
- [ ] Clicking download generates PDF
- [ ] PDF contains all required information
- [ ] PDF is formatted correctly
- [ ] PDF filename includes date/check number
- [ ] Can download multiple pay stubs

### **9. UI/UX Validation**
- [ ] Layout is clean and organized
- [ ] Typography is readable
- [ ] Colors match brand guidelines
- [ ] Icons are appropriate and clear
- [ ] Spacing and alignment are consistent
- [ ] No overlapping elements
- [ ] No truncated text

### **10. Responsive Design**
- [ ] **Desktop** (1920x1080): Full layout displays correctly
- [ ] **Laptop** (1366x768): All elements visible and accessible
- [ ] **Tablet** (768x1024): Layout adapts appropriately
- [ ] **Mobile** (375x667): All information accessible, scrollable
- [ ] Touch targets are adequate size on mobile (min 44x44px)

### **11. Data Validation**
- [ ] Compare displayed amounts with payroll system
- [ ] Verify tax calculations match tax tables
- [ ] Cross-check deductions with benefits enrollment
- [ ] Validate hours worked against time tracking system
- [ ] Confirm overtime calculations (1.5x rate)

### **12. Security & Permissions**
- [ ] Cannot access without authentication
- [ ] Session timeout works correctly
- [ ] Cannot view other employees' earnings
- [ ] Sensitive data is masked when appropriate
- [ ] SSL certificate is valid
- [ ] No sensitive data in URL parameters

### **13. Error Handling**
- [ ] Graceful handling of network errors
- [ ] Clear error messages displayed
- [ ] Retry mechanism available
- [ ] No crashes or white screens
- [ ] Loading states are shown during data fetch

### **14. Accessibility (WCAG 2.1 AA)**
- [ ] All images have alt text
- [ ] Color contrast ratio meets standards (4.5:1)
- [ ] Can navigate with keyboard only
- [ ] Focus indicators are visible
- [ ] Screen reader announces all content correctly
- [ ] ARIA labels are present where needed
- [ ] Form fields have associated labels

### **15. Performance**
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth scrolling and interactions

---

## 🧪 Automated Testing

Run the Playwright test suite:

```bash
npx playwright test tests/earnings-validation.spec.ts
```

Run with UI:
```bash
npx playwright test tests/earnings-validation.spec.ts --ui
```

Run headed mode to watch:
```bash
npx playwright test tests/earnings-validation.spec.ts --headed
```

---

## 📝 Test Data Requirements

For comprehensive testing, you'll need:

1. **Test User Accounts**:
   - Regular employee (hourly)
   - Salaried employee
   - Employee with overtime
   - Employee with bonuses
   - New hire (< 1 year)
   - Employee with various benefits

2. **Expected Values**:
   - Known gross pay amounts
   - Known deduction amounts
   - Known YTD totals
   - Previous pay period data

---

## 🐛 Common Issues to Check

- [ ] Rounding errors in calculations
- [ ] Date format inconsistencies
- [ ] Timezone issues with pay dates
- [ ] Missing data for certain deduction types
- [ ] Incorrect tax withholding percentages
- [ ] Broken download links
- [ ] Slow API responses
- [ ] Cache issues showing stale data

---

## 📊 Validation Report Template

After validation, document findings:

**Date**: ____________  
**Tester**: ____________  
**Environment**: Stage  

| Item | Status | Notes |
|------|--------|-------|
| Navigation | ✅/❌ | |
| Data Accuracy | ✅/❌ | |
| Calculations | ✅/❌ | |
| Download | ✅/❌ | |
| Responsive | ✅/❌ | |
| Accessibility | ✅/❌ | |

**Critical Issues**: _______________  
**Minor Issues**: _______________  
**Recommendations**: _______________

---

## 🚀 Next Steps

1. Review this checklist
2. Gather test credentials
3. Prepare test data
4. Execute manual validation
5. Run automated tests
6. Document findings
7. Report issues
8. Verify fixes
