# ⭐ Critical API Outputs Validation

## 🎯 5 Most Important Response Fields

The API tests now focus on validating the **5 critical outputs** from the Adjustment Microservice:

---

## 📊 Critical Output Fields

### **1. Total Surcharge** 💰
**Field:** `orders[0].total_surcharge`  
**Type:** `number`  
**Description:** The total surcharge amount calculated for the entire order

```json
{
  "orders": [{
    "total_surcharge": 1.00
  }]
}
```

**Validation:**
```typescript
expect(order.total_surcharge).toBeDefined();
expect(typeof order.total_surcharge).toBe('number');
```

---

### **2. Credit Code** 🏷️
**Field:** `orders[0].adjustments[0].adjustment_details[0].credit_code`  
**Type:** `string`  
**Description:** The surcharge/credit code identifier (e.g., "SSC")

```json
{
  "credit_code": "SSC"
}
```

**Validation:**
```typescript
expect(detail.credit_code).toBeDefined();
expect(typeof detail.credit_code).toBe('string');
expect(detail.credit_code).toBeTruthy();
```

**Common Values:**
- `SSC` - Import Surcharge
- `GAC` - Global Adjustment Credit
- `MSC` - Miscellaneous Surcharge

---

### **3. Adjustment Name** 📝
**Field:** `orders[0].adjustments[0].adjustment_details[0].adjustment_name`  
**Type:** `string`  
**Description:** Full descriptive name of the adjustment

```json
{
  "adjustment_name": "SSC IMPORT SURCHARGE SALES"
}
```

**Validation:**
```typescript
expect(detail.adjustment_name).toBeDefined();
expect(typeof detail.adjustment_name).toBe('string');
expect(detail.adjustment_name).toBeTruthy();
```

---

### **4. Adjustment Amount** 💰
**Field:** `orders[0].adjustments[0].adjustment_details[0].adjustment_amount`  
**Type:** `number`  
**Description:** The calculated dollar amount for this specific adjustment

```json
{
  "adjustment_amount": 1.00
}
```

**Validation:**
```typescript
expect(detail.adjustment_amount).toBeDefined();
expect(typeof detail.adjustment_amount).toBe('number');
```

**Calculation Example:**
```
Item Price: $100.00
Quantity: 1
Calculation Type: PERCENT
Calculation Value: 3.0000

Adjustment Amount = (100 * 1 * 3.0000) / 100 = $3.00
```

---

### **5. Calculation Value** 🔢
**Field:** `orders[0].adjustments[0].adjustment_details[0].calculation_value`  
**Type:** `number`  
**Description:** The percentage or fixed value used in the calculation

```json
{
  "calculation_value": 3.0000,
  "calculation_type": "PERCENT"
}
```

**Validation:**
```typescript
expect(detail.calculation_value).toBeDefined();
expect(typeof detail.calculation_value).toBe('number');
```

**Examples:**
- `3.0000` for 3% surcharge
- `5.0000` for 5% credit
- `10.00` for $10 fixed amount

---

## ✅ Test Output Example

```
📤 Testing: Customer 700, Ship-to 01, Item 1067010

✅ KEY OUTPUTS:
   📊 Total Surcharge: $1.00
   🏷️  Credit Code: SSC
   📝 Adjustment Name: SSC IMPORT SURCHARGE SALES
   💰 Adjustment Amount: $1.00
   🔢 Calculation Value: 3.0000%

✅ Test passed for Customer 700, Ship-to 01, Item 1067010
```

---

## 📊 Multiple Items Example

```
✅ KEY OUTPUTS (Multiple Items):
   📊 Total Surcharge: $6.50
   📦 Total Items: 3

   Item 1 (1067010):
     🏷️  Credit Code: SSC
     📝 Adjustment Name: SSC IMPORT SURCHARGE SALES
     💰 Adjustment Amount: $3.00
     🔢 Calculation Value: 3.0000

   Item 2 (B100-11):
     🏷️  Credit Code: GAC
     📝 Adjustment Name: GLOBAL ADJUSTMENT CREDIT
     💰 Adjustment Amount: $2.25
     🔢 Calculation Value: 1.5000

   Item 3 (B100-12):
     🏷️  Credit Code: MSC
     📝 Adjustment Name: MISC SURCHARGE
     💰 Adjustment Amount: $1.25
     🔢 Calculation Value: 0.625
```

---

## 🎯 Validation Summary

| Field | Validation | Data Type | Required |
|-------|------------|-----------|----------|
| **Total Surcharge** | ✅ Exists, Number | `number` | ✅ Yes |
| **Credit Code** | ✅ Exists, String, Non-empty | `string` | ✅ Yes |
| **Adjustment Name** | ✅ Exists, String, Non-empty | `string` | ✅ Yes |
| **Adjustment Amount** | ✅ Exists, Number | `number` | ✅ Yes |
| **Calculation Value** | ✅ Exists, Number | `number` | ✅ Yes |

---

## 🧪 Test Files Updated

### **1. Main Test Suite**
**File:** `tests/api/adjustment-orders.spec.ts`

✅ All 4 data-driven tests validate 5 critical outputs  
✅ Multiple items test shows all adjustments  
✅ Multiple orders test shows all order totals  

### **2. CSV Data-Driven Tests**
**File:** `tests/api/adjustment-orders-csv.spec.ts`

✅ All CSV tests validate 5 critical outputs  
✅ Clean output focused on key fields  

---

## 🚀 Running Focused Tests

```bash
# Run all tests and see critical outputs
npx playwright test tests/api/ --reporter=line

# Run single test to see detailed output
npx playwright test tests/api/adjustment-orders.spec.ts -g "Customer 700" --reporter=line

# Run CSV tests
npx playwright test tests/api/adjustment-orders-csv.spec.ts --reporter=line
```

---

## 💡 Business Value

These 5 fields provide:

1. **Total Surcharge** → Overall financial impact per order
2. **Credit Code** → Classification for accounting/reporting
3. **Adjustment Name** → Human-readable description for invoices
4. **Adjustment Amount** → Item-level financial impact
5. **Calculation Value** → Transparency into how charges are calculated

---

## 📈 Reporting

Each test run generates clear output showing:
- ✅ All 5 critical fields are present
- ✅ Data types are correct
- ✅ Values are non-null/non-empty
- ✅ Calculations can be verified

---

**Example Test Report:**

```
Test Results: 22 tests passed

Critical Outputs Validated:
  ✅ Total Surcharge: 22/22 tests
  ✅ Credit Code: 22/22 tests
  ✅ Adjustment Name: 22/22 tests
  ✅ Adjustment Amount: 22/22 tests
  ✅ Calculation Value: 22/22 tests

All critical fields validated successfully! 🎉
```

---

**Your tests now focus on the 5 most important outputs! ⭐**

