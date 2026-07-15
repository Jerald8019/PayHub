# 🚀 Group Run Automation - Quick Reference

## ⚡ Quick Commands

### Find Group IDs
```bash
# Discover all your groups and their IDs
npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover"
```

### Test Single Group
```bash
# Test with KWFHBW group (visual)
npx playwright test start-group-runs.spec.ts -g "single" --headed
```

### Run All Groups
```bash
# Run all configured groups
npx playwright test start-group-runs.spec.ts -g "all"

# With UI
npx playwright test start-group-runs.spec.ts -g "all" --ui
```

---

## 📝 Setup Checklist

- [ ] **Step 1:** Find group IDs
  ```bash
  npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover"
  ```

- [ ] **Step 2:** Update `tests/group-run-config.ts`
  ```typescript
  {
    groupName: 'YOUR_GROUP',
    groupId: 'your-id',      // ← From step 1
    payPeriodStart: '10/07/2026',
    payPeriodEnd: '10/07/2026',
    enabled: true
  }
  ```

- [ ] **Step 3:** Test one group
  ```bash
  npx playwright test start-group-runs.spec.ts -g "single" --headed
  ```

- [ ] **Step 4:** Run all groups
  ```bash
  npx playwright test start-group-runs.spec.ts -g "all"
  ```

- [ ] **Step 5:** Check results
  ```bash
  cat test-results/group-runs-*.csv
  ```

---

## 🔍 Finding Group IDs

### Method 1: From URL
1. Navigate to your group
2. Look at URL: `.../calculation-set-groups/5`
3. The `5` is your group ID

### Method 2: Use Helper Script
```bash
npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover"
```

This will:
- ✅ List all groups
- ✅ Extract their IDs
- ✅ Generate config code
- ✅ Export to CSV

---

## ⚙️ Configuration

### File: `tests/group-run-config.ts`

```typescript
export const ALL_GROUP_RUNS = [
  {
    groupName: 'KWFHBW - Pay Process',
    groupId: '5',
    payPeriodStart: '10/07/2026',
    payPeriodEnd: '10/07/2026',
    description: 'KWFHBW Weekly Pay Run',
    enabled: true,
    tags: ['weekly']
  },
  // Add more groups...
];
```

### Update All Pay Periods at Once
```typescript
import { updateAllPayPeriods } from './tests/group-run-config';

// In your code:
const groups = updateAllPayPeriods('10/07/2026', '10/13/2026');
```

---

## 📊 Output Files

### CSV Export
**Location:** `test-results/group-runs-[timestamp].csv`

```csv
Group Name,Success,Run ID,Message,Timestamp
"KWFHBW - Pay Process",true,8272a547,"Success",2026-05-20T10:30:00Z
```

### Screenshots
**Location:** `screenshots/`
- `before-run-[timestamp].png` - Before submission
- `error-group-run-[timestamp].png` - On errors

---

## 🎯 Common Workflows

### Weekly Pay Run (Same Period for All)
```bash
# 1. Update pay period in config
# 2. Run all groups
npx playwright test start-group-runs.spec.ts -g "all"
```

### Run Specific Groups Only
**Edit `group-run-config.ts`:**
```typescript
{
  groupName: 'Group 1',
  enabled: true,   // ← Will run
  // ...
},
{
  groupName: 'Group 2',
  enabled: false,  // ← Will skip
  // ...
}
```

### Run Tagged Groups
```typescript
// Config
tags: ['weekly', 'production']

// Use helper
import { getGroupsByTag } from './tests/group-run-config';
const weeklyGroups = getGroupsByTag('weekly');
```

---

## 🐛 Troubleshooting

### Can't Find Group ID?
```bash
npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover"
```

### Login Fails?
Update credentials in `.env`:
```bash
ASHLEY_USERNAME=your.email@ashleyfurniture.com
ASHLEY_PASSWORD=your_password
```

### Wrong Date Format?
Check existing runs to see format, then update:
```typescript
payPeriodStart: '10/07/2026'  // MM/DD/YYYY
```

### Button Not Found?
Update selectors in `start-group-runs.spec.ts`:
```typescript
const startButton = page.locator('button:has-text("START GROUP RUN")');
```

---

## 📚 Documentation

- **Full Guide:** `tests/GROUP_RUN_AUTOMATION_GUIDE.md`
- **Config File:** `tests/group-run-config.ts`
- **Main Script:** `tests/start-group-runs.spec.ts`
- **Helper Script:** `tests/helpers/find-group-ids.spec.ts`

---

## 💡 Pro Tips

1. **Always test with one group first:**
   ```bash
   npx playwright test start-group-runs.spec.ts -g "single" --headed
   ```

2. **Use tags to organize:**
   ```typescript
   tags: ['weekly', 'urgent', 'production']
   ```

3. **Check CSV for audit trail:**
   ```bash
   cat test-results/group-runs-*.csv
   ```

4. **Keep config separate:**
   - All groups in `group-run-config.ts`
   - Test logic in `start-group-runs.spec.ts`

5. **Use environment variables:**
   ```bash
   # .env file
   ASHLEY_USERNAME=your.email@ashleyfurniture.com
   ASHLEY_PASSWORD=your_password
   TEST_ENV=stage
   ```

---

## 🎉 Example: Complete Workflow

```bash
# 1. Find all your group IDs
npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover"

# 2. Copy output to tests/group-run-config.ts

# 3. Update pay periods in config file

# 4. Test with one group
npx playwright test start-group-runs.spec.ts -g "single" --headed

# 5. Run all groups
npx playwright test start-group-runs.spec.ts -g "all"

# 6. Check results
cat test-results/group-runs-*.csv
```

---

## ⏰ Scheduling (Optional)

### Windows Task Scheduler
```
Trigger: Weekly, Monday 8:00 AM
Action: powershell.exe
Arguments: -Command "cd C:\path\to\playwright-new; npx playwright test start-group-runs.spec.ts -g 'all'"
```

### Manual Weekly
```bash
# Every week, run:
npx playwright test start-group-runs.spec.ts -g "all"
```

---

**Need help?** Read the full guide:
```bash
cat tests/GROUP_RUN_AUTOMATION_GUIDE.md
```

**Happy Automating! 🚀**
