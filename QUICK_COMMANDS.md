# Quick Commands - Group Job Runs

## 🚀 Most Common Commands

### 1. Fetch SLFCAB Job Runs (Simplest)
```bash
node scripts/fetch-slfcab-job-runs.js
```
**Output:** `slfcab-group-job-runs.json`

---

### 2. Filter Existing Data (No Re-fetch)
```bash
# Get only successful runs
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED

# Get only failed runs
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=FAILED

# Get runs awaiting approval
node scripts/filter-job-runs.js slfcab-group-job-runs.json --submission="Awaiting Approval"

# Combine filters
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --submission="Awaiting Approval"
```

---

### 3. Fetch from Any Group
```bash
# List all available groups
node scripts/fetch-group-job-runs-universal.js --list

# Fetch specific group
node scripts/fetch-group-job-runs-universal.js "<GroupName>"

# With filters
node scripts/fetch-group-job-runs-universal.js "SLFCAB" --status=SUCCEEDED
```

---

## 📊 Current Data Files

| File | Description | Runs |
|------|-------------|------|
| `slfcab-group-job-runs.json` | All SLFCAB runs | 9 total |
| `slfcab-group-job-runs-filtered.json` | Only successful SLFCAB runs | 7 succeeded |

---

## 🎯 Common Use Cases

### Get only successful runs ready for approval
```bash
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=SUCCEEDED --submission="Awaiting Approval"
```

### Get only failed runs
```bash
node scripts/filter-job-runs.js slfcab-group-job-runs.json --status=FAILED
```

### Re-fetch latest data from server
```bash
node scripts/fetch-slfcab-job-runs.js
```

---

## 💡 Tips

1. **Use offline filter** for quick filtering without re-fetching
2. **Re-fetch** only when you need latest data from server
3. **Partial matching** works for group names (e.g., "SLFCAB" matches "SLFCAB - Pay Process")

---

## 📖 Full Documentation

- **`GROUP_JOB_RUNS_SCRIPTS_SUMMARY.md`** - Complete overview of all scripts
- **`FETCH_JOB_RUNS_GUIDE.md`** - Detailed guide for universal script
