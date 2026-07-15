# 🚀 Adjustment Microservice - API Testing Guide

## ✅ What Was Created

I've generated a complete API test suite for your Adjustment Microservice with multiple testing approaches!

---

## 📦 Generated Test Files

### **1. Main Test Suite** 
`tests/api/adjustment-orders.spec.ts`
- ✅ Data-driven tests with 4 different customer/item combinations
- ✅ Multiple items in single order
- ✅ Multiple orders in single request
- ✅ Performance/response time validation

### **2. Negative Test Cases**
`tests/api/adjustment-orders-negative.spec.ts`
- ✅ Invalid customer ID
- ✅ Missing required fields
- ✅ Empty items array
- ✅ Negative prices
- ✅ Invalid date formats

### **3. CSV Data-Driven Tests**
`tests/api/adjustment-orders-csv.spec.ts`
- ✅ Reads test data from CSV file
- ✅ Runs tests dynamically
- ✅ Easy to add more test cases

### **4. Test Data File**
`tests/api/test-data.csv`
- 10 test cases including happy paths and error cases
- Easy to edit in Excel or any text editor

---

## 🎯 Test Coverage

| Test Type | Count | Description |
|-----------|-------|-------------|
| Happy Path | 4 | Valid customer/item combinations |
| Multiple Items | 1 | Single order with multiple items |
| Multiple Orders | 1 | Batch order processing |
| Performance | 1 | Response time validation |
| Negative Cases | 5 | Error handling validation |
| CSV-Driven | 10 | Dynamic tests from CSV |
| **TOTAL** | **22** | **Complete coverage** |

---

## 🚀 Running the Tests

### **Run All API Tests**
```bash
npx playwright test tests/api/
```

### **Run Specific Test File**
```bash
# Main test suite
npx playwright test tests/api/adjustment-orders.spec.ts

# Negative tests
npx playwright test tests/api/adjustment-orders-negative.spec.ts

# CSV data-driven tests
npx playwright test tests/api/adjustment-orders-csv.spec.ts
```

### **Run with Different Options**
```bash
# Show detailed output
npx playwright test tests/api/ --reporter=line

# Run in headed mode (see browser)
npx playwright test tests/api/ --headed

# Run specific test by name
npx playwright test tests/api/ -g "Customer 700"

# Generate HTML report
npx playwright test tests/api/ --reporter=html
npx playwright show-report
```

---

## 📊 Test Data Combinations

### **Customer IDs Tested:**
- `700` - Standard customer
- `213700` - Large customer
- `2575700` - Enterprise customer
- `109200` - Regional customer

### **Ship-To Locations:**
- `01`, `03`, `10`

### **Item IDs:**
- `1067010` - Numeric item
- `B100-11`, `B100-12`, `B100-13` - Alphanumeric items

---

## 💡 Adding More Test Cases

### **Option 1: Edit the Test File**

Add to the `TEST_DATA` array in `adjustment-orders.spec.ts`:

```typescript
{
  testCase: 'Your Test Description',
  customerId: 999999,
  shipTo: '05',
  itemId: 'NEW-ITEM',
  expectedStatus: 200
}
```

### **Option 2: Add to CSV File**

Simply add a new row to `test-data.csv`:

```csv
New_Test,999999,05,NEW-ITEM,1,100,200,My new test case
```

---

## 🔐 Adding Authentication

If your API requires authentication, update the headers:

```typescript
const response = await request.post(`${BASE_URL}${ENDPOINT}`, {
  data: requestBody,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'X-API-Key': 'YOUR_API_KEY'
  }
});
```

### **Using Environment Variables:**

1. Add to `.env`:
```
API_TOKEN=your_token_here
API_KEY=your_api_key
```

2. Use in tests:
```typescript
headers: {
  'Authorization': `Bearer ${process.env.API_TOKEN}`,
  'X-API-Key': process.env.API_KEY
}
```

---

## 📈 Response Validation

### **Current Validations:**
- ✅ Status code
- ✅ Response time
- ✅ Response body exists

### **Add More Validations:**

```typescript
const responseBody = await response.json();

// Validate specific fields
expect(responseBody.orderId).toBe(orderId);
expect(responseBody.success).toBe(true);
expect(responseBody.totalAmount).toBeGreaterThan(0);

// Validate structure
expect(responseBody).toHaveProperty('orderId');
expect(responseBody).toHaveProperty('status');
expect(responseBody.items).toBeInstanceOf(Array);

// Validate array length
expect(responseBody.items.length).toBe(1);

// Validate nested properties
expect(responseBody.items[0].itemId).toBe('1067010');
expect(responseBody.items[0].adjustedPrice).toBeGreaterThanOrEqual(100);
```

---

## 🎨 Example Test Output

```
📤 Testing: Customer 700, Ship-to 01, Item 1067010
Request Body: {
  "orders": [
    {
      "order_id": "TEST_1234567890_700",
      "customer_id": 700,
      ...
    }
  ]
}
📥 Response Status: 200
Response Body: { ... }
✅ Test passed for Customer 700, Ship-to 01, Item 1067010
```

---

## 🐛 Troubleshooting

### **Issue: Tests failing with network errors**
**Solution:** Check if the API endpoint is accessible
```bash
curl -X POST https://adjustment-microservice.stage.finance.ashleyfurniture.com/Adjustment/Orders
```

### **Issue: 401 Unauthorized**
**Solution:** Add authentication headers (see Authentication section)

### **Issue: CSV file not found**
**Solution:** Ensure `test-data.csv` is in `tests/api/` folder

### **Issue: Tests timing out**
**Solution:** Increase timeout
```typescript
test.setTimeout(60000); // 60 seconds
```

---

## 📚 Next Steps

1. ✅ Run the tests: `npx playwright test tests/api/`
2. ✅ Review the output
3. ✅ Add authentication if needed
4. ✅ Customize test data in CSV file
5. ✅ Add more validations based on actual responses
6. ✅ Integrate with CI/CD pipeline

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Run all API tests
npx playwright test tests/api/

# Run with verbose output
npx playwright test tests/api/ --reporter=line

# Run specific file
npx playwright test adjustment-orders.spec.ts

# Generate HTML report
npx playwright test tests/api/ --reporter=html
npx playwright show-report

# Run tests matching pattern
npx playwright test -g "Customer 700"
```

---

**Your API tests are ready to run! 🎉**

