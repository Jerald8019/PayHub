# 📋 API Response Structure & Validation

## 🎯 Expected Response Format

The Adjustment Microservice returns a detailed response with surcharge calculations and adjustment details.

---

## 📦 Response Structure

```json
{
  "orders": [
    {
      "order_id": "123",
      "customer_id": 700,
      "ship_to": "01",
      "total_surcharge": 1.00,
      "adjustments": [
        {
          "item_id": "1067008",
          "quantity": 1,
          "price": 100,
          "status": "2",
          "adjustment_details": [
            {
              "credit_code": "SSC",
              "adjustment_name": "SSC IMPORT SURCHARGE SALES",
              "adjustment_amount": 1.00,
              "invoice_level": "1",
              "taxable": "N",
              "commissionable": "N",
              "calculation_value": 3.0000,
              "calculation_type": "PERCENT",
              "applied_level": "ITEMCLASS",
              "applied_level_value": "ZVUC",
              "charge": true,
              "quantity": 1,
              "price": 100.00
            }
          ]
        }
      ]
    }
  ]
}
```

---

## ✅ Response Field Definitions

### **Order Level Fields**

| Field | Type | Description |
|-------|------|-------------|
| `order_id` | String | Unique order identifier |
| `customer_id` | Number | Customer account number |
| `ship_to` | String | Ship-to location code |
| `total_surcharge` | Number | Total surcharge amount for the order |
| `adjustments` | Array | List of item adjustments |

### **Adjustment Level Fields**

| Field | Type | Description |
|-------|------|-------------|
| `item_id` | String | Item/SKU identifier |
| `quantity` | Number | Quantity of items |
| `price` | Number | Item price |
| `status` | String | Adjustment status code |
| `adjustment_details` | Array | Detailed adjustment calculations |

### **Adjustment Details Fields**

| Field | Type | Description |
|-------|------|-------------|
| `credit_code` | String | Credit/surcharge code (e.g., "SSC") |
| `adjustment_name` | String | Full name of the adjustment |
| `adjustment_amount` | Number | Calculated adjustment amount |
| `invoice_level` | String | Invoice level indicator |
| `taxable` | String | "Y" or "N" - Is adjustment taxable? |
| `commissionable` | String | "Y" or "N" - Is adjustment commissionable? |
| `calculation_value` | Number | Value used in calculation (e.g., 3.0000) |
| `calculation_type` | String | Type of calculation (e.g., "PERCENT") |
| `applied_level` | String | Level at which adjustment is applied |
| `applied_level_value` | String | Specific value for applied level |
| `charge` | Boolean | true = charge, false = credit |
| `quantity` | Number | Quantity for this adjustment |
| `price` | Number | Price for this adjustment |

---

## 🔍 Test Validations

### **1. Structure Validation**

All tests now validate:
```typescript
// Top-level structure
expect(responseBody).toHaveProperty('orders');
expect(Array.isArray(responseBody.orders)).toBe(true);

// Order-level fields
expect(firstOrder).toHaveProperty('order_id');
expect(firstOrder).toHaveProperty('customer_id');
expect(firstOrder).toHaveProperty('ship_to');
expect(firstOrder).toHaveProperty('total_surcharge');
expect(firstOrder).toHaveProperty('adjustments');

// Adjustment fields
expect(adjustment).toHaveProperty('item_id');
expect(adjustment).toHaveProperty('status');
expect(adjustment).toHaveProperty('adjustment_details');

// Adjustment detail fields
expect(detail).toHaveProperty('credit_code');
expect(detail).toHaveProperty('adjustment_name');
expect(detail).toHaveProperty('adjustment_amount');
expect(detail).toHaveProperty('calculation_type');
expect(detail).toHaveProperty('calculation_value');
```

### **2. Data Type Validation**

```typescript
expect(typeof firstOrder.total_surcharge).toBe('number');
expect(typeof detail.adjustment_amount).toBe('number');
expect(typeof detail.charge).toBe('boolean');
expect(Array.isArray(firstOrder.adjustments)).toBe(true);
```

### **3. Business Logic Validation**

```typescript
// Total surcharge should be non-negative
expect(firstOrder.total_surcharge).toBeGreaterThanOrEqual(0);

// Adjustment amount should match calculation
// If PERCENT: amount = (price * quantity * calculation_value) / 100
const expectedAmount = (detail.price * detail.quantity * detail.calculation_value) / 100;
expect(detail.adjustment_amount).toBeCloseTo(expectedAmount, 2);
```

---

## 📊 Example Test Output

```
📤 Testing: Customer 700, Ship-to 01, Item 1067010
Request Body: {...}
📥 Response Status: 200

📊 Adjustment Details:
   Credit Code: SSC
   Adjustment Name: SSC IMPORT SURCHARGE SALES
   Adjustment Amount: $1.00
   Calculation Type: PERCENT
   Calculation Value: 3.0000
   Applied Level: ITEMCLASS (ZVUC)

✅ Test passed for Customer 700, Ship-to 01, Item 1067010
```

---

## 🎯 Calculation Examples

### **Percentage Calculation**
```
Item Price: $100.00
Quantity: 1
Calculation Type: PERCENT
Calculation Value: 3.0000

Adjustment Amount = (100.00 * 1 * 3.0000) / 100 = $3.00
```

### **Fixed Amount**
```
Calculation Type: FIXED
Calculation Value: 5.00

Adjustment Amount = $5.00 (per item or order, depending on applied_level)
```

---

## 🧪 Updated Test Files

### **1. Main Test Suite**
`tests/api/adjustment-orders.spec.ts`
- ✅ Full response structure validation
- ✅ Adjustment details validation
- ✅ Detailed console logging

### **2. CSV Data-Driven Tests**
`tests/api/adjustment-orders-csv.spec.ts`
- ✅ Response structure validation
- ✅ Total surcharge logging

### **3. Negative Tests**
`tests/api/adjustment-orders-negative.spec.ts`
- ✅ Error response validation
- ✅ Status code checks

---

## 🚀 Running Tests

```bash
# Run all API tests with detailed output
npx playwright test tests/api/ --reporter=line

# Run specific test to see response structure
npx playwright test tests/api/adjustment-orders.spec.ts -g "Customer 700"

# Generate HTML report
npx playwright test tests/api/ --reporter=html
npx playwright show-report
```

---

## 💡 Tips

1. **Response Logging**: All tests log the full response for debugging
2. **Flexible Validations**: Tests check if fields exist before validating details
3. **Array Handling**: Tests safely handle empty adjustment arrays
4. **Type Safety**: All validations check data types match expected format

---

**Your tests now validate the complete response structure! 🎉**

